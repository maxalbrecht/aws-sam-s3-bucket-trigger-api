import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
import Logging from './../../utils/logging'
import NotDef from './../../utils/not-def'
import Text from './../../utils/text'
import Time from '../../utils/time'
import File from './../../utils/file'
import firstEqualsOneOfTheOthers from '../../utils/first-equals-one-of-the-others'
import stringifyFileErrors from './stringifyFileErrors' 
import releaseResourcesAfterChunkError from './releaseResourcesAfterChunkError'
import appendS3FileData from './appendS3FileData'

const aws = require('aws-sdk')
const { CHUNK_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS
const { defined, defaultTo } = NotDef
const { addIndent } = Text
const { sleep } = Time

function getConfig() {
  let config
  try {
    config = JSON.parse(File.getContent(LOCAL_DOWNLOADING_CONSTANTS.CONFIG_FILE))
    //Logging.log("config:", config)

    return config
  }
  catch(error) {
    Logging.logError("Error trying to initialize localDownloader's config", error)
  }
}


async function downloadChunkForFile(
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
    region = null,
    accessKeyId = null,
    secretAccessKey = null,
    signatureVersion = 'v4'
  ) {
    let config = getConfig()

    if(!defined(region) || !defined(accessKeyId) || !defined(secretAccessKey)) {
      region = defaultTo(region, config.region)
      accessKeyId = defaultTo(accessKeyId, config.accessKeyId)
      secretAccessKey = defaultTo(secretAccessKey, config.secretAccessKey)
    }

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
          Logging.logError(`ERROR in localDownloader.downloadChunkForFile() at s3.getObject (currentTryIndex === maxTries; currentTryIndex: ${currentTryIndex}; maxTries: ${maxTries})`, error)
          Logging.log("params used for s3.getObject call:", params, "data from s3.getObject call that threw error:", data)
          //#alert(`s3 returned an error for the following file chunk:\n\tBucket: ${params.Bucket}\n\tKey: ${params.Key}\n\tCurrent Chunk Index: ${currentChunkIndex}`)

          currentFile.downloadError = {chunkIndex: currentChunkIndex, error: error }
          currentChunk.downloadError = error

          releaseResourcesAfterChunkError(
            jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex,
            currentChunkIndex, chunkSemaphore, fileSemaphore
          )

          Logging.log("file that just threw error:", currentFile)
          Logging.log(`errors for current file (job index: ${currentJobIndex}; file index: ${currentFileIndex}):`)
          Logging.log(`\n${addIndent(stringifyFileErrors(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex), 1)}`)

          throw error 
        } 
        else {
          Logging.log(`ERROR in localDownloader.downloadChunkForFile() at s3.getObject (currentTryIndex: ${currentTryIndex}; maxTries: ${maxTries})`, error)
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
      data = null

      if(currentChunkIndex === 0) {
        await appendS3FileData(
          jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex, targetParentFileDirectory,
          necessaryNumberOfChunks, chunkSemaphore, fileSemaphore
        )
      }
    }
  }

  export default downloadChunkForFile