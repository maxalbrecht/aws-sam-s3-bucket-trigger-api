import Logging from '../../utils/logging'
import DateUtils from './../../utils/date-utils'
import File from '../../utils/file'
import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
import { Config } from 'aws-sdk'
import defined from '../../utils/defined'

const { 
  tinctured: tint, 
  options: {
    red, white, blue, green, yellow,
    black, bgGreen, bgRed, bgCyan,
    underscore, bgMagenta, bright,
    cyan, reset, reverse, magenta 
  } 
} = require('tinctured')
const aws = require('aws-sdk')
//const ASYNC = require('async')
//var store = window.store
const fs = window.require('fs')

var config
try {
  config = JSON.parse(File.getContent(LOCAL_DOWNLOADING_CONSTANTS.CONFIG_FILE))
}
catch(error) {
  Logging.logError("Error trying to initialize localDownloader's config", error)
}

const VERITEXT_JOB_STATUSES = {
  DOWNLOAD_JOB_FILES_FUNCTION_NOT_YET_CALLED: "DOWNLOAD_JOB_FILES_FUNCTION_NOT_YET_CALLED",
  DOWNLOADING_AND_SAVING_TO_DISK: "DOWNLOADING_AND_SAVING_TO_DISK",
  COMPLETE: "COMPLETE",
  ERROR: "ERROR"
}
const FILE_STATUSES = {
  DOWNLOAD_FILE_FUNCTION_NOT_YET_CALLED: "DOWNLOAD_FILE_FUNCTION_NOT_YET_CALLED",
  DOWNLOADING_AND_SAVING_TO_DISK: "DOWNLOADING_AND_SAVING_TO_DISK",
  COMPLETE: "COMPLETE",
  ERROR: "ERROR"
}

const CHUNK_STATUSES = {
  DOWNLOAD_CHUNK_FUNCTION_NOT_YET_CALLED: "DOWNLOAD_CHUNK_FUNCTION_NOT_YET_CALLED",
  SENDING_REQUEST: "SENDING_REQUEST",
  SAVING_TO_DISK: "SAVING_TO_DISK",
  COMPLETE: "COMPLETE",
  ERROR: "ERROR"
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

    //Logging.log("localDownloader.removeNonFiles()...", "originalFiles", originalFiles, "files:", files)

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
      //Logging.log("localDownloader.getS3FileList() config:", config)
      const s3 = new aws.S3({
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
      const response = await s3.listObjectsV2(params).promise()
      let files = this.removeNonFiles(response.Contents)

      //Logging.log("localDownloader.getS3FileList() response:", response)

      // GET FILE TYPE FOR EACH FILE
      let headObjectParams = { Bucket: bucket }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        headObjectParams["Key"] = file.Key

        let headObjectResponse = await s3.headObject(headObjectParams).promise()

        //Logging.log("headObjectResponse:", headObjectResponse)

        if(defined(headObjectResponse, "ContentType")) { file.ContentType = headObjectResponse.ContentType }
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

      //Logging.log("localDownloader.getFilesForEachJob()", "filesForCurrentJob", filesForCurrentJob)

      filesForEachJob[i] = filesForCurrentJob

      //Logging.log("localDownloader.getFilesForEachJob()","i:", i, "filesForEachJob[i]", filesForCurrentJob[i])
    }

    Logging.log("localDownloader.getFilesForEachJob.filesForEachJob:", filesForEachJob)

    return filesForEachJob
  }

  async appendS3FileData(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex,
    targetParentDirectory,
    //fileData,
    //chunkIndex,
    necessaryNumberOfChunks,
    fileAppendStream,
    verisuiteJobLevelSemaphoreForChunks
  ) {
    let filePath = `${targetParentDirectory}${filesForEachJob[currentJobIndex][currentFileIndex].Key.replace(/\//g, '\\')}`
    let stream = await fs.createWriteStream(filePath, { flags: 'a' })
    //let done = false
    let appendedFinalChunk = false
    let experiencedAppendingError = false
    let currentChunkIndex = 0

    while(!appendedFinalChunk && !experiencedAppendingError) {
      let appendedCurrentChunk = false

      //Logging.log(`ABOUT TO (RE)START WHILE LOOP in appendS3FileData. currentChunkIndex: ${currentChunkIndex}`)      
      //this.printFileAndChunkStatuses(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex)

      try {
        if(defined(filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].s3Response)) {
          //Logging.log(`ABOUT TO APPEND CHUNK WITH INDEX ${currentChunkIndex} FROM A TOTAL OF ${necessaryNumberOfChunks} NECESSARY CHUNKS`)
          //this.printFileAndChunkStatuses(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex)

          let currentChunkData = filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].s3Response.Body

          let appendChunkDataResult = await stream.write(currentChunkData)

          filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].appendChunkDataResult = appendChunkDataResult  
          filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].chunkStatus = CHUNK_STATUSES.COMPLETE
          filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].s3Response = null
          appendedCurrentChunk = true
          verisuiteJobLevelSemaphoreForChunks.leave()

          if(currentChunkIndex === necessaryNumberOfChunks - 1) {
            filesForEachJob[currentJobIndex][currentFileIndex].fileStatus = FILE_STATUSES.COMPLETE
            appendedFinalChunk = true
          }

          //Logging.log(`DONE APPENDING FOR CHUNK WITH INDEX ${currentChunkIndex} FROM A TOTAL OF ${necessaryNumberOfChunks} NECESSARY CHUNKS`)
          //this.printFileAndChunkStatuses(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex)
          currentChunkIndex++
        }
      }
      catch(error) {
          filesForEachJob[currentJobIndex][currentFileIndex].appendFileDataError = { chunkIndex: currentChunkIndex, error: error }
          filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].appendFileDataError = error
          filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].chunkStatus = CHUNK_STATUSES.ERROR
          filesForEachJob[currentJobIndex][currentFileIndex].fileStatus = FILE_STATUSES.ERROR

          experiencedAppendingError = true

          Logging.log(`ERROR WHILE APPENDING FOR CHUNK WITH INDEX ${currentChunkIndex} FROM A TOTAL OF ${necessaryNumberOfChunks} NECESSARY CHUNKS`)
          alert(`ERROR WHILE APPENDING FOR CHUNK WITH INDEX ${currentChunkIndex} FROM A TOTAL OF ${necessaryNumberOfChunks} NECESSARY CHUNKS`)
      }

      if(!appendedCurrentChunk && !experiencedAppendingError) { await this.sleep(100) }
    }

    stream.end()

    //Logging.log(`FINISHED APPENDING FOR FILE WITH INDEX ${currentFileIndex}`, "filesForEachJob:", filesForEachJob)
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

  async downloadChunkForFile(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex, 
    targetParentFileDirectory,
    bucket,
    verisuiteJobLevelSemaphoreForChunks,
    currentChunkIndex,
    byteRangeStart,
    byteRangeEnd,
    necessaryNumberOfChunks,
    fileContentType,
    fileAppendStream,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].chunkStatus = CHUNK_STATUSES.SENDING_REQUEST
    let s3 = new aws.S3({
      endpoint: new aws.Endpoint(`${bucket}.s3-accelerate.amazonaws.com`),
      useAccelerateEndpoint: true,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      Bucket: bucket,
      signatureVersion: signatureVersion,
      region: region
    })
    let params = {
      Bucket: bucket,
      Key: filesForEachJob[currentJobIndex][currentFileIndex].Key,
      Range: `bytes=${byteRangeStart}-${byteRangeEnd}`,
      ResponseCacheControl: 'STRING_VALUE',
      ResponseContentDisposition: 'STRING_VALUE',
      ResponseContentEncoding: 'STRING_VALUE',
      ResponseContentLanguage: 'en-US',
      ResponseContentType: fileContentType,
    }
    let data
    let currentTryIndex = 0
    let maxTries = LOCAL_DOWNLOADING_CONSTANTS.DOWNLOAD_MAX_TRIES
    let success = false
  
    filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].s3GetObjectParams = params
    //if(currentChunkIndex === 0) { Logging.log(" first chunk params:", params) }
    //if(currentChunkIndex === necessaryNumberOfChunks - 1) { Logging.log("last chunk params:", params, "byteRangeStart:", byteRangeStart, "byteRangeEnd", byteRangeEnd) }

    while(currentTryIndex < maxTries && !success) {
      try {
        //Logging.log("about to make call to s3")
        data = await s3.getObject(params).promise()
        //Logging.log("Response received")
        if(defined(data.$response.error)) {throw data.$response.error }
        filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].chunkStatus = CHUNK_STATUSES.SAVING_TO_DISK
        success = true
      }
      catch(error) {
        currentTryIndex++

        if(currentTryIndex === maxTries) { 
          Logging.logError("ERROR in localDownloader.downloadFileForJob() at s3.getObject", error)
          Logging.log("params used for s3.getObject call:", params, "data from s3.getObject call that threw error:", data)

          alert(`s3 returned an error for the following file chunk:\n\tBucket: ${params.Bucket}\n\tKey: ${params.Key}\n\tCurrent Chunk Index: ${currentChunkIndex}`)

          filesForEachJob[currentJobIndex][currentFileIndex].downloadError = {chunkIndex: currentChunkIndex, error: error }
          filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].downloadError = error
          filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].chunkStatus = CHUNK_STATUSES.ERROR
          filesForEachJob[currentJobIndex][currentFileIndex].fileStatus = FILE_STATUSES.ERROR

          throw error 
        } 
        else {
          Logging.log("ERROR in localDownloader.downloadFileForJob() at s3.getObject", error)
          Logging.log("params used for s3.getObject call:", params, "data from s3.getObject call that threw error:", data)

          //await new Promise(resolve => setTimeout(resolve, LOCAL_DOWNLOADING_CONSTANTS.DOWNLOAD_RETRY_TIMEOUT))
          await this.sleep(LOCAL_DOWNLOADING_CONSTANTS.DOWNLOAD_RETRY_TIMEOUT)
        }
      }
    }

    // SAVE CHUNK'S DOWNLOAD RESPONSE
    //Logging.log("about to save chunk-download response")
    filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].downloadResponse = {
      error: data.$response.error,
      statusCode: data.$response.statusCode,
      statusMessage: data.$response.statusMessage
    }

    // APPEND CHUNK DATA TO FILE

    if(
      !defined(filesForEachJob[currentJobIndex][currentFileIndex].downloadError) 
      && !defined(data.$response.error)
      && defined(filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].chunkStatus)
      && filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].chunkStatus !== CHUNK_STATUSES.ERROR
      //&& (currentChunkIndex === 0 || filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex - 1].chunkStatus === CHUNK_STATUSES.COMPLETE)
    ) {
      //if(currentChunkIndex ===1) { Logging.log("about to save SECOND chunk data to disk") }

      filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex].s3Response = data // data.Body

      //Logging.log(`JUST SAVED S3 RESPONSE FOR CHUNK WITH INDEX ${currentChunkIndex}`)
      //this.printFileAndChunkStatuses(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex)

      if(currentChunkIndex === 0) {
        await this.appendS3FileData(
          jobNumbers,
          filesForEachJob,
          currentJobIndex,
          currentFileIndex, 
          targetParentFileDirectory,
          //data.Body,
          //currentChunkIndex,
          necessaryNumberOfChunks,
          fileAppendStream,
          verisuiteJobLevelSemaphoreForChunks
        )
      }
    }

    //verisuiteJobLevelSemaphoreForChunks.leave()
  }

  async downloadFileForJob(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex, 
    targetParentFileDirectory,
    bucket,
    verisuiteJobLevelSemaphoreForChunks,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
  ) {
    try {
      // INITIALIZE VARIABLES
      filesForEachJob[currentJobIndex][currentFileIndex].fileStatus = FILE_STATUSES.DOWNLOADING_AND_SAVING_TO_DISK
      let chunkSizeInBytes = LOCAL_DOWNLOADING_CONSTANTS.CHUNK_SIZE_IN_BYTES
      
      let necessaryNumberOfChunks = Math.ceil(filesForEachJob[currentJobIndex][currentFileIndex].Size / LOCAL_DOWNLOADING_CONSTANTS.CHUNK_SIZE_IN_BYTES)
      filesForEachJob[currentJobIndex][currentFileIndex].chunks = [] //new Array(necessaryNumberOfChunks)
      
      for (let currentChunkIndex = 0; currentChunkIndex < necessaryNumberOfChunks; currentChunkIndex++) {
        let newChunk = { chunkStatus: CHUNK_STATUSES.DOWNLOAD_CHUNK_FUNCTION_NOT_YET_CALLED }

        filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex] = newChunk 
      }

      let contentType = (
        defined(filesForEachJob[currentJobIndex][currentFileIndex].ContentType) ?
          filesForEachJob[currentJobIndex][currentFileIndex].ContentType
          : LOCAL_DOWNLOADING_CONSTANTS.CONTENT_TYPE_DEFAULT
      )
      let byteRangeStart, byteRangeEnd = 0

      //Logging.log("currentFile:", filesForEachJob[currentJobIndex][currentFileIndex], "necessaryNumberOfChunks", necessaryNumberOfChunks, "contentType", contentType)

      let filePath = `${targetParentFileDirectory}${filesForEachJob[currentJobIndex][currentFileIndex].Key.replace(/\//g, '\\')}`
      File.makeDirIfItDoesNotExist(File.removeNameFromPath(filePath))
      //let fileAppendStream = File.createAppendStream(filePath)
      let fileAppendStream = "" //File.createAppendStream(filePath)

      // DOWNLOAD THE FILE'S DATA IN CHUNKS
      for (let currentChunkIndex = 0;
        currentChunkIndex < necessaryNumberOfChunks
          && filesForEachJob[currentJobIndex][currentFileIndex].fileStatus !== FILE_STATUSES.ERROR;
        currentChunkIndex++
      ) {
        let calledDownloadChunkFunction = false
        byteRangeStart = chunkSizeInBytes * currentChunkIndex
        if(currentChunkIndex === necessaryNumberOfChunks - 1) {
          byteRangeEnd = filesForEachJob[currentJobIndex][currentFileIndex].Size - 1
        } else {
          byteRangeEnd = ( chunkSizeInBytes * (currentChunkIndex + 1) ) - 1
        }

        //console.log("SEMAPHORE:")
        //console.log(verisuiteJobLevelSemaphoreForChunks)

        while(!calledDownloadChunkFunction) {
          if(verisuiteJobLevelSemaphoreForChunks.available()) {
            //console.log("DEBUG 0")
            await verisuiteJobLevelSemaphoreForChunks.take(() => {})
            //console.log("DEBUG 1")

            //Logging.log(`about to call download-chunk function for chunk with index ${currentChunkIndex}`)

            this.downloadChunkForFile(
              jobNumbers,
              filesForEachJob,
              currentJobIndex,
              currentFileIndex, 
              targetParentFileDirectory,
              bucket,
              verisuiteJobLevelSemaphoreForChunks,
              currentChunkIndex,
              byteRangeStart,
              byteRangeEnd,
              necessaryNumberOfChunks,
              contentType,
              fileAppendStream,
              region,
              accessKeyId,
              secretAccessKey,
              signatureVersion
            )

            calledDownloadChunkFunction = true
          }
          if(!calledDownloadChunkFunction) { await this.sleep(100) }
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
    verisuiteJobLevelSemaphoreForChunks,
    region = config.region,
    accessKeyId = config.accessKeyId,
    secretAccessKey = config.secretAccessKey,
    signatureVersion = 'v4'
    ) {
    Logging.log("localDownloader.downloadFilesForJob", "currentJobIndex:", currentJobIndex, "jobNumbers[currentJobIndex]", jobNumbers[currentJobIndex], "filesForEachJob[currentJobIndex]", filesForEachJob[currentJobIndex])

    for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
      let calledDownloadFileFunction = false

      while(!calledDownloadFileFunction) {
        if(verisuiteJobLevelSemaphoreForChunks.available(10)) {
          //await this.downloadFileForJob(
          this.downloadFileForJob(
            jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex, targetParentFileDirectory,
            bucket, verisuiteJobLevelSemaphoreForChunks, region, accessKeyId, secretAccessKey, signatureVersion
          )

          calledDownloadFileFunction = true
        }
        //else { this.sleep(100) }

        if(!calledDownloadFileFunction) { await this.sleep(100) }
      }
   }
  }

  deleteExistingJobFolders(jobNumbers, targetParentFileDirectory) {
    for (let jobNumberIndex = 0; jobNumberIndex < jobNumbers.length; jobNumberIndex++) {
      File.deleteDirIfItExists(`${targetParentFileDirectory}${jobNumbers[jobNumberIndex]}\\`)
    }
  }

  async downloadFilesForEachJob(jobNumbers, filesForEachJob, env, targetParentFileDirectory) {
    let maxNumberOfChunksCurrentlyBeingDownloadedPerVerisuiteJob = 100
    let verisuiteJobLevelSemaphoreForChunks = require('semaphore')(maxNumberOfChunksCurrentlyBeingDownloadedPerVerisuiteJob)

    this.deleteExistingJobFolders(jobNumbers, targetParentFileDirectory)

    for (let i = 0; i < filesForEachJob.length; i++) {
      let calledDownloadFilesFunction = false

      while(!calledDownloadFilesFunction) {
        if(verisuiteJobLevelSemaphoreForChunks.available(10)) {
          //await this.downloadFilesForJob(
          this.downloadFilesForJob(
            jobNumbers, filesForEachJob, i, targetParentFileDirectory,
            LOCAL_DOWNLOADING_CONSTANTS[env].SOURCE_BUCKET, verisuiteJobLevelSemaphoreForChunks)

          calledDownloadFilesFunction = true
        }

        //else { this.sleep(1000) }
        if(!calledDownloadFilesFunction) { await this.sleep(1000) }
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

    this.pollToSeeIfDownloadsAreComplete(filesForEachJob, startTimeOfOverallDownload)
  }

  spacer(indentLvl) {
    let spacer = "\n"

    for (let i = 1; i <= indentLvl; i++) {
      spacer += "  "
    }

    return spacer
  }

  async printStatusUpdate(filesForEachJob, jobNumbers, includeChunks = true) {
    while(true) {

      let report = `${tint("CURRENT STATUS", { cyan, bright })}${tint("", { white })}`
      report += `${this.spacer(1)}${tint("Current Time: ", { reset })}${DateUtils.GetDateDisplay()}`
      report += `${this.spacer(1)}Veritext Jobs (by index):`

      for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
        const currentJob = filesForEachJob[currentJobIndex];
        report += `${this.spacer(2)}${tint(`job ${currentJobIndex}:`, { magenta })}${tint("", { white })}`
        report += `${this.spacer(3)}Job Number: ${jobNumbers[currentJobIndex]}`
        report += `${this.spacer(3)}Files (by index):`

        for (let currentFileIndex = 0; currentFileIndex < currentJob.length; currentFileIndex++) {
          const currentFile = currentJob[currentFileIndex];
          
          report += `${this.spacer(4)}${tint(`file ${currentFileIndex}:`, { cyan })}${tint("", { white })}`
          report += `${this.spacer(5)}Key:\t\t  ${currentFile.Key}`
          report += `${this.spacer(5)}fileStatus: ${defined(currentFile.fileStatus) ? (currentFile.fileStatus.replace(FILE_STATUSES.COMPLETE, tint(FILE_STATUSES.COMPLETE, { bgGreen })).replace(FILE_STATUSES.ERROR, tint(FILE_STATUSES.ERROR, { bgRed }))) : tint("NOT defined", { yellow })}${tint("", { white })}`
          report += `${this.spacer(5)}Size:\t\t  ${currentFile.Size}`

          if(includeChunks && defined(currentFile.chunks)) {
            report += `${this.spacer(5)}Chunks (by index):`

            for (let currentChunkIndex = 0; currentChunkIndex < currentFile.chunks.length; currentChunkIndex++) {
              const currentChunk = currentFile.chunks[currentChunkIndex];

              report += `${this.spacer(6)}chunk ${currentChunkIndex}:`
              report += `${this.spacer(7)}chunkStatus: ${defined(currentChunk.chunkStatus) ? (currentChunk.chunkStatus.replace(CHUNK_STATUSES.COMPLETE, tint(CHUNK_STATUSES.COMPLETE, { green })).replace(CHUNK_STATUSES.ERROR, tint(CHUNK_STATUSES.ERROR, { red }))) : tint("NOT defined", { yellow })}${tint("", { white })}`
            }
          }
          else {
            report += `${this.spacer(5)}Chunks defined: ${defined(currentFile.chunks) ? "defined" : tint("NOT defined", { yellow })}${tint("", { white })}`
          }
        }
      }

      report += "\n"

      Logging.log(report)

      await this.sleep(180000)
    }
  }

  async pollToSeeIfDownloadsAreComplete(filesForEachJob, startTimeOfOverallDownload) {
    let allDownloadsComplete = false 

    while(!allDownloadsComplete) {
      let breakOut = false

      for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
        for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
          if(
            !defined(filesForEachJob[currentJobIndex][currentFileIndex].fileStatus)
            || (
              defined(filesForEachJob[currentJobIndex][currentFileIndex].fileStatus)
              && filesForEachJob[currentJobIndex][currentFileIndex].fileStatus !== FILE_STATUSES.COMPLETE
              && filesForEachJob[currentJobIndex][currentFileIndex].fileStatus !== FILE_STATUSES.ERROR
            )
          ) { breakOut = true }

          if(breakOut) { break }
        }

        if(breakOut) { break }
      }

      if(!breakOut) { allDownloadsComplete = true }
      else { await this.sleep(1000) }
    }

    let endTimeOfOverallDownload = Date.now()
    this.printFinalReport(filesForEachJob, startTimeOfOverallDownload, endTimeOfOverallDownload)
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
  }

  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  printFinalReport(filesForEachJob, startTimeOfOverallDownload, endTimeOfOverallDownload) {
    let timeElapsed = endTimeOfOverallDownload - startTimeOfOverallDownload
    let totalBytesDownloaded = 0
    for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
      for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
        totalBytesDownloaded += filesForEachJob[currentJobIndex][currentFileIndex].Size
      }  
    }
    let rawSpeedMbps = ((totalBytesDownloaded*8)/1000000)/(timeElapsed/1000.0)

    let report = `Total Bytes Downloaded: ${this.numberWithCommas(totalBytesDownloaded)}\nTime Elapsed (ms): ${this.numberWithCommas(timeElapsed)}\nRaw Speed (Mbps): ${this.round(rawSpeedMbps, 1)}`

    Logging.log("Local Download complete.", "filesForEachJob:", filesForEachJob, `Final Report:\n${report}`)

    alert(`Local Download complete.\n\nFinal Report\n${report}`)
  }

  sleep(ms) {
    return new Promise((resolve) => { setTimeout(resolve, ms) })
    //Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  }   
}

export default LocalDownloader