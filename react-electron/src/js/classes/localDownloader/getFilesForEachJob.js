import LOCAL_DOWNLOADING_CONSTANTS from './../../constants/local-downloading'
import getS3FileList from './getS3FileList'

const {VERISUITE_JOB_STATUSES, VERITEXT_JOB_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS

async function getFilesForEachJob(jobNumbers, env) {
  let filesForEachJob = [] 
  filesForEachJob.veriSuiteJobStatus = VERISUITE_JOB_STATUSES.DOWNLOADING
  
  for (let i = 0; i < jobNumbers.length; i++) {
    let filesForCurrentJob = await getS3FileList(LOCAL_DOWNLOADING_CONSTANTS[env].SOURCE_BUCKET, jobNumbers[i])

    filesForCurrentJob.veritextJobStatus = VERITEXT_JOB_STATUSES.DOWNLOADING

    filesForEachJob[i] = filesForCurrentJob
  }

  return filesForEachJob
}

export default getFilesForEachJob