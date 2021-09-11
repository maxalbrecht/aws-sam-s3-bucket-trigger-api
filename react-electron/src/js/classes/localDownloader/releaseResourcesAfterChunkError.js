import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
import NotDef from './../../utils/not-def'
import firstEqualsOneOfTheOthers from '../../utils/first-equals-one-of-the-others'
import getNumberOfFilePointsForFile from './getNumberOfFilePointsForFile'

const { VERITEXT_JOB_STATUSES, FILE_STATUSES, CHUNK_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS
const { defined, defaultToNotDefined } = NotDef

async function releaseResourcesAfterChunkError (
    jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex,
    errorChunkIndex, chunkSemaphore, fileSemaphore
  ) {
    const { DOWNLOAD_CHUNK_FUNCTION_NOT_YET_CALLED, COMPLETE, ERROR, CANCELLED_BY_ERROR_IN_OTHER_CHUNK } = CHUNK_STATUSES
    let currentVeritextJob = filesForEachJob[currentJobIndex]
    let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
    let errorChunk = currentFile.chunks[errorChunkIndex]

    //Logging.log(`releaseResourcesAfterChunkError(): currentJobIndex: ${currentJobIndex}; currentFileIndex: ${currentFileIndex}; errorChunkIndex: ${errorChunkIndex}; about to ACQUIRE lock. currentFile: `, currentFile)
    await currentFile.lockToReleaseFileResources.acquire()
    //Logging.log(`releaseResourcesAfterChunkError(): currentJobIndex: ${currentJobIndex}; currentFileIndex: ${currentFileIndex}; errorChunkIndex: ${errorChunkIndex}; just ACQUIRED lock. currentFile: `, currentFile)

    try {
      let anotherChunkAlreadyHadAnError = (defaultToNotDefined(currentFile.fileStatus) === FILE_STATUSES.ERROR ? true : false)
      errorChunk.chunkStatus = CHUNK_STATUSES.ERROR
      currentFile.fileStatus = FILE_STATUSES.ERROR

      currentVeritextJob.veritextJobStatus = (
        currentVeritextJob.veritextJobStatus === VERITEXT_JOB_STATUSES.COMPLETE
        || currentVeritextJob.veritextJobStatus === VERITEXT_JOB_STATUSES.ERROR_AND_COMPLETE
        ? VERITEXT_JOB_STATUSES.ERROR_AND_COMPLETE
        : VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE
      )

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

        fileSemaphore.leave(getNumberOfFilePointsForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex))
      }
    }
    finally {
      //Logging.log(`releaseResourcesAfterChunkError(): currentJobIndex: ${currentJobIndex}; currentFileIndex: ${currentFileIndex}; errorChunkIndex: ${errorChunkIndex}; about to RELEASE lock. currentFile: `, currentFile)
      currentFile.lockToReleaseFileResources.release()
      //Logging.log(`releaseResourcesAfterChunkError(): currentJobIndex: ${currentJobIndex}; currentFileIndex: ${currentFileIndex}; errorChunkIndex: ${errorChunkIndex}; just RELEASED lock. currentFile: `, currentFile)
    }
  }

export default releaseResourcesAfterChunkError