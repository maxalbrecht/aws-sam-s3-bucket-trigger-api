import Logging from './../utils/logging'

const File = {
  getContent(filePath) {
    let fileContent = ""
    try {
      let fs = window.require('fs')
      fileContent = fs.readFileSync(filePath, 'utf8')
    }
    catch(e){
      Logging.LogAndThrowError(`Error trying to get File Content. Error:`, e)
    }

    return fileContent
  }
}

export default File