import printFinalReport from './printFinalReport'
import Time from '../../utils/time'
import Logging from './../../utils/logging'
import NotDef from './../../utils/not-def'
import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
import firstEqualsOneOfTheOthers from '../../utils/first-equals-one-of-the-others'

const { VERISUITE_JOB_STATUSES, VERITEXT_JOB_STATUSES, FILE_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS 
const { sleep } = Time
const { defined, defaultToNotDefined } = NotDef

function updateVeritextJobStatus(filesForEachJob, currentJobIndex, currentFileIndex) {
  Logging.LogSectionStart(`ABOUT TO UPDATE VERITEXT JOB STATUS. currentJobIndex = ${currentJobIndex} and currentFileIndex = ${currentFileIndex}`)
  let currentVeritextJob = filesForEachJob[currentJobIndex]
  let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
  let allFilesForCurrentVeritextJobEqualToEitherCompleteOrError  = true

  Logging.log(
    `19: currentFile.fileStatus: ${currentFile.fileStatus}`,
    `\t!defined(currentFile.fileStatus): ${!defined(currentFile.fileStatus)}`,
    `\t!firstEqualsOneOfTheOthers(currentFile.fileStatus, FILE_STATUSES.COMPLETE, FILE_STATUSES.ERROR): ${!firstEqualsOneOfTheOthers(currentFile.fileStatus, FILE_STATUSES.COMPLETE, FILE_STATUSES.ERROR)}`
  )

  if(!defined(currentFile.fileStatus) || !firstEqualsOneOfTheOthers(currentFile.fileStatus, FILE_STATUSES.COMPLETE, FILE_STATUSES.ERROR)) {
    allFilesForCurrentVeritextJobEqualToEitherCompleteOrError = false
    Logging.log("256: just set allFilesForCurrentVeritextJobEqualToEitherCompleteOrError equal to false")

  }

  Logging.log(
    `31: defined(currentFile.fileStatus): ${defined(currentFile.fileStatus)}`,
    `\tcurrentFile.fileStatus: ${currentFile.fileStatus}`,
    `\tcurrentFile.fileStatus === FILE_STATUSES.ERROR: ${currentFile.fileStatus === FILE_STATUSES.ERROR}`
  )

  if(defined(currentFile.fileStatus) && currentFile.fileStatus === FILE_STATUSES.ERROR) {
    currentVeritextJob.veritextJobStatus = VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE
    Logging.log("38: just set currentVeritextJob.veritextJobStatus equal to VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE")
  }

  Logging.log(
    `42: currentFileIndex : ${currentFileIndex}`,
    `\tfilesForEachJob[currentJobIndex].length: ${defaultToNotDefined(filesForEachJob[currentJobIndex].length)}`,
    `\tcurrentFileIndex === filesForEachJob[currentJobIndex].length - 1: ${currentFileIndex === filesForEachJob[currentJobIndex].length - 1}`,
    `\tallFilesForCurrentVeritextJobEqualToEitherCompleteOrError: ${allFilesForCurrentVeritextJobEqualToEitherCompleteOrError}`
  )

  if(currentFileIndex === filesForEachJob[currentJobIndex].length - 1 && allFilesForCurrentVeritextJobEqualToEitherCompleteOrError) {
    Logging.log(
      `50: currentVeritextJob.veritextJobStatus: ${currentVeritextJob.veritextJobStatus}`,
      `\tfirstEqualsOneOfTheOthers(currentVeritextJob.veritextJobStatus, VERITEXT_JOB_STATUSES.DOWNLOADING, VERITEXT_JOB_STATUSES.COMPLETE): ${firstEqualsOneOfTheOthers(currentVeritextJob.veritextJobStatus, VERITEXT_JOB_STATUSES.DOWNLOADING, VERITEXT_JOB_STATUSES.COMPLETE)}`
    )
    if(firstEqualsOneOfTheOthers(currentVeritextJob.veritextJobStatus, VERITEXT_JOB_STATUSES.DOWNLOADING, VERITEXT_JOB_STATUSES.COMPLETE)) {
      currentVeritextJob.veritextJobStatus = VERITEXT_JOB_STATUSES.COMPLETE
      Logging.log("55: just set currentVeritextJob.veritextJobStatus equal to VERITEXT_JOB_STATUSES.COMPLETE")
    }
    else {
      currentVeritextJob.veritextJobStatus = VERITEXT_JOB_STATUSES.ERROR_AND_COMPLETE
      Logging.log("59: just set currentVeritextJob.veritextJobStatus equal to VERITEXT_JOB_STATUSES.ERROR_AND_COMPLETE")
    }
  } Logging.log(`61: currentVeritextJob.veritextJobStatus: ${currentVeritextJob.veritextJobStatus}`)
  Logging.LogSectionEnd()
}

function updateVeriSuiteJobStatus(filesForEachJob, currentJobIndex) {
  let currentVeriSuiteJob = filesForEachJob
  let currentVeritextJob = filesForEachJob[currentJobIndex]
  let allVeritextJobsForCurrentVeriSuiteJobEqualToEitherCompleteOrErrorAndComplete = true

  for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
    Logging.LogSectionStart(`ABOUT TO UPDATE VERITEXT JOB STATUS --AND-- THEN UPDATE VERISUITE JOB STATUS. currentJobIndex = ${currentJobIndex} and currentFileIndex = ${currentFileIndex}`)
    updateVeritextJobStatus(filesForEachJob, currentJobIndex, currentFileIndex)
    Logging.log(`73: veritextJobStatus after updating it: ${currentVeritextJob.veritextJobStatus}`, `\tcurrent veriSuiteJobStatus: ${filesForEachJob.veriSuiteJobStatus}`)

    if(!defined(currentVeritextJob.veritextJobStatus)
      || !firstEqualsOneOfTheOthers(currentVeritextJob.veritextJobStatus, VERITEXT_JOB_STATUSES.COMPLETE, VERITEXT_JOB_STATUSES.ERROR_AND_COMPLETE)
    ) {
      allVeritextJobsForCurrentVeriSuiteJobEqualToEitherCompleteOrErrorAndComplete = false
      Logging.log(`79: just set allVeritextJobsForCurrentVeriSuiteJobEqualToEitherCompleteOrErrorAndComplete to false`)
    }
    Logging.log(`81: allVeritextJobsForCurrentVeriSuiteJobEqualToEitherCompleteOrErrorAndComplete: ${allVeritextJobsForCurrentVeriSuiteJobEqualToEitherCompleteOrErrorAndComplete}`)

    Logging.log(
      `84: currentVeritextJob.veritextJobStatus: ${currentVeritextJob.veritextJobStatus}`,
      `\tdefined(currentVeritextJob.veritextJobStatus): ${defined(currentVeritextJob.veritextJobStatus)}`,
      `\tfirstEqualsOneOfTheOthers(currentVeritextJob.veritextJobStatus, VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE, VERITEXT_JOB_STATUSES.ERROR_AND_COMPLETE): ${firstEqualsOneOfTheOthers(currentVeritextJob.veritextJobStatus, VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE, VERITEXT_JOB_STATUSES.ERROR_AND_COMPLETE)}`
    )

    if(defined(currentVeritextJob.veritextJobStatus) 
      && firstEqualsOneOfTheOthers(currentVeritextJob.veritextJobStatus, VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE, VERITEXT_JOB_STATUSES.ERROR_AND_COMPLETE)
    ) {
      currentVeriSuiteJob.veriSuiteJobStatus = VERISUITE_JOB_STATUSES.ERROR_AND_NOT_COMPLETE
      Logging.log('93: just set currentVeriSuiteJob.veriSuiteJobStatus equal to VERISUITE_JOB_STATUSES.ERROR_AND_NOT_COMPLETE')
    }

    Logging.log(
      `97: currentJobIndex: ${currentJobIndex}`,
      `\tcurrentVeriSuiteJob.length: ${currentVeriSuiteJob.length}`,
      `\tcurrentJobIndex === currentVeriSuiteJob.length - 1: ${currentJobIndex === currentVeriSuiteJob.length - 1}`,
      `\tcurrentFileIndex: ${currentFileIndex}`,
      `\tcurrentVeritextJob.length: ${currentVeritextJob.length}`,
      `\tcurrentFileIndex === currentVeritextJob.length - 1: ${currentFileIndex === currentVeritextJob.length - 1}`,
      `\tallVeritextJobsForCurrentVeriSuiteJobEqualToEitherCompleteOrErrorAndComplete: ${allVeritextJobsForCurrentVeriSuiteJobEqualToEitherCompleteOrErrorAndComplete}`
    )

    if(
      currentJobIndex === currentVeriSuiteJob.length - 1 
      && currentFileIndex === currentVeritextJob.length - 1
      && allVeritextJobsForCurrentVeriSuiteJobEqualToEitherCompleteOrErrorAndComplete
    ) {
      Logging.log(
        `112: currentVeriSuiteJob.veriSuiteJobStatus: ${currentVeriSuiteJob.veriSuiteJobStatus}`,
        `\tcurrentVeriSuiteJob.veriSuiteJobStatus === VERISUITE_JOB_STATUSES.DOWNLOADING: ${currentVeriSuiteJob.veriSuiteJobStatus === VERISUITE_JOB_STATUSES.DOWNLOADING}`
      )
      if(firstEqualsOneOfTheOthers(currentVeriSuiteJob.veriSuiteJobStatus, VERISUITE_JOB_STATUSES.DOWNLOADING, VERISUITE_JOB_STATUSES.COMPLETE)) {
        currentVeriSuiteJob.veriSuiteJobStatus = VERISUITE_JOB_STATUSES.COMPLETE
        Logging.log("117: currentVeriSuiteJob.veriSuiteJobStatus equaled either VERISUITE_JOB_STATUSES.DOWNLOADING or VERISUITE_JOB_STATUSES.COMPLETE. Therefore, just set it equal to VERISUITE_JOB_STATUSES.COMPLETE")
      }
      else {
        currentVeriSuiteJob.veriSuiteJobStatus = VERISUITE_JOB_STATUSES.ERROR_AND_COMPLETE
        Logging.log("121: currentVeriSuiteJob.veriSuiteJobStatus does NOT equal either VERISUITE_JOB_STATUSES.DOWNLOADING or VERISUITE_JOB_STATUSES.COMPLETE. therefore, just set it equal to VERISUITE_JOB_STATUSES.ERROR_AND_COMPLETE")
      }
    }

    Logging.log(
      `126: currentVeritextJob.veritextJobStatus === VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE: ${currentVeritextJob.veritextJobStatus === VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE}`,
      `\tcurrentVeriSuiteJob.veriSuiteJobStatus: ${currentVeriSuiteJob.veriSuiteJobStatus}`
    )

    if(currentVeritextJob.veritextJobStatus === VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE) {
      Logging.log("131: currentVeritextJob.veritextJobStatus equals VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE. about to break")
      break
    }

    Logging.LogSectionEnd()
  }
}

async function pollToSeeIfDownloadsAreComplete(jobNumbers, filesForEachJob, startTimeOfOverallDownload) {
  let allDownloadsComplete = false
  let currentVeriSuiteJob = filesForEachJob

  while(!allDownloadsComplete) {
    for(let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
      updateVeriSuiteJobStatus(filesForEachJob, currentJobIndex)

      if(currentVeriSuiteJob.veriSuiteJobStatus === VERISUITE_JOB_STATUSES.ERROR_AND_NOT_COMPLETE) {
        break
      }
    }

    if(defined(currentVeriSuiteJob.veriSuiteJobStatus)
      && firstEqualsOneOfTheOthers(currentVeriSuiteJob.veriSuiteJobStatus, VERISUITE_JOB_STATUSES.COMPLETE, VERISUITE_JOB_STATUSES.ERROR_AND_COMPLETE)
    ) {
      allDownloadsComplete = true
    }
    else {
      await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_BETWEEN_POLLS_TO_SEE_IF_DOWNLOADS_ARE_COMPLETE_MILLISECONDS) 
    }
  }

  let endTimeOfOverallDownload = Date.now()
  printFinalReport(jobNumbers, filesForEachJob, startTimeOfOverallDownload, endTimeOfOverallDownload)
}

async function pollToSeeIfDownloadsAreCompleteOLD(jobNumbers, filesForEachJob, startTimeOfOverallDownload) {
  let allDownloadsComplete = false 

  while(!allDownloadsComplete) {
    let breakOut = false

    for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
      let currentVeritextJob = filesForEachJob[currentJobIndex]

      for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
        let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]

        if(
          !defined(currentFile.fileStatus)
          || (
            defined(currentFile.fileStatus)
            && !firstEqualsOneOfTheOthers(currentFile.fileStatus, FILE_STATUSES.COMPLETE, FILE_STATUSES.ERROR)
          )
        ) {
          breakOut = true

          //if(currentFile.fileStatus === )

        }

        if(breakOut) { break }
      }

      if(breakOut) { break }
    }

    if(!breakOut) { allDownloadsComplete = true }
    else { await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_BETWEEN_POLLS_TO_SEE_IF_DOWNLOADS_ARE_COMPLETE_MILLISECONDS) }
  }

  let endTimeOfOverallDownload = Date.now()
  //printFinalReport(jobNumbers, filesForEachJob, startTimeOfOverallDownload, endTimeOfOverallDownload)
}

export default pollToSeeIfDownloadsAreComplete