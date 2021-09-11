import LOCAL_DOWNLOADING_CONSTANTS from './../../constants/local-downloading'
import File from './../../utils/file'
import Time from './../../utils/time'
import printSemaphoreStatusUpdate from './printSemaphoreStatusUpdate'
import downloadFilesForJob from './downloadFilesForJob'

const { sleep } = Time

function deleteExistingJobFolders(jobNumbers, targetParentFileDirectory) {
  for (let jobNumberIndex = 0; jobNumberIndex < jobNumbers.length; jobNumberIndex++) {
    File.deleteDirIfItExists(`${targetParentFileDirectory}${jobNumbers[jobNumberIndex]}\\`)
  }
}

async function downloadFilesForEachJob(jobNumbers, filesForEachJob, env, targetParentFileDirectory) {
  let chunkSemaphore = require('semaphore')(LOCAL_DOWNLOADING_CONSTANTS.MAX_NUMBER_OF_ACTIVE_CHUNKS)
  let fileSemaphore = require('semaphore')(LOCAL_DOWNLOADING_CONSTANTS.MAX_NUMBER_OF_FILE_POINTS)
  printSemaphoreStatusUpdate(chunkSemaphore, fileSemaphore)

  deleteExistingJobFolders(jobNumbers, targetParentFileDirectory)

  for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
    let calledDownloadFilesFunction = false

    while(!calledDownloadFilesFunction) {
      if(
        chunkSemaphore.available(LOCAL_DOWNLOADING_CONSTANTS.MIN_NUMBER_OF_FREE_CHUNK_TICKETS_TO_START_FILE_DOWNLOAD)
        && fileSemaphore.available(LOCAL_DOWNLOADING_CONSTANTS.MIN_NUMBER_OF_FREE_FILE_POINTS_TO_START_FILE_DOWNLOAD)
      ) {
        downloadFilesForJob(
          jobNumbers, filesForEachJob, currentJobIndex, targetParentFileDirectory,
          LOCAL_DOWNLOADING_CONSTANTS[env].SOURCE_BUCKET, chunkSemaphore, fileSemaphore)

        calledDownloadFilesFunction = true
      }

      if(!calledDownloadFilesFunction) { await sleep( LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_IF_UNABLE_TO_START_FILE_DOWNLOAD_MILLISECONDS) }
    }
  }
}

export default downloadFilesForEachJob