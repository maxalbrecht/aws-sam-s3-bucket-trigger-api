import Logging from './../../utils/logging'
import defined from './../../utils/defined'
import Text from './../../utils/text'

const { indent } = Text
const {
  tinctured: tint,
  options: { red, white, bgRed }
} = require('tinctured')

function stringifyFileErrors(jobNumbers, filesForEachJob, currentJobIndex, currentFileIndex) {
  Logging.log(`file with Errors (job index ${currentJobIndex}, file index ${currentFileIndex}):`)
  Logging.log(`filesForEachJob[currentJobIndex][currentFileIndex]:`, filesForEachJob[currentJobIndex][currentFileIndex])

  let currentFile = filesForEachJob[currentJobIndex][currentFileIndex]

  let result = ""

  if(defined(currentFile.downloadError)) {
    Logging.log("currentFile.downloadError is defined")

    result += `${indent(0)}${tint("Download Error:", { bgRed })}${tint("", { white })}`
    result += `${indent(1)}${tint("Code:", { bgRed })}${tint("", { white })} ${tint(currentFile.downloadError.error.code, { red })}${tint("", { white })}`
    result += `${indent(1)}Message: ${currentFile.downloadError.error.message}`
    result += `${indent(1)}Status Code: ${currentFile.downloadError.error.statusCode}`
    result += `${indent(1)}RequestId: ${currentFile.downloadError.error.requestId}`

    Logging.log("result after adding downloadError:", result)
  }
  if(defined(currentFile.appendFileDataError)) {
    Logging.log("currentFile.appendFileDataError is defined")
    result += `${indent(0)}Append File-Data Error: ${JSON.stringify(currentFile.appendFileDataError)}`
    Logging.log("result after adding appendFileDataError:", result)
  }

  let chunkLevelErrors = ""
  
  for (let currentChunkIndex = 0; currentChunkIndex < currentFile.chunks.length; currentChunkIndex++) {
    const currentChunk = currentFile.chunks[currentChunkIndex];
    
    if(defined(currentChunk.downloadError) || defined(currentChunk.appendFileDataError)) {
      Logging.log("currentChunk.downloadError or currentChunk.appendFileDataError is defined")

      chunkLevelErrors += `${indent(1)}Chunk Index ${currentChunkIndex}:`

      if(defined(currentChunk.downloadError)) {
        Logging.log("currentChunk.downloadError is defined")

        chunkLevelErrors += `${indent(2)}${tint("Download Error:", { red })}${tint("", { white })}`
        chunkLevelErrors += `${indent(3)}${tint("Code:", { red })}${tint("", { white })} ${currentChunk.downloadError.code}${tint("", { white })}`
        chunkLevelErrors += `${indent(3)}Message: ${currentChunk.downloadError.message}`
        chunkLevelErrors += `${indent(3)}RequestId: ${currentChunk.downloadError.requestId}`

        Logging.log("chunkLevelErrors after adding downloadError:", chunkLevelErrors)
      }
      if(defined(currentChunk.appendFileDataError)) {
        Logging.log("currentChunk.appendFileDataError is defined")

        chunkLevelErrors += `${indent(2)}Append File-Data Error: ${JSON.stringify(currentChunk.appendFileDataError)}`}

        Logging.log("chunkLevelErrors after adding appendFileDataError:", chunkLevelErrors)
    }
  }

  if(chunkLevelErrors !== "") {
    Logging.log("chunkLevelErrors was not equal to an empty string.")
    result += `${indent(0)}Chunk-Level Errors:${chunkLevelErrors}`

    Logging.log("result after adding chunkLevelErrors:", result)
  }

  return result
}

export default stringifyFileErrors