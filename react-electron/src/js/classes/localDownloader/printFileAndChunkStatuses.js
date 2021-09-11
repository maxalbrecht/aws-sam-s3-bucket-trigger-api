import Logging from './../../utils/logging'

function printFileAndChunkStatuses(
  jobNumbers,
  filesForEachJob,
  currentJobIndex,
  currentFileIndex
) {
  Logging.log(`Current File Status: ${filesForEachJob[currentJobIndex][currentFileIndex].fileStatus}`)

  for (let currentChunkIndex = 0; currentChunkIndex < filesForEachJob[currentJobIndex][currentFileIndex].chunks.length; currentChunkIndex++) {
    let chunk = filesForEachJob[currentJobIndex][currentFileIndex].chunks[currentChunkIndex]
    Logging.log(`\tchunk index ${currentChunkIndex}:\n\t\tchunk status: ${chunk.chunkStatus}\n\t\tis s3Reponse defined: ${defined(chunk.s3Response)}`)
  }
}

export default printFileAndChunkStatuses