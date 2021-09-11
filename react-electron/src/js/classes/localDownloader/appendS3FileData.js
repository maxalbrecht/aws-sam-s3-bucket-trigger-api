import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
import NotDef from './../../utils/not-def'
import Time from './../../utils/time'
import Logging from './../../utils/logging'
import releaseResourcesAfterChunkError from './releaseResourcesAfterChunkError'
import getNumberOfFilePointsForFile from './getNumberOfFilePointsForFile'

const uuidv4 = window.require('uuid/v4')
const fs = window.require('fs')
const { webFrame } = window.require('electron')
const { defined, defaultToNotDefined } = NotDef
const { sleep } = Time
const { FILE_STATUSES, CHUNK_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS

async function appendS3FileData(
  jobNumbers,
  filesForEachJob,
  currentJobIndex,
  currentFileIndex,
  targetParentDirectory,
  necessaryNumberOfChunks,
  chunkSemaphore,
  fileSemaphore,
  stream = null,
  currentChunkIndex = 0,
  parentFunctionId = 0
) {
  let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
  let currentChunk = currentFile.chunks[currentChunkIndex]
  let currentFunctionId = uuidv4()

  //Logging.log(`start of function appendS3FileData with currentChunkIndex = ${currentChunkIndex}; currentFunctionId: ${currentFunctionId}; parentFunctionId: ${parentFunctionId}`)

  currentChunk.editChunkLock.acquire()

  if(!defined(currentChunk.appendedData) || !currentChunk.appendedData) {
    currentChunk.appendedData = true
    currentChunk.editChunkLock.release()

    //Logging.log(`starting to append S3 File Data, with currentChunkIndex = ${currentChunkIndex}; currentFunctionId: ${currentFunctionId}; parentFunctionId: ${parentFunctionId}`)
    let filePath = `${targetParentDirectory}${currentFile.Key.replace(/\//g, '\\')}`
    let calledThroughCallback = false
    if(defined(stream)) { 
      calledThroughCallback = true
      stream.on('drain', () => {} )
    }
    else { stream = await fs.createWriteStream(filePath, { flags: 'a' }) }
    let appendedFinalChunk = false
    let experiencedAppendingError = false
    currentChunk.calledThroughCallback = calledThroughCallback
    let appendChunkDataResult = true

    while(appendChunkDataResult && !appendedFinalChunk && !experiencedAppendingError && currentChunkIndex < currentFile.chunks.length) {
      let appendedCurrentChunk = false

      try {
        if(defined(currentChunk.s3Response) && defaultToNotDefined(currentChunk.ChunkStatus) !== CHUNK_STATUSES.CANCELLED_BY_ERROR_IN_OTHER_CHUNK) {
          //Logging.log(`about to add callback function. currentChunkIndex = ${currentChunkIndex}; currentFunctionId: ${currentFunctionId}; parentFunctionId: ${parentFunctionId}`)
          let chunkIndexForCallback = currentChunkIndex + 1
          stream.on('drain', () => { appendS3FileData(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex, targetParentDirectory, necessaryNumberOfChunks, chunkSemaphore, fileSemaphore, stream, chunkIndexForCallback, currentFunctionId) })
          appendChunkDataResult = await stream.write(currentChunk.s3Response.Body)

          currentChunk.appendChunkDataResult = appendChunkDataResult
          delete currentChunk.s3Response.Body
          delete currentChunk.s3Response.$response.data
          //delete currentChunk.s3Response.$response
          delete currentChunk.s3Response
          currentChunk.s3Response = null
          appendedCurrentChunk = true

          //Logging.log(`appendS3FileData(): currentJobIndex: ${currentJobIndex}; currentFileIndex: ${currentFileIndex}; currentChunkIndex: ${currentChunkIndex}; about to ACQUIRE lock. currentFile: `, currentFile, "currentChunk:", currentChunk)
          await currentFile.lockToReleaseFileResources.acquire()
          //Logging.log(`appendS3FileData(): currentJobIndex: ${currentJobIndex}; currentFileIndex: ${currentFileIndex}; currentChunkIndex: ${currentChunkIndex}; just ACQUIRED lock. currentFile: `, currentFile, "currentChunk:", currentChunk)

          try {
            let chunkHadAlreadyBeenCancelled = (defaultToNotDefined(currentChunk.ChunkStatus) === CHUNK_STATUSES.CANCELLED_BY_ERROR_IN_OTHER_CHUNK ? true : false)
            currentChunk.chunkStatus = CHUNK_STATUSES.COMPLETE

            if(currentChunkIndex === necessaryNumberOfChunks - 1) {
              //currentFile.fileStatus = FILE_STATUSES.CHECKING_DATA_INTEGRITY
              currentFile.fileStatus = FILE_STATUSES.COMPLETE
              currentFile.chunks = null
              appendedFinalChunk = true
              //Logging.LogSectionStart("CLEARING CACHE")
              Logging.log(`Completed download of following file:\n\tcurrentJobIndex: ${currentJobIndex}\n\tVeritext job number:${jobNumbers[currentJobIndex]}\n\tcurrentFileIndex: ${currentFileIndex}\n\tfile path:${currentFile.Key}`)
              //getMemory()
              webFrame.clearCache()
              //Logging.LogSectionEnd()

              stream.end()
            }

            if(!chunkHadAlreadyBeenCancelled) {
              chunkSemaphore.leave()

              if(currentChunkIndex === necessaryNumberOfChunks - 1) {
                fileSemaphore.leave(getNumberOfFilePointsForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex))
              }
            }
          }
          finally { 
            //Logging.log(`appendS3FileData(): currentJobIndex: ${currentJobIndex}; currentFileIndex: ${currentFileIndex}; currentChunkIndex: ${currentChunkIndex}; about to RELEASE lock. currentFile: `, currentFile, "currentChunk:", currentChunk)
            currentFile.lockToReleaseFileResources.release() }
            //Logging.log(`appendS3FileData(): currentJobIndex: ${currentJobIndex}; currentFileIndex: ${currentFileIndex}; currentChunkIndex: ${currentChunkIndex}; just RELEASED lock. currentFile: `, currentFile, "currentChunk:", currentChunk)

          if(appendedCurrentChunk) { currentChunkIndex++ }

          if(!appendChunkDataResult && !appendedFinalChunk) { appendedFinalChunk = true } // to break out of the while loop that is iterating through each chunk
        }
        else if (defaultToNotDefined(currentChunk.ChunkStatus) === CHUNK_STATUSES.CANCELLED_BY_ERROR_IN_OTHER_CHUNK) {
          if(defined(stream)) { stream.end() }
          throw `chunk with index ${currentChunkIndex} had status of ${CHUNK_STATUSES.CANCELLED_BY_ERROR_IN_OTHER_CHUNK}`
        }
      }
      catch(error) {
          experiencedAppendingError = true
          currentChunk.s3Response = null
          currentFile.appendFileDataError = { chunkIndex: currentChunkIndex, error: error }
          currentChunk.appendFileDataError = error

          await releaseResourcesAfterChunkError(
            jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex,
            currentChunkIndex, chunkSemaphore, fileSemaphore
          )

          stream.end()

          Logging.logError(`ERROR WHILE APPENDING FOR CHUNK WITH INDEX ${currentChunkIndex} FROM A TOTAL OF ${necessaryNumberOfChunks} NECESSARY CHUNKS`, error)
      }

      if(!appendedCurrentChunk && !experiencedAppendingError) { await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_IF_UNABLE_TO_START_APPENDING_CHUNK_DATA_MILLISECONDS) }
    }
  }
  else {
    currentChunk.editChunkLock.release()
  }
}

export default appendS3FileData