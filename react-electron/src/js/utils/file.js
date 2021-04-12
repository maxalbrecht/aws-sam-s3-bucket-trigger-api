//import Logging from './logging'
import defined from './defined'
import Logging from './logging'

const fs = window.require('fs')
const UNITS_BASE1 = {
  B: "B",
  KB: "KB",
  MB: "MB",
  GB: "GB",
  TB: "TB",
  conversionFactorForOneLevel: 1000,
}
const UNITS_BASE2 = {
  ...UNITS_BASE1,
  order: [UNITS_BASE1.B, UNITS_BASE1.KB, UNITS_BASE1.MB, UNITS_BASE1.GB, UNITS_BASE1.TB]
}

const UNITS = {
  ...UNITS_BASE2,
  convert(size, sourceUnit, targetUnit) {
    let power = UNITS_BASE2.order.indexOf(sourceUnit) - UNITS_BASE2.order.indexOf(targetUnit)

    /*
    console.warn("CONVERT():")
    console.warn("size:")
    console.warn(size)
    console.warn("sourceUnit:")
    console.warn(sourceUnit)
    console.warn("targetUnit:")
    console.warn(targetUnit)
    console.warn("power:")
    console.warn(power)
    console.warn("UNITS_BASE2.conversionFactorForOneLevel:")
    console.warn(UNITS_BASE2.conversionFactorForOneLevel)
    let conversionFactorRaised = Math.pow(UNITS_BASE2.conversionFactorForOneLevel, power)
    console.warn("conversionFactorRaised")
    console.warn(conversionFactorRaised)

    let result = size * conversionFactorRaised
    console.warn("Convert result:")
    console.warn(result)
    */

    return size * Math.pow(UNITS_BASE2.conversionFactorForOneLevel, power)
  }
}  

const File = {
  UNITS: {...UNITS, testing: "testing"} ,
  getContent(filePath) {
    let fileContent = ""
    try {
      //let fs = window.require('fs')
      if(fs.existsSync(filePath)){

        fileContent = fs.readFileSync(filePath, 'utf8')

      }
      else {
        Logging.warn(`File.getContent(): The file with the following file path does not exist. Will return null. filePath: ${filePath}`)

        //return null
      }
    }
    catch(e){
      Logging.error(e, `Error trying to get File Content`)
      //^^//console.log(`Error trying to get File Content. Error:`)
      //^^//console.log(e)
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
      //^^//console.log("Error getting file size. Error: " + err);
      alert("Error getting file size. Please check that the file exists.");
    }
  },
  overSizeLimit(filePath, sizeLimit, unit = UNITS.B) {
    /*
    let fileExists = fs.existsSync(filePath)
    let fileSize = -1
    if(fileExists) {fileSize = fs.statSync(filePath).size }
    let sizeLimitInB = UNITS.convert(sizeLimit, unit, UNITS.B)

    console.warn("FILE.OVERSIZELIMIT():")
    console.warn("fileExists:")
    console.warn(fileExists)
    console.warn("fileSize:")
    console.warn(fileSize)
    console.warn("sizeLimit:")
    console.warn(sizeLimit)
    console.warn("sizeLimitInB:")
    console.warn(sizeLimitInB)
    if(fileExists) { 
      console.warn("fs.statSync(filePath).size > UNITS.convert(sizeLimit, unit, UNITS.B)") 
      console.warn((fs.statSync(filePath).size > UNITS.convert(sizeLimit, unit, UNITS.B))) 
    }
    */

    let result = false
    if( fs.existsSync(filePath) && fs.statSync(filePath).size > UNITS.convert(sizeLimit, unit, UNITS.B) ) {
      result = true
    }

    //console.warn("overSizeLimit result:")
    //console.warn(result)

    return result
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
  appendTo(fileContent, filePathOrStream, closeStream = false) {
    let { filePath, stream } = filePathOrStream

    if(!defined(stream)) {
      stream = fs.createWriteStream(filePath, { flags: 'a' })
      closeStream = true
    }

    stream.write(fileContent)

    if(closeStream) { stream.end() }
  },
  makeDirIfItDoesNotExist(directory) {
    //var fs = window.require('fs');
    if (defined(directory) && !fs.existsSync(directory)){
      fs.mkdirSync(directory)
    }
  },
  removeFileExtension(fileName) {
    return fileName.substr(0, fileName.lastIndexOf('.'))
  },
  getNameFromPath(filePath) {
    let filePathSplit = filePath.split('\\')
    return filePathSplit[filePathSplit.length - 1]
  },
  removeNameFromPath(filePath) {
    return `${filePath.substr(0, filePath.lastIndexOf('\\'))}\\`
  }
}

export default File