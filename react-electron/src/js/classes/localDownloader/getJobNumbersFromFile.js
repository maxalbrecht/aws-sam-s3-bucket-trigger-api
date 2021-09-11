import File from './../../utils/file'
import Logging from './../../utils/logging'

function getJobNumbersFromFile(sourceFile) {
  try{
    let contents = File.getContent(sourceFile)
    let jobNumbers = contents.replace(/\s+/g, '').split(',')

    Logging.log("localDownloader.getJobNumbersFromFile()...", "contents:", contents, "jobNumbers", jobNumbers)

    return jobNumbers
  }
  catch(error) {
    Logging.logError("ERROR in localDownloader.getJobNumbersFromFile()", error)
    alert("Unable to read or parse job-number file. Please check the file and try again")
  }
}

export default getJobNumbersFromFile