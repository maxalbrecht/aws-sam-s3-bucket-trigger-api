import NotDef from './../../utils/not-def'
import LOCAL_DOWNLOADING_CONSTANTS from '../../constants/local-downloading'
import DateUtils from './../../utils/date-utils'
import Nums from './../../utils/nums'
import Text from './../../utils/text'
import File from './../../utils/file'
import Logging from './../../utils/logging'
import getNecessaryNumberOfChunksForFile from './getNecessaryNumberOfChunksForFile'
import stringifyFileErrors from './stringifyFileErrors'

const { defined, defaultToNotDefined, defaultToZero } = NotDef
const { FILE_STATUSES, CHUNK_STATUSES } = LOCAL_DOWNLOADING_CONSTANTS
const { SECONDS, MILLISECONDS } = DateUtils.TIME_UNITS
const {indent, addIndent } = Text

function initializeListOfFilesPerStatus() {
  let result = { 
    NOT_DEFINED: {
      array: []
    }
  }

  for (const key in FILE_STATUSES) {
    if(FILE_STATUSES.hasOwnProperty(key)) {
      result[key] = {
        array: []
      }
    }
  }

  return result
}

function initializeListOfChunksPerStatus() {
  let result = { 
    NOT_DEFINED: {
      array: [],
      totalChunkCount: 0
    }
  }

  for (const key in CHUNK_STATUSES) {
    if(CHUNK_STATUSES.hasOwnProperty(key)) {
      result[key] = {
        array: [],
        totalChunkCount: 0
      }
    }
  }

  return result
}

function initializeListOfChunksPerStatusForFile(fileIndex) {
  let result = {
    NOT_DEFINED: {
      fileIndex: fileIndex,
      array: []
    }
  }

  for(const key in CHUNK_STATUSES) {
    if(CHUNK_STATUSES.hasOwnProperty(key)) {
      result[key] = {
        fileIndex: fileIndex,
        array: []
      }
    }
  }

  return result
}

function addChunksForCurrentFileToChunksPerStateList(listOfChunksPerStatusForCurrentFile, chunksPerState) {
  for(const key in listOfChunksPerStatusForCurrentFile) {
    if(listOfChunksPerStatusForCurrentFile.hasOwnProperty(key)) {
      chunksPerState[key].array.push(listOfChunksPerStatusForCurrentFile[key])
      chunksPerState[key].totalChunkCount += listOfChunksPerStatusForCurrentFile[key].length
    }
  }
}

export function printFinalReport(jobNumbers, filesForEachJob, startTimeOfOverallDownload, endTimeOfOverallDownload) {
    try {
      let filesPerState = initializeListOfFilesPerStatus()
      let chunksPerState = initializeListOfChunksPerStatus()
      let timeElapsed = 0
      if(defined(endTimeOfOverallDownload) && defined(startTimeOfOverallDownload)) {
        timeElapsed = endTimeOfOverallDownload - startTimeOfOverallDownload
      }
      let totalNumberOfFiles = 0
      let totalPossibleBytesToDownload = 0
      let totalBytesDownloaded = 0

      for (let currentJobIndex = 0; currentJobIndex < filesForEachJob.length; currentJobIndex++) {
        const currentJob = filesForEachJob[currentJobIndex];
        totalNumberOfFiles += currentJob.length
        
        for (let currentFileIndex = 0; currentFileIndex < filesForEachJob[currentJobIndex].length; currentFileIndex++) {
          const currentFile = filesForEachJob[currentJobIndex][currentFileIndex]
          totalPossibleBytesToDownload += currentFile.Size

          if((defined(currentFile.fileStatus) && currentFile.fileStatus === FILE_STATUSES.COMPLETE) || !defined(currentFile.fileStatus)) {
            if(defined(currentFile.fileStatus)) {
              totalBytesDownloaded += currentFile.Size
              //chunksPerState[CHUNK_STATUSES.COMPLETE].totalChunkCount += currentFile.chunks.length
            }

            let necessaryNumberOfChunks = getNecessaryNumberOfChunksForFile([], filesForEachJob, currentJobIndex, currentFileIndex)

            filesPerState[defaultToNotDefined(currentFile.fileStatus)].array.push({ jobIndex: currentJobIndex, fileIndex: currentFileIndex })
            chunksPerState[defaultToNotDefined(CHUNK_STATUSES.COMPLETE)].array.push({
              jobIndex: currentJobIndex, 
              fileIndex: currentFileIndex,
              includesEveryChunkOfFile: true,
              necessaryNumberOfChunks: necessaryNumberOfChunks
            })
          }
          else if (defined(currentFile.fileStatus)) {
            Logging.log("currentFile.fileStatus is defined")
            
            filesPerState[currentFile.fileStatus].array.push({ jobIndex: currentJobIndex, fileIndex: currentFileIndex })
            let listOfChunksPerStatusForCurrentFile = initializeListOfChunksPerStatusForFile(currentFileIndex)

            for (let currentChunkIndex = 0; defined(filesForEachJob[currentJobIndex][currentFileIndex].chunks, "length") && currentChunkIndex < filesForEachJob[currentJobIndex][currentFileIndex].chunks.length; currentChunkIndex++) {
              const currentChunk = filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex]

              
              if(defined(currentChunk, "chunkState") && currentChunk.chunkState === defaultToNotDefined(CHUNK_STATUSES.COMPLETE)) {
                totalBytesDownloaded += LOCAL_DOWNLOADING_CONSTANTS.CHUNK_SIZE_IN_BYTES
              }

              Logging.log(
                "listOfChunksPerStatusForCurrentFile:", listOfChunksPerStatusForCurrentFile,
                "currentChunk:", currentChunk,
                "defaultToNotDefined(currentChunk.chunkStatus):", defaultToNotDefined(currentChunk.chunkStatus)
                )
              
              listOfChunksPerStatusForCurrentFile[defaultToNotDefined(currentChunk.chunkStatus)].array.push( { chunkIndex: currentChunkIndex } )
              
            }

            addChunksForCurrentFileToChunksPerStateList(listOfChunksPerStatusForCurrentFile, chunksPerState)
            
          }
          
        } 
      }

      let rawSpeedMbps = (File.UNITS.convertDataUnits(totalBytesDownloaded, File.UNITS.B, File.UNITS.Mb)/(DateUtils.convertTimeUnits(timeElapsed, MILLISECONDS, SECONDS)))
      let report = ""
      
      report += `\nPercentage of Files Successfully Downloaded: ${Nums.percentage(defaultToZero(filesPerState[FILE_STATUSES.COMPLETE].array.length), totalNumberOfFiles, 2)}%`
      report += `\nNumber of Files Successfully Downloaded: ${Nums.withCommas(defaultToZero(filesPerState[FILE_STATUSES.COMPLETE].array.length))}`
      report += `\nNumber of Files Requested: ${Nums.withCommas(totalNumberOfFiles)}`
      report += "\n---------"
      report += `\nPercentage of Bytes Successfully Downloaded: ${Nums.percentage(totalBytesDownloaded, totalPossibleBytesToDownload, 2)}%`
      report += `\nTotal Bytes Downloaded: ${Nums.withCommas(totalBytesDownloaded)}`
      report += `\nTotal Bytes in Files Requested: ${Nums.withCommas(totalPossibleBytesToDownload)}` 
      report += "\n---------"
      //report += `\nFile Integrity Check Passed: ${fileIntegrityCheck}`
    // report += "\n---------"
      report += `\nTime Elapsed: ${DateUtils.msToTime(timeElapsed)}`
      report += `\nRaw Speed (Mbps): ${Nums.round(rawSpeedMbps, 1)}`

      if(filesPerState[FILE_STATUSES.ERROR].array.length > 0) {
        report += "\nFILES WITH ERRORS:"

        let lastJobIndex = -1

        for (let currentErroredOutFileIndex = 0; currentErroredOutFileIndex < filesPerState[FILE_STATUSES.ERROR].array.length; currentErroredOutFileIndex++) {
          const currentJobIndex = filesPerState[FILE_STATUSES.ERROR].array[currentErroredOutFileIndex].jobIndex;
          const currentFileIndex = filesPerState[FILE_STATUSES.ERROR].array[currentErroredOutFileIndex].fileIndex;
          const currentFile = filesForEachJob[currentJobIndex][currentFileIndex]

          if(currentJobIndex !== lastJobIndex) {
            report += `${indent(1)}Job # ${jobNumbers[currentJobIndex]}`
          }

          report += `${indent(2)}File: ${currentFile.Key}`
          report += `${indent(3)}State: ${currentFile.fileState}`
          report += `${indent(3)}Error(s):`
          report += `\n${addIndent(stringifyFileErrors(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex), 4)}`

          lastJobIndex = currentJobIndex
        }
      }

      report += `\n\n`

      Logging.log("filesForEachJob:", filesForEachJob, `Summary Status Report:\n${report}`, "filesPerState:", filesPerState, "chunksPerState:", chunksPerState)

      alert(`Local Download complete.\n\nFinal Report${report}`) 
    }
    catch(error) {
      Logging.logError("error in LocalDownloader.printFinalReport:", error)
      Logging.log("error:", error)
      alert('Local Download complete.')
    }
  }

  export default printFinalReport