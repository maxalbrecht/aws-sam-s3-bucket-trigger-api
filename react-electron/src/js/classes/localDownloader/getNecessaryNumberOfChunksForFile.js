import LOCAL_DOWNLOADING_CONSTANTS from "../../constants/local-downloading"

function getNecessaryNumberOfChunksForFile(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex) {
  let necessaryNumberOfChunks = Math.ceil(filesForEachJob[currentJobIndex][currentFileIndex].Size / LOCAL_DOWNLOADING_CONSTANTS.CHUNK_SIZE_IN_BYTES)

  return necessaryNumberOfChunks
}

export default getNecessaryNumberOfChunksForFile