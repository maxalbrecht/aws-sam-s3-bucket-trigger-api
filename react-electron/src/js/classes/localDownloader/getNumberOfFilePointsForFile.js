import LOCAL_DOWNLOADING_CONSTANTS from "../../constants/local-downloading"
import getNecessaryNumberOfChunksForFile from "./getNecessaryNumberOfChunksForFile"

function getNumberOfFilePointsForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex) {
  let necessaryNumberOfChunks = getNecessaryNumberOfChunksForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex)

  let result = Math.min(LOCAL_DOWNLOADING_CONSTANTS.MAX_NUMBER_OF_FILE_POINTS_PER_FILE, necessaryNumberOfChunks)

  return result
}

export default getNumberOfFilePointsForFile