import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
import Logging from '../../utils/logging'
import DateUtils from './../../utils/date-utils'
import File from '../../utils/file'
import getJobNumbersFromFile from './getJobNumbersFromFile'
import getFilesForEachJob from './getFilesForEachJob'
import downloadFilesForEachJob from './downloadFilesForEachJob'
import pollToSeeIfDownloadsAreComplete from './pollToSeeIfDownloadsAreComplete'
import printStatusUpdate from './printStatusUpdate'

const { VERISUITE_JOB_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS

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
    this.jobNumbers = []
    this.assignedUserEmail = assignedUserEmail
    this.contactName = contactName
    this.contactEmail = contactEmail
    this.contactPhone = contactPhone
    this.veriSuiteJobId = veriSuiteJobId
    this.env = env
    this.dateDisplay = DateUtils.GetDateDisplay()
    this.veriSuiteJobStatus = VERISUITE_JOB_STATUSES.DOWNLOADING

    try {
      this.jobNumbers = getJobNumbersFromFile(sourceFile)
      this.downloadLocally(File.removeNameFromPath(this.sourceFile), this.jobNumbers, this.env)
    } catch(error) {
      Logging.logError("ERROR in constructor method of LocalDownloader", error)
    }
  }

  async downloadLocally(targetParentFileDirectory, jobNumbers, env) {
    let startTimeOfOverallDownload = Date.now()
    let filesForEachJob = await getFilesForEachJob(jobNumbers, env)
    printStatusUpdate(filesForEachJob, jobNumbers)

    await downloadFilesForEachJob(jobNumbers, filesForEachJob, env, targetParentFileDirectory)

    pollToSeeIfDownloadsAreComplete(jobNumbers, filesForEachJob, startTimeOfOverallDownload)
  }
}

export default LocalDownloader