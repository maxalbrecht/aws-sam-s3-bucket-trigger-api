import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
import File from './../../utils/file'
import Time from './../../utils/time'
import Logging from './../../utils/logging'
import NotDef from './../../utils/not-def'
import defined from './../../utils/defined'
import getNumberOfFilePointsForFile from './getNumberOfFilePointsForFile'
import downloadFileForJob from './downloadFileForJob'

const { sleep } = Time
const { defaultTo } = NotDef

function getConfig() {
  let config
  try {
    config = JSON.parse(File.getContent(LOCAL_DOWNLOADING_CONSTANTS.CONFIG_FILE))

    return config
  }
  catch(error) {
    Logging.logError("Error trying to initialize localDownloader's config", error)
  }
}

async function downloadFilesForJob(
  jobNumbers,
  filesForEachJob,
  currentJobIndex,
  targetParentFileDirectory,
  bucket,
  chunkSemaphore,
  fileSemaphore,
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

  for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
    let calledDownloadFileFunction = false
    let filePointsForCurrentFile = getNumberOfFilePointsForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex)

    while(!calledDownloadFileFunction) {
      if(chunkSemaphore.available(LOCAL_DOWNLOADING_CONSTANTS.MIN_NUMBER_OF_FREE_CHUNK_TICKETS_TO_START_FILE_DOWNLOAD)) {
        await fileSemaphore.take(filePointsForCurrentFile,
          async () => {
            await chunkSemaphore.take(() => {
              downloadFileForJob(
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

export default downloadFilesForJob