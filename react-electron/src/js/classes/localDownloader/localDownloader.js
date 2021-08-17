import Lock from './../../classes/lock/lock'
import Logging from '../../utils/logging'
import DateUtils from './../../utils/date-utils'
import File from '../../utils/file'
import Text from '../../utils/text'
import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
//import { Config } from 'aws-sdk'
import NotDef from './../../utils/not-def'
import Nums from './../../utils/nums'
import Time from './../../utils/time'
import firstEqualsOneOfTheOthers from '../../utils/first-equals-one-of-the-others'

const aws = require('aws-sdk')
const crypto = require('crypto')
const fs = window.require('fs')
const { FILE_STATUSES, CHUNK_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS
const { SECONDS, MILLISECONDS } = DateUtils.TIME_UNITS
const { indent, addIndent } = Text
const { defined, defaultTo, defaultToNotDefined, defaultToZero, defaultToFalse } = NotDef
const { sleep } = Time
const { 
  tinctured: tint, 
  options: {
    red, white, green, yellow,
    black, bgGreen, bgRed, bright,
    cyan, reset, magenta 
  } 
} = require('tinctured')
var config
try {
  config = JSON.parse(File.getContent(LOCAL_DOWNLOADING_CONSTANTS.CONFIG_FILE))
}
catch(error) {
  Logging.logError("Error trying to initialize localDownloader's config", error)
}

class LocalDownloader {
  constructor(
    sourceFile,
    assignedUserEmail,
    contactName,
    contactEmail,
    contactPhone,
    veriSuiteJobId,
    env = LOCAL_DOWNLOADING_CONSTANTS.ENVS.PROD_ENV,
    ...props
  ) {
    this.sourceFile = sourceFile
    this.assignedUserEmail = assignedUserEmail
    this.contactName = contactName
    this.contactEmail = contactEmail
    this.contactPhone = contactPhone
    this.veriSuiteJobId = veriSuiteJobId
    this.env = env
    this.dateDisplay = DateUtils.GetDateDisplay()

    try {
      this.downloadLocally(this.sourceFile, this.env)
    } catch(error) {
      Logging.logError("ERROR in constructor method of LocalDownloader", error)
    }
  }

  getJobNumbersFromFile(sourceFile) {
    try{
      let contents = File.getContent(sourceFile)
      let jobNumbers = contents.replace(/\s+/g, '').split(',')

      Logging.log("localDownloader.getJobNumbersFromFile()...", "contents:", contents, "jobNumbers", jobNumbers)

      return jobNumbers
    }
    catch(error) {
      Logging.logError("ERROR in localDownloader.getJobNumbersFromFile()", error)
      alert("Unable to read or parse job-number file. Please check the file and try again")
    }
  }

  removeNonFiles(originalFiles) {
    let files = originalFiles.slice().filter( file => !file.Key.endsWith("/") )

    return files
  }

  async getS3FileList(
    bucket,
    parentFolder,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    try {
      const s3 = new aws.S3({
        //endpoint: new aws.Endpoint(LOCAL_DOWNLOADING_CONSTANTS.getS3AccelerateEndpointString(bucket)),
        //endpoint: new aws.Endpoint(`${bucket}.s3-accelerate.amazonaws.com`),
        endpoint: `s3.${config.region}.amazonaws.com`,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        Bucket: bucket,
        signatureVersion: signatureVersion,
        region: region
      })
      let params = {
        Bucket:bucket,
        Prefix: `${parentFolder}/`
      }

      //GET LIST OF FILES
      const responseFromS3ListObjectsV2 = await s3.listObjectsV2(params).promise()
      let files = this.removeNonFiles(responseFromS3ListObjectsV2.Contents)

      // GET FILE TYPE FOR EACH FILE
      for (let i = 0; i < files.length; i++) {
        let headObjectParams = { Bucket: bucket, Key: files[i].Key }

        let headObjectResponse = await s3.headObject(headObjectParams).promise()

        if(defined(headObjectResponse, "ContentType")) { files[i].ContentType = headObjectResponse.ContentType }
      }
      Logging.log("localDownloader.getS3FileList()...", "files after getting Content-Type:", files)

      return files
    }
    catch(error) {
      Logging.logError("ERROR inside localDownloader.getS3FileList()", error)
    }
  }

  async getFilesForEachJob(jobNumbers, env) {
    let filesForEachJob = [] 
    
    for (let i = 0; i < jobNumbers.length; i++) {
      let filesForCurrentJob = await this.getS3FileList(LOCAL_DOWNLOADING_CONSTANTS[env].SOURCE_BUCKET, jobNumbers[i])

      filesForEachJob[i] = filesForCurrentJob
    }

    return filesForEachJob
  }

  async checkIntegrityOfFile(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex,
    filePath
    //targetParentDirectory,
    //necessaryNumberOfChunks,
    //chunkSemaphore,
    //fileSemaphore
  ) {
    /*
    let hashOfLocalCopyOfFile = crypto.createHash('md5')
    let stream = fs.createReadStream(filePath)

    stream.on('data', function (data) {
      hashOfLocalCopyOfFile.update(data, 'utf8')
    })

    await stream.on('end', function () {
      hashOfLocalCopyOfFile.digest('hex') // 34f7a3113803f8ed3b8fd7ce5656ebec
    })
    */
    let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
    //currentFile.hashOfLocalCopy = await File.getMd5Hash(filePath)
    currentFile.sizeOfLocalCopy = File.getSizeInBytes(filePath)

    //Logging.log(`filePath: ${filePath}; hashOfLocalCopy: ${currentFile.hashOfLocalCopy}`)

    //if(currentFile.ETag === currentFile.hashOfLocalCopy) {
    if(currentFile.Size === currentFile.sizeOfLocalCopy) {
      currentFile.integrityCheckPass = true

      currentFile.fileStatus = FILE_STATUSES.COMPLETE
    }
    else {
      currentFile.integrityCheckPass = false
      currentFile.integrityError = {
        message: "Integrity Check Failed"
      }

      currentFile.fileStatus = FILE_STATUSES.ERROR
    }

    Logging.log("currentFile after saving results of hash check:", currentFile)
  }

  async appendS3FileData(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex,
    targetParentDirectory,
    necessaryNumberOfChunks,
    chunkSemaphore,
    fileSemaphore
  ) {
    let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
    let filePath = `${targetParentDirectory}${currentFile.Key.replace(/\//g, '\\')}`
    let stream = await fs.createWriteStream(filePath, { flags: 'a' })
    let appendedFinalChunk = false
    let experiencedAppendingError = false
    let currentChunkIndex = 0

    while(!appendedFinalChunk && !experiencedAppendingError) {
      let currentChunk = currentFile.chunks[currentChunkIndex]
      let appendedCurrentChunk = false

      try {
        if(defined(currentChunk.s3Response) && defaultToNotDefined(currentChunk.ChunkStatus) !== CHUNK_STATUSES.CANCELLED_BY_ERROR_IN_OTHER_CHUNK) {
          let currentChunkData = currentChunk.s3Response.Body

          let appendChunkDataResult = await stream.write(currentChunkData)

          currentChunk.appendChunkDataResult = appendChunkDataResult  
          currentChunk.s3Response = null
          appendedCurrentChunk = true

          await currentFile.lockToReleaseFileResources.acquire()

          try {
            let chunkHadBeenAlreadyBeenCancelled = (defaultToNotDefined(currentChunk.ChunkStatus) === CHUNK_STATUSES.CANCELLED_BY_ERROR_IN_OTHER_CHUNK ? true : false)
            currentChunk.chunkStatus = CHUNK_STATUSES.COMPLETE

            if(currentChunkIndex === necessaryNumberOfChunks - 1) {
              //currentFile.fileStatus = FILE_STATUSES.CHECKING_DATA_INTEGRITY
              currentFile.fileStatus = FILE_STATUSES.COMPLETE
              appendedFinalChunk = true
            }

            if(!chunkHadBeenAlreadyBeenCancelled) {
              chunkSemaphore.leave()

              if(currentChunkIndex === necessaryNumberOfChunks - 1) {
                fileSemaphore.leave(this.getNumberOfFilePointsForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex))
              }
            }
          }
          finally {
            currentFile.lockToReleaseFileResources.release()
          }

          currentChunkIndex++
        }
        else if (defaultToNotDefined(currentChunk.ChunkStatus) === CHUNK_STATUSES.CANCELLED_BY_ERROR_IN_OTHER_CHUNK) {
          throw `chunk with index ${currentChunkIndex} had status of ${CHUNK_STATUSES.CANCELLED_BY_ERROR_IN_OTHER_CHUNK}`
        }
      }
      catch(error) {
          experiencedAppendingError = true
          currentChunk.s3Response = null
          currentFile.appendFileDataError = { chunkIndex: currentChunkIndex, error: error }
          currentChunk.appendFileDataError = error

          this.releaseResourcesAfterChunkError(
            jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex,
            currentChunkIndex, chunkSemaphore, fileSemaphore
          )

          Logging.log(`ERROR WHILE APPENDING FOR CHUNK WITH INDEX ${currentChunkIndex} FROM A TOTAL OF ${necessaryNumberOfChunks} NECESSARY CHUNKS`)
          //#alert(`ERROR WHILE APPENDING FOR CHUNK WITH INDEX ${currentChunkIndex} FROM A TOTAL OF ${necessaryNumberOfChunks} NECESSARY CHUNKS`)
      }

      if(!appendedCurrentChunk && !experiencedAppendingError) { await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_IF_UNABLE_TO_START_APPENDING_CHUNK_DATA_MILLISECONDS) }
    }

    stream.end()

    //this.checkIntegrityOfFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex, filePath)
  }

  printFileAndChunkStatuses(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex
  ) {
    Logging.log(`Current File Status: ${filesForEachJob[currentJobIndex][currentFileIndex].fileStatus}`)

    for (let currentChunkIndex = 0; currentChunkIndex < filesForEachJob[currentJobIndex][currentFileIndex].chunks.length; currentChunkIndex++) {
      let chunk = filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex]
      Logging.log(`\tchunk index ${currentChunkIndex}:\n\t\tchunk status: ${chunk.chunkStatus}\n\t\tis s3Reponse defined: ${defined(chunk.s3Response)}`)
    }
  }

  async releaseResourcesAfterChunkError (
    jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex,
    errorChunkIndex, chunkSemaphore, fileSemaphore
  ) {
    const { DOWNLOAD_CHUNK_FUNCTION_NOT_YET_CALLED, COMPLETE, ERROR, CANCELLED_BY_ERROR_IN_OTHER_CHUNK } = CHUNK_STATUSES
    let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
    let errorChunk = currentFile.chunks[errorChunkIndex]

    await currentFile.lockToReleaseFileResources.acquire()

    try {
      let anotherChunkAlreadyHadAnError = (defaultToNotDefined(currentFile.fileStatus) === FILE_STATUSES.ERROR ? true : false)
      errorChunk.chunkStatus = CHUNK_STATUSES.ERROR
      currentFile.fileStatus = FILE_STATUSES.ERROR

      if(!anotherChunkAlreadyHadAnError) {
        for (let currentChunkIndex = 0; currentChunkIndex < currentFile.chunks.length; currentChunkIndex++) {
          let currentChunk = currentFile.chunks[currentChunkIndex]

          if(defined(currentChunk.s3Response)) { currentChunk.s3Response = null }

          if(!firstEqualsOneOfTheOthers(currentChunk.chunkStatus, DOWNLOAD_CHUNK_FUNCTION_NOT_YET_CALLED, COMPLETE, CANCELLED_BY_ERROR_IN_OTHER_CHUNK)) {
            chunkSemaphore.leave()
          }
          if(currentChunkIndex !== errorChunkIndex && !firstEqualsOneOfTheOthers(currentChunk.chunkStatus, COMPLETE, ERROR)) {
            currentChunk.chunkStatus = CANCELLED_BY_ERROR_IN_OTHER_CHUNK
          }
        }

        fileSemaphore.leave(this.getNumberOfFilePointsForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex))
      }
    }
    finally {
      currentFile.lockToReleaseFileResources.release()
    }
  }

  async downloadChunkForFile(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex, 
    targetParentFileDirectory,
    bucket,
    chunkSemaphore,
    fileSemaphore,
    currentChunkIndex,
    byteRangeStart,
    byteRangeEnd,
    necessaryNumberOfChunks,
    fileContentType,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
    let currentChunk = currentFile.chunks[currentChunkIndex]
    currentChunk.chunkStatus = CHUNK_STATUSES.SENDING_REQUEST
    let s3 = new aws.S3({
      endpoint: new aws.Endpoint(Text.convertToUtf8(`${bucket}.s3-accelerate.amazonaws.com`)),
      useAccelerateEndpoint: true,
      accessKeyId: Text.convertToUtf8(accessKeyId),
      secretAccessKey: Text.convertToUtf8(secretAccessKey),
      Bucket: Text.convertToUtf8(bucket),
      signatureVersion: Text.convertToUtf8(signatureVersion),
      region: Text.convertToUtf8(region)
    })
    let params = {
      Bucket: Text.convertToUtf8(bucket),
      Key: Text.convertToUtf8(currentFile.Key),
      Range: Text.convertToUtf8(`bytes=${byteRangeStart}-${byteRangeEnd}`),
      
      ResponseContentType: Text.convertToUtf8(fileContentType),
      ResponseContentLanguage: Text.convertToUtf8('en-US')
      //ResponseExpires: '',
      //ResponseCacheControl: 'STRING_VALUE',
      //ResponseContentDisposition: 'STRING_VALUE',
      //ResponseContentEncoding: 'STRING_VALUE',
    }
    let data
    let currentTryIndex = 0
    let maxTries = LOCAL_DOWNLOADING_CONSTANTS.DOWNLOAD_MAX_TRIES
    let success = false
    currentChunk.s3GetObjectParams = params

    while(currentTryIndex < maxTries && !success) {
      try {
        data = await s3.getObject(params).promise()

        if(defined(data.$response.error)) {throw data.$response.error }

        currentChunk.chunkStatus = CHUNK_STATUSES.SAVING_TO_DISK
        success = true
      }
      catch(error) {
        currentTryIndex++

        if(currentTryIndex === maxTries) { 
          Logging.logError(`ERROR in localDownloader.downloadFileForJob() at s3.getObject (currentTryIndex === maxTries; currentTryIndex: ${currentTryIndex}; maxTries: ${maxTries})`, error)
          Logging.log("params used for s3.getObject call:", params, "data from s3.getObject call that threw error:", data)
          //#alert(`s3 returned an error for the following file chunk:\n\tBucket: ${params.Bucket}\n\tKey: ${params.Key}\n\tCurrent Chunk Index: ${currentChunkIndex}`)

          currentFile.downloadError = {chunkIndex: currentChunkIndex, error: error }
          currentChunk.downloadError = error

          this.releaseResourcesAfterChunkError(
            jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex,
            currentChunkIndex, chunkSemaphore, fileSemaphore
          )

          Logging.log("file that just threw error:", currentFile)
          Logging.log(`errors for current file (job index: ${currentJobIndex}; file index: ${currentFileIndex}):`)
          Logging.log(`\n${addIndent(this.stringifyFileErrors(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex), 1)}`)

          throw error 
        } 
        else {
          Logging.log(`ERROR in localDownloader.downloadFileForJob() at s3.getObject (currentTryIndex: ${currentTryIndex}; maxTries: ${maxTries})`, error)
          Logging.log("params used for s3.getObject call:", params, "data from s3.getObject call that threw error:", data)

          await sleep(LOCAL_DOWNLOADING_CONSTANTS.DOWNLOAD_RETRY_TIMEOUT)
        }
      }
    }

    // SAVE CHUNK'S DOWNLOAD RESPONSE
    currentChunk.downloadResponse = {
      error: data.$response.error,
      statusCode: data.$response.statusCode,
      statusMessage: data.$response.statusMessage
    }

    // APPEND CHUNK DATA TO FILE
    if(
      !defined(currentFile.downloadError) 
      && !defined(data.$response.error)
      && defined(currentChunk.chunkStatus)
      && !firstEqualsOneOfTheOthers(
        currentChunk.chunkStatus, CHUNK_STATUSES.ERROR, CHUNK_STATUSES.CANCELLED_BY_ERROR_IN_OTHER_CHUNK
      )
    ) {
      currentChunk.s3Response = data // data.Body

      if(currentChunkIndex === 0) {
        await this.appendS3FileData(
          jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex, targetParentFileDirectory,
          necessaryNumberOfChunks, chunkSemaphore, fileSemaphore
        )
      }
    }
  }

  async downloadFileForJob(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex, 
    targetParentFileDirectory,
    bucket,
    chunkSemaphore,
    fileSemaphore,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    try {
      // INITIALIZE VARIABLES
      let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
      currentFile.fileStatus = FILE_STATUSES.DOWNLOADING_AND_SAVING_TO_DISK
      currentFile.lockToReleaseFileResources = new Lock()
      currentFile.chunks = [] //new Array(necessaryNumberOfChunks)
      let chunkSizeInBytes = LOCAL_DOWNLOADING_CONSTANTS.CHUNK_SIZE_IN_BYTES
      let necessaryNumberOfChunks = this.getNecessaryNumberOfChunksForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex)
      
      for (let currentChunkIndex = 0; currentChunkIndex < necessaryNumberOfChunks; currentChunkIndex++) {
        let newChunk = { chunkStatus: CHUNK_STATUSES.DOWNLOAD_CHUNK_FUNCTION_NOT_YET_CALLED }

        currentFile.chunks[currentChunkIndex] = newChunk 
      }

      let contentType = defaultTo(currentFile.ContentType, LOCAL_DOWNLOADING_CONSTANTS.CONTENT_TYPE_DEFAULT)
      let byteRangeStart, byteRangeEnd = 0
      let filePath = `${targetParentFileDirectory}${currentFile.Key.replace(/\//g, '\\')}`
      File.makeDirIfItDoesNotExist(File.removeNameFromPath(filePath))

      // DOWNLOAD THE FILE'S DATA IN CHUNKS
      for (let currentChunkIndex = 0;
        currentChunkIndex < necessaryNumberOfChunks && currentFile.fileStatus !== FILE_STATUSES.ERROR;
        currentChunkIndex++
      ) {
        let calledDownloadChunkFunction = false
        byteRangeStart = chunkSizeInBytes * currentChunkIndex
        if(currentChunkIndex === necessaryNumberOfChunks - 1) {
          byteRangeEnd = currentFile.Size - 1
        } else {
          byteRangeEnd = ( chunkSizeInBytes * (currentChunkIndex + 1) ) - 1
        }

        while(!calledDownloadChunkFunction && currentFile.fileStatus !== FILE_STATUSES.ERROR) {
          if(chunkSemaphore.available() && currentFile.fileStatus !== FILE_STATUSES.ERROR) {
            if(currentChunkIndex > 0) {
              // eslint-disable-next-line no-loop-func
              await chunkSemaphore.take(() => {
                this.downloadChunkForFile(
                  jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex, targetParentFileDirectory,
                  bucket, chunkSemaphore, fileSemaphore, currentChunkIndex, byteRangeStart, byteRangeEnd,
                  necessaryNumberOfChunks, contentType, region, accessKeyId, secretAccessKey, signatureVersion
                )
              })
            }
            else {
              this.downloadChunkForFile(
                jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex, targetParentFileDirectory,
                bucket, chunkSemaphore, fileSemaphore, currentChunkIndex, byteRangeStart, byteRangeEnd,
                necessaryNumberOfChunks, contentType, region, accessKeyId, secretAccessKey, signatureVersion
              )
            }

            calledDownloadChunkFunction = true
          }
          if(!calledDownloadChunkFunction) { await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_IF_UNABLE_TO_START_CHUNK_DOWNLOAD_MILLISECONDS) }
        }
      }
    }
    catch(error) {
      Logging.logError("ERROR inside localDownloader.downloadFileForJob()", error)
    }
  }

  async downloadFilesForJob(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    targetParentFileDirectory,
    bucket,
    chunkSemaphore,
    fileSemaphore,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
      let calledDownloadFileFunction = false
      let filePointsForCurrentFile = this.getNumberOfFilePointsForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex)

      while(!calledDownloadFileFunction) {
        if(chunkSemaphore.available(LOCAL_DOWNLOADING_CONSTANTS.MIN_NUMBER_OF_FREE_CHUNK_TICKETS_TO_START_FILE_DOWNLOAD)) {
          await fileSemaphore.take(filePointsForCurrentFile,
            async () => {
              await chunkSemaphore.take(() => {
                this.downloadFileForJob(
                  jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex, targetParentFileDirectory,
                  bucket, chunkSemaphore, fileSemaphore, region, accessKeyId, secretAccessKey, signatureVersion
                )}
              )
            }
          )

          calledDownloadFileFunction = true
        }

        if(!calledDownloadFileFunction) { await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_IF_UNABLE_TO_START_JOB_DOWNLOAD_MILLISECONDS) }
      }
    }
  }

  deleteExistingJobFolders(jobNumbers, targetParentFileDirectory) {
    for (let jobNumberIndex = 0; jobNumberIndex < jobNumbers.length; jobNumberIndex++) {
      File.deleteDirIfItExists(`${targetParentFileDirectory}${jobNumbers[jobNumberIndex]}\\`)
    }
  }

  getNecessaryNumberOfChunksForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex) {
    let necessaryNumberOfChunks = Math.ceil(filesForEachJob[currentJobIndex][currentFileIndex].Size / LOCAL_DOWNLOADING_CONSTANTS.CHUNK_SIZE_IN_BYTES)

    return necessaryNumberOfChunks
  }

  getNumberOfFilePointsForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex) {
    let necessaryNumberOfChunks = this.getNecessaryNumberOfChunksForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex)

    let result = Math.min(LOCAL_DOWNLOADING_CONSTANTS.MAX_NUMBER_OF_FILE_POINTS_PER_FILE, necessaryNumberOfChunks)

    return result
  }

  async downloadFilesForEachJob(jobNumbers, filesForEachJob, env, targetParentFileDirectory) {
    let chunkSemaphore = require('semaphore')(LOCAL_DOWNLOADING_CONSTANTS.MAX_NUMBER_OF_ACTIVE_CHUNKS)
    let fileSemaphore = require('semaphore')(LOCAL_DOWNLOADING_CONSTANTS.MAX_NUMBER_OF_FILE_POINTS)
    this.printSemaphoreStatusUpdate(chunkSemaphore, fileSemaphore)

    this.deleteExistingJobFolders(jobNumbers, targetParentFileDirectory)

    for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
      let calledDownloadFilesFunction = false

      while(!calledDownloadFilesFunction) {
        if(
          chunkSemaphore.available(LOCAL_DOWNLOADING_CONSTANTS.MIN_NUMBER_OF_FREE_CHUNK_TICKETS_TO_START_FILE_DOWNLOAD)
          && fileSemaphore.available(LOCAL_DOWNLOADING_CONSTANTS.MIN_NUMBER_OF_FREE_FILE_POINTS_TO_START_FILE_DOWNLOAD)
        ) {
          this.downloadFilesForJob(
            jobNumbers, filesForEachJob, currentJobIndex, targetParentFileDirectory,
            LOCAL_DOWNLOADING_CONSTANTS[env].SOURCE_BUCKET, chunkSemaphore, fileSemaphore)

          calledDownloadFilesFunction = true
        }

        if(!calledDownloadFilesFunction) { await sleep( LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_IF_UNABLE_TO_START_FILE_DOWNLOAD_MILLISECONDS) }
      }
    }
  }

  async downloadLocally(sourceFile, env) {
    let startTimeOfOverallDownload = Date.now()
    let jobNumbers = this.getJobNumbersFromFile(sourceFile)

    let filesForEachJob = await this.getFilesForEachJob(jobNumbers, env)
    let targetParentFileDirectory = File.removeNameFromPath(sourceFile)

    this.printStatusUpdate(filesForEachJob, jobNumbers)
    Logging.log("downloadLocally() targetParentFileDirectory:", targetParentFileDirectory)

    await this.downloadFilesForEachJob(jobNumbers, filesForEachJob, env, targetParentFileDirectory)

    this.pollToSeeIfDownloadsAreComplete(jobNumbers, filesForEachJob, startTimeOfOverallDownload)
  }

  async printSemaphoreStatusUpdate(chunkSemaphore, fileSemaphore) {
    while(true) {
      Logging.log(`CURRENT TIME: ${DateUtils.GetDateDisplay()} `, "chunkSemaphore:", chunkSemaphore, "fileSemaphore:", fileSemaphore)
      
      await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_BETWEEN_PRINTING_STATUS_UPDATES_MILLISECONDS)
    }
  }

  checkIntegrityOfFilesDownloaded(filesForEachJob, jobNumbers) {
    let result = true

    for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
      const currentJob = filesForEachJob[currentJobIndex]

      for (let currentFileIndex = 0; currentFileIndex < currentJob.length; currentFileIndex++) {
        const currentFile = currentJob[currentFileIndex]
        
        if(!defaultToFalse(currentFile.integrityCheckPass)) {
          result = false
        }
      }
    }

    return `${result}`
  }

  async printStatusUpdate(filesForEachJob, jobNumbers, includeChunks = true) {
    while(true) {

      let report = `${tint("CURRENT STATUS", { cyan, bright })}${tint("", { white })}`
      report += `${indent(1)}${tint("Current Time: ", { reset })}${DateUtils.GetDateDisplay()}`
      report += `${indent(1)}Veritext Jobs (by index):`

      for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
        const currentJob = filesForEachJob[currentJobIndex];
        report += `${indent(2)}${tint(`job ${currentJobIndex}:`, { magenta })}${tint("", { white })}`
        report += `${indent(3)}Job Number: ${jobNumbers[currentJobIndex]}`
        report += `${indent(3)}Files (by index):`

        for (let currentFileIndex = 0; currentFileIndex < currentJob.length; currentFileIndex++) {
          const currentFile = currentJob[currentFileIndex];
          
          report += `${indent(4)}${tint(`file ${currentFileIndex}:`, { cyan })}${tint("", { white })}`
          report += `${indent(5)}Key:\t\t  ${currentFile.Key}`
          report += `${indent(5)}fileStatus: ${defined(currentFile.fileStatus) ? (currentFile.fileStatus.replace(FILE_STATUSES.COMPLETE, tint(FILE_STATUSES.COMPLETE, { bgGreen })).replace(FILE_STATUSES.ERROR, tint(FILE_STATUSES.ERROR, { bgRed }))) : tint("NOT defined", { yellow })}${tint("", { white })}`
          report += `${indent(5)}Size:\t\t  ${Nums.withCommas(currentFile.Size)}`

          if(
            includeChunks
            && defined(currentFile.chunks)
            && (!defined(currentFile.fileStatus) || currentFile.fileStatus !== FILE_STATUSES.COMPLETE)
          ) {
            report += `${indent(5)}Chunks (by index):`

            for (let currentChunkIndex = 0; currentChunkIndex < currentFile.chunks.length; currentChunkIndex++) {
              const currentChunk = currentFile.chunks[currentChunkIndex]

              report += `${indent(6)}chunk ${currentChunkIndex}:`
              report += `${indent(7)}chunkStatus: ${defined(currentChunk.chunkStatus) ? (currentChunk.chunkStatus.replace(CHUNK_STATUSES.COMPLETE, tint(CHUNK_STATUSES.COMPLETE, { green })).replace(CHUNK_STATUSES.ERROR, tint(CHUNK_STATUSES.ERROR, { red }))) : tint("NOT defined", { yellow })}${tint("", { white })}`
            }
          }
          else if(
            includeChunks
            && (!defined(currentFile.fileStatus) || currentFile.fileStatus !== FILE_STATUSES.COMPLETE)
          ) {
            report += `${indent(5)}Chunks defined: ${defined(currentFile.chunks) ? "defined" : tint("NOT defined", { yellow })}${tint("", { white })}`
          }
        }
      }

      report += "\n"

      Logging.log(report)

      //this.printFinalReport(jobNumbers, filesForEachJob)

      await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_BETWEEN_PRINTING_STATUS_UPDATES_MILLISECONDS)
    }
  }

  async pollToSeeIfDownloadsAreComplete(jobNumbers, filesForEachJob, startTimeOfOverallDownload) {
    let allDownloadsComplete = false 

    while(!allDownloadsComplete) {
      let breakOut = false

      for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
        for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
          let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
          if(
            !defined(currentFile.fileStatus)
            || (
              defined(currentFile.fileStatus)
              && !firstEqualsOneOfTheOthers(currentFile.fileStatus, FILE_STATUSES.COMPLETE, FILE_STATUSES.ERROR)
            )
          ) { breakOut = true }

          if(breakOut) { break }
        }

        if(breakOut) { break }
      }

      if(!breakOut) { allDownloadsComplete = true }
      else { await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_BETWEEN_POLLS_TO_SEE_IF_DOWNLOADS_ARE_COMPLETE_MILLISECONDS) }
    }

    let endTimeOfOverallDownload = Date.now()
    this.printFinalReport(jobNumbers, filesForEachJob, startTimeOfOverallDownload, endTimeOfOverallDownload)
  }

  initializeListOfFilesPerStatus() {
    let result = { 
      NOT_DEFINED: {
        array: []
      }
    }

    for (const key in FILE_STATUSES) {
      if(FILE_STATUSES.hasOwnProperty(key)) {
        result[key] = {
          array: []
        }
      }
    }

    return result
  }

  initializeListOfChunksPerStatus() {
    let result = { 
      NOT_DEFINED: {
        array: [],
        totalChunkCount: 0
      }
    }

    for (const key in CHUNK_STATUSES) {
      if(CHUNK_STATUSES.hasOwnProperty(key)) {
        result[key] = {
          array: [],
          totalChunkCount: 0
        }
      }
    }

    return result
  }

  initializeListOfChunksPerStatusForFile(fileIndex) {
    let result = {
      NOT_DEFINED: {
        fileIndex: fileIndex,
        array: []
      }
    }

    for(const key in CHUNK_STATUSES) {
      if(CHUNK_STATUSES.hasOwnProperty(key)) {
        result[key] = {
          fileIndex: fileIndex,
          array: []
        }
      }
    }
  }

  addChunksForCurrentFileToChunksPerStateList(listOfChunksPerStatusForCurrentFile, chunksPerState) {
    for(const key in listOfChunksPerStatusForCurrentFile) {
      if(listOfChunksPerStatusForCurrentFile.hasOwnProperty(key)) {
        chunksPerState[key].push(listOfChunksPerStatusForCurrentFile[key])
        chunksPerState[key].totalChunkCount += listOfChunksPerStatusForCurrentFile[key].length
      }
    }
  }

  stringifyFileErrors(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex) {
    Logging.log(`file with Errors (job index ${currentJobIndex}, file index ${currentFileIndex}):`)
    Logging.log(`filesForEachJob[currentJobIndex][currentFileIndex]:`, filesForEachJob[currentJobIndex][currentFileIndex])

    let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]

    let result = ""

    if(defined(currentFile.downloadError)) {
      Logging.log("currentFile.downloadError is defined")

      result += `${indent(0)}${tint("Download Error:", { bgRed })}${tint("", { white })}`
      result += `${indent(1)}${tint("Code:", { bgRed })}${tint("", { white })} ${tint(currentFile.downloadError.error.code, { red })}${tint("", { white })}`
      result += `${indent(1)}Message: ${currentFile.downloadError.error.message}`
      result += `${indent(1)}Status Code: ${currentFile.downloadError.error.statusCode}`
      result += `${indent(1)}RequestId: ${currentFile.downloadError.error.requestId}`

      Logging.log("result after adding downloadError:", result)
    }
    if(defined(currentFile.appendFileDataError)) {
      Logging.log("currentFile.appendFileDataError is defined")
      result += `${indent(0)}Append File-Data Error: ${JSON.stringify(currentFile.appendFileDataError)}`
      Logging.log("result after adding appendFileDataError:", result)
    }

    let chunkLevelErrors = ""
    
    for (let currentChunkIndex = 0; currentChunkIndex < currentFile.chunks.length; currentChunkIndex++) {
      const currentChunk = currentFile.chunks[currentChunkIndex];
      
      if(defined(currentChunk.downloadError) || defined(currentChunk.appendFileDataError)) {
        Logging.log("currentChunk.downloadError or currentChunk.appendFileDataError is defined")

        chunkLevelErrors += `${indent(1)}Chunk Index ${currentChunkIndex}:`

        if(defined(currentChunk.downloadError)) {
          Logging.log("currentChunk.downloadError is defined")

          chunkLevelErrors += `${indent(2)}${tint("Download Error:", { red })}${tint("", { white })}`
          chunkLevelErrors += `${indent(3)}${tint("Code:", { red })}${tint("", { white })} ${currentChunk.downloadError.code}${tint("", { white })}`
          chunkLevelErrors += `${indent(3)}Message: ${currentChunk.downloadError.message}`
          chunkLevelErrors += `${indent(3)}RequestId: ${currentChunk.downloadError.requestId}`

          Logging.log("chunkLevelErrors after adding downloadError:", chunkLevelErrors)
        }
        if(defined(currentChunk.appendFileDataError)) {
          Logging.log("currentChunk.appendFileDataError is defined")

          chunkLevelErrors += `${indent(2)}Append File-Data Error: ${JSON.stringify(currentChunk.appendFileDataError)}`}

          Logging.log("chunkLevelErrors after adding appendFileDataError:", chunkLevelErrors)
      }
    }

    if(chunkLevelErrors !== "") {
      Logging.log("chunkLevelErrors was not equal to an empty string.")
      result += `${indent(0)}Chunk-Level Errors:${chunkLevelErrors}`

      Logging.log("result after adding chunkLevelErrors:", result)
    }

    return result
  }

  printFinalReport(jobNumbers, filesForEachJob, startTimeOfOverallDownload, endTimeOfOverallDownload) {
    let filesPerState = this.initializeListOfFilesPerStatus()
    let chunksPerState = this.initializeListOfChunksPerStatus()
    let timeElapsed = 0
    if(defined(endTimeOfOverallDownload) && defined(startTimeOfOverallDownload)) {
      timeElapsed = endTimeOfOverallDownload - startTimeOfOverallDownload
    }
    let totalNumberOfFiles = 0
    let totalPossibleBytesToDownload = 0
    let totalBytesDownloaded = 0

    for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
      const currentJob = filesForEachJob[currentJobIndex];
      totalNumberOfFiles += currentJob.length
      
      for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
        const currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
        totalPossibleBytesToDownload += currentFile.Size

        if((defined(currentFile.fileStatus) && currentFile.fileStatus === FILE_STATUSES.COMPLETE) || !defined(currentFile.fileStatus)) {
          if(defined(currentFile.fileStatus)) {
            totalBytesDownloaded += currentFile.Size
            chunksPerState[CHUNK_STATUSES.COMPLETE].totalChunkCount += currentFile.chunks.length
          }

          let necessaryNumberOfChunks = this.getNecessaryNumberOfChunksForFile([], filesForEachJob, currentJobIndex, currentFileIndex)

          filesPerState[defaultToNotDefined(currentFile.fileStatus)].array.push({ jobIndex: currentJobIndex, fileIndex: currentFileIndex })
          chunksPerState[defaultToNotDefined(CHUNK_STATUSES.COMPLETE)].array.push({
            jobIndex: currentJobIndex, 
            fileIndex: currentFileIndex,
            includesEveryChunkOfFile: true,
            necessaryNumberOfChunks: necessaryNumberOfChunks
          })
        }
        else if (defined(currentFile.fileStatus)) {
          filesPerState[currentFile.fileStatus].array.push({ fileIndex: currentFileIndex })
          let listOfChunksPerStatusForCurrentFile = this.initializeListOfChunksPerStatusForFile(currentFileIndex)

          for (let currentChunkIndex = 0; currentChunkIndex < filesForEachJob[currentJobIndex][currentFileIndex].chunks.length; currentChunkIndex++) {
            const currentChunk = filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex]

            if(currentChunk.chunkState === CHUNK_STATUSES.COMPLETE) {
              totalBytesDownloaded += LOCAL_DOWNLOADING_CONSTANTS.CHUNK_SIZE_IN_BYTES
            }
          
            listOfChunksPerStatusForCurrentFile[defaultToNotDefined(currentChunk.chunkStatus)].array.push( { chunkIndex: currentChunkIndex } )
          }

          this.addChunksForCurrentFileToChunksPerStateList(listOfChunksPerStatusForCurrentFile, chunksPerState)
        }
      } 
    }

    let rawSpeedMbps = (File.UNITS.convertDataUnits(totalBytesDownloaded, File.UNITS.B, File.UNITS.Mb)/(DateUtils.convertTimeUnits(timeElapsed, MILLISECONDS, SECONDS)))
    //let fileIntegrityCheck = this.checkIntegrityOfFilesDownloaded(filesForEachJob, jobNumbers)
    let report = ""
    
    report += `\nPercentage of Files Successfully Downloaded: ${Nums.percentage(defaultToZero(filesPerState[FILE_STATUSES.COMPLETE].array.length), totalNumberOfFiles, 2)}%`
    report += `\nNumber of Files Successfully Downloaded: ${Nums.withCommas(defaultToZero(filesPerState[FILE_STATUSES.COMPLETE].array.length))}`
    report += `\nNumber of Files Requested: ${Nums.withCommas(totalNumberOfFiles)}`
    report += "\n---------"
    report += `\nPercentage of Bytes Successfully Downloaded: ${Nums.percentage(totalBytesDownloaded, totalPossibleBytesToDownload, 2)}%`
    report += `\nTotal Bytes Downloaded: ${Nums.withCommas(totalBytesDownloaded)}`
    report += `\nTotal Bytes in Files Requested: ${Nums.withCommas(totalPossibleBytesToDownload)}` 
    report += "\n---------"
    //report += `\nFile Integrity Check Passed: ${fileIntegrityCheck}`
   // report += "\n---------"
    report += `\nTime Elapsed: ${DateUtils.msToTime(timeElapsed)}`
    report += `\nRaw Speed (Mbps): ${Nums.round(rawSpeedMbps, 1)}`

    if(filesPerState[FILE_STATUSES.ERROR].array.length > 0) {
      report += "\nFILES WITH ERRORS:"

      let lastJobIndex = -1

      for (let currentErroredOutFileIndex = 0; currentErroredOutFileIndex < filesPerState[FILE_STATUSES.ERROR].array.length; currentErroredOutFileIndex++) {
        const currentJobIndex = filesPerState[FILE_STATUSES.ERROR].array[currentErroredOutFileIndex].jobIndex;
        const currentFileIndex = filesPerState[FILE_STATUSES.ERROR].array[currentErroredOutFileIndex].fileIndex;
        const currentFile = filesForEachJob[currentJobIndex][currentFileIndex]

        if(currentJobIndex !== lastJobIndex) {
          report += `${indent(1)}Job # ${jobNumbers[currentJobIndex]}`
        }

        report += `${indent(2)}File: ${currentFile.Key}`
        report += `${indent(3)}State: ${currentFile.fileState}`
        report += `${indent(3)}Error(s):`
        report += `\n${addIndent(this.stringifyFileErrors(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex), 4)}`

        lastJobIndex = currentJobIndex
      }
    }

    report += `\n\n`

    Logging.log("filesForEachJob:", filesForEachJob, `Summary Status Report:\n${report}`, "filesPerState:", filesPerState, "chunksPerState:", chunksPerState)

    alert(`Local Download complete.\n\nFinal Report${report}`) 
  }
}

export default LocalDownloader