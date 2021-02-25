import Logging from './../utils/logging'

const fs = window.require('fs')

const File = {
  getContent(filePath) {
    let fileContent = ""
    try {
      //let fs = window.require('fs')
      fileContent = fs.readFileSync(filePath, 'utf8')
    }
    catch(e){
      Logging.LogAndThrowError(`Error trying to get File Content. Error:`, e)
    }

    return fileContent
  },
  getSize(filePath) {
    //let fs = window.require("fs"); //Load the filesystem module
    try{
    let stats = fs.statSync(filePath)
    let fileSizeInBytes = stats["size"]
    let fileSizeInKilobytes = fileSizeInBytes / 1000.0

    return fileSizeInKilobytes + " KB";
    }
    catch(err) {
      console.log("Error getting file size. Error: " + err);
      alert("Error getting file size. Please check that the file exists.");
    }
  },
  saveTo(fileContent, filePath) {
    //var fs = window.require('fs');
    try { 
      fs.writeFileSync(filePath, fileContent, 'utf-8'); 
    } 
    catch(e) { alert('Failed to save to file!');
      return console.log(e);
    }
  },
  makeDirIfItDoesNotExist(directory) {
    //var fs = window.require('fs');
    if (!fs.existsSync(directory)){
      fs.mkdirSync(directory)
    }
  }
}

export default File