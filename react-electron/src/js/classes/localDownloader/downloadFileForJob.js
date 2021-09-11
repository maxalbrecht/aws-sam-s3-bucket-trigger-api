import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
import File from '../../utils/file'
import Lock from './../../classes/lock/lock'
import Logging from './../../utils/logging'
import NotDef from '../../utils/not-def'
import Time from '../../utils/time'
import getNecessaryNumberOfChunksForFile from './getNecessaryNumberOfChunksForFile'
import downloadChunkForFile from './downloadChunkForFile'

const { FILE_STATUSES, CHUNK_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS
const { defined, defaultTo } = NotDef
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

async function downloadFileForJob(
    jobNumbers,
    filesForEachJob,
    currentJobIndex,
    currentFileIndex, 
    targetParentFileDirectory,
    bucket,
    chunkSemaphore,
    fileSemaphore,
    region = null,
    accessKeyId = null,
    secretAccessKey = null,
    signatureVersion = 'v4'
  ) {
    try {
      let config = getConfig()

      if(!defined(region) || !defined(accessKeyId) || !defined(secretAccessKey)) {
        region = defaultTo(region, config.region)
        accessKeyId = defaultTo(accessKeyId, config.accessKeyId)
        secretAccessKey = defaultTo(secretAccessKey, config.secretAccessKey)
      }

      // INITIALIZE VARIABLES
      let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
      currentFile.fileStatus = FILE_STATUSES.DOWNLOADING_AND_SAVING_TO_DISK
      currentFile.lockToReleaseFileResources = new Lock()
      currentFile.chunks = [] //new Array(necessaryNumberOfChunks)
      let chunkSizeInBytes = LOCAL_DOWNLOADING_CONSTANTS.CHUNK_SIZE_IN_BYTES
      let necessaryNumberOfChunks = getNecessaryNumberOfChunksForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex)
      
      for (let currentChunkIndex = 0; currentChunkIndex < necessaryNumberOfChunks; currentChunkIndex++) {
        let newChunk = { chunkStatus: CHUNK_STATUSES.DOWNLOAD_CHUNK_FUNCTION_NOT_YET_CALLED, editChunkLock: new Lock() }

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
                downloadChunkForFile(
                  jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex, targetParentFileDirectory,
                  bucket, chunkSemaphore, fileSemaphore, currentChunkIndex, byteRangeStart, byteRangeEnd,
                  necessaryNumberOfChunks, contentType, region, accessKeyId, secretAccessKey, signatureVersion
                )
              })
            }
            else {
              downloadChunkForFile(
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

  export default downloadFileForJob