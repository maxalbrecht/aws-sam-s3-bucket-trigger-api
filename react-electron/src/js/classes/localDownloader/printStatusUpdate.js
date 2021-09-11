import Text from './../../utils/text'
import DateUtils from './../../utils/date-utils'
import Nums from './../../utils/nums'
import Time from './../../utils/time'
import Logging from './../../utils/logging'
import NotDef from './../../utils/not-def'
import LOCAL_DOWNLOADING_CONSTANTS from './../../constants/local-downloading'

const { VERISUITE_JOB_STATUSES, VERITEXT_JOB_STATUSES, FILE_STATUSES, CHUNK_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS
const { indent } = Text
const { sleep } = Time
const { defaultToNotDefined, defined } = NotDef
const {
  tinctured: tint,
  options: { cyan, bright, red, white, bgRed, reset, magenta, yellow, green, bgGreen }
} = require('tinctured')


async function printStatusUpdate(filesForEachJob, jobNumbers, includeChunks = true) {
  while(true) {
    let report = `${tint("CURRENT STATUS", { cyan, bright })}${tint("", { white })}`
    report += `${indent(1)}${tint("Current Time: ", { reset })}${DateUtils.GetDateDisplay()}`
    report += `${indent(1)}VeriSuite Job Status: ${
      defaultToNotDefined(filesForEachJob.veriSuiteJobStatus)
        .replace(VERISUITE_JOB_STATUSES.ERROR_AND_NOT_COMPLETE , tint(VERISUITE_JOB_STATUSES.ERROR_AND_NOT_COMPLETE, { red }))
        .replace(VERISUITE_JOB_STATUSES.ERROR_AND_COMPLETE , tint(VERISUITE_JOB_STATUSES.ERROR_AND_COMPLETE, { bgRed }))
        .replace(VERISUITE_JOB_STATUSES.COMPLETE, tint(VERISUITE_JOB_STATUSES.COMPLETE, {bgGreen }))
        .replace(NotDef.NOT_DEFINED, tint(NotDef.NOT_DEFINED, { yellow }))
    }${tint("", { white })}`
    report += `${indent(1)}Veritext Jobs (by index):`

    for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
      const currentJob = filesForEachJob[currentJobIndex];
      Logging.log("filesForEachJob (a.k.a. veriSuiteJob):", filesForEachJob)
      Logging.log("currentJob:", currentJob)
      report += `${indent(2)}${tint(`job ${currentJobIndex}:`, { magenta })}${tint("", { white })}`
      report += `${indent(3)}Job Number: ${jobNumbers[currentJobIndex]}`
      report += `${indent(3)}Veritext Job Status: ${
        defaultToNotDefined(currentJob.veritextJobStatus)
          .replace(VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE , tint(VERITEXT_JOB_STATUSES.ERROR_AND_NOT_COMPLETE, { red }))
          .replace(VERITEXT_JOB_STATUSES.ERROR_AND_COMPLETE , tint(VERITEXT_JOB_STATUSES.ERROR_AND_COMPLETE, { bgRed }))
          .replace(VERITEXT_JOB_STATUSES.COMPLETE, tint(VERITEXT_JOB_STATUSES.COMPLETE, {bgGreen }))
          .replace(NotDef.NOT_DEFINED, tint(NotDef.NOT_DEFINED, { yellow }))
      }${tint("", { white })}`
      report += `${indent(3)}Files (by index):`

      for (let currentFileIndex = 0; currentFileIndex < currentJob.length; currentFileIndex++) {
        const currentFile = currentJob[currentFileIndex];
        
        report += `${indent(4)}${tint(`file ${currentFileIndex}:`, { cyan })}${tint("", { white })}`
        report += `${indent(5)}Key:\t\t  ${currentFile.Key}`
        report += `${indent(5)}fileStatus: ${defined(currentFile.fileStatus) ? (currentFile.fileStatus.replace(FILE_STATUSES.COMPLETE, tint(FILE_STATUSES.COMPLETE, { bgGreen })).replace(FILE_STATUSES.ERROR, tint(FILE_STATUSES.ERROR, { bgRed }))) : tint("NOT defined", { yellow })}${tint("", { white })}`
        report += `${indent(5)}Size:\t\t  ${Nums.withCommas(currentFile.Size)}`

        if(
          includeChunks
          && defined(currentFile.chunks)
          && (!defined(currentFile.fileStatus) || currentFile.fileStatus !== FILE_STATUSES.COMPLETE)
        ) {
          report += `${indent(5)}Chunks (by index):`

          for (let currentChunkIndex = 0; currentChunkIndex < currentFile.chunks.length; currentChunkIndex++) {
            const currentChunk = currentFile.chunks[currentChunkIndex]

            report += `${indent(6)}chunk ${currentChunkIndex}:`
            report += `${indent(7)}chunkStatus: ${defined(currentChunk.chunkStatus) ? (currentChunk.chunkStatus.replace(CHUNK_STATUSES.COMPLETE, tint(CHUNK_STATUSES.COMPLETE, { green })).replace(CHUNK_STATUSES.ERROR, tint(CHUNK_STATUSES.ERROR, { red }))) : tint("NOT defined", { yellow })}${tint("", { white })}`
          }
        }
        else if(
          includeChunks
          && (!defined(currentFile.fileStatus) || currentFile.fileStatus !== FILE_STATUSES.COMPLETE)
        ) {
          report += `${indent(5)}Chunks defined: ${defined(currentFile.chunks) ? "defined" : tint("NOT defined", { yellow })}${tint("", { white })}`
        }
      }
    }

    report += "\n"

    Logging.log(report)

    await sleep(LOCAL_DOWNLOADING_CONSTANTS.TIMEOUT_BETWEEN_PRINTING_STATUS_UPDATES_MILLISECONDS)
  }
}

export default printStatusUpdate