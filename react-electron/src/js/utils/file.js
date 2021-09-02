//import Logging from './logging'
import defined from './defined'
import Logging from './logging'
import { convertUnits } from './conversionFunctions'

const fs = window.require('fs')
const b = "b"
const B = "B"
const KB = "KB"
const MB = "MB"
const GB = "GB"
const TB = "TB"

const Kb = "Kb"
const Mb = "Mb"
const Gb = "Gb"
const Tb = "Tb"

function getByteUnitConversions() {
  const byteUnitConversions = {}
  let   ordinalNumber = 0

  byteUnitConversions[b] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: B,
    conversionToNextUnit: 8
  }
  byteUnitConversions[B] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: KB,
    conversionToNextUnit: 1000
  }
  byteUnitConversions[KB] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: MB,
    conversionToNextUnit: 1000
  }
  byteUnitConversions[MB] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: GB,
    conversionToNextUnit: 1000
  }
  byteUnitConversions[GB] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: TB,
    conversionToNextUnit: 1000
  }
  byteUnitConversions[TB] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: null,
    conversionToNextUnit: null
  }

  return byteUnitConversions
}

function getBitUnitConversions() {
  const bitUnitConversions = {}
  let   ordinalNumber = 0
  
  bitUnitConversions[b] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: Kb,
    conversionToNextUnit: 1000
  }
  bitUnitConversions[Kb] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: Mb,
    conversionToNextUnit: 1000
  }
  bitUnitConversions[Mb] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: Gb,
    conversionToNextUnit: 1000
  }
  bitUnitConversions[Gb] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: Tb,
    conversionToNextUnit: 1000
  }
  bitUnitConversions[Tb] = {
    ordinalNumber: ordinalNumber++,
    nextUnit: null,
    conversionToNextUnit: null
  }

  return bitUnitConversions
}

/*
function convertUnits(amount, sourceUnit, targetUnit, unitConversions) {
  let result = amount

  if(unitConversions[sourceUnit].ordinalNumber <= unitConversions[targetUnit].ordinalNumber) {
    while(sourceUnit !== targetUnit) {
      result /= (unitConversions[sourceUnit].conversionToNextUnit * 1.0) 

      sourceUnit = unitConversions[sourceUnit].nextUnit
    }
  }
  else {
    while(targetUnit !== sourceUnit) {
      result *= unitConversions[targetUnit].conversionToNextUnit

      targetUnit = unitConversions[targetUnit].nextUnit
    }
  }

  return result
}
*/

function convertDataUnits(amount, sourceUnit, targetUnit) {
  if(
    (sourceUnit[sourceUnit.length - 1] === B || sourceUnit === b)
    && (targetUnit[targetUnit.length - 1] === B || targetUnit === b)
  ) {
    return convertUnits(amount, sourceUnit, targetUnit, getByteUnitConversions())
  }
  else if(sourceUnit[sourceUnit.length - 1] === b && targetUnit[targetUnit.length - 1] === b){
    return convertUnits(amount, sourceUnit, targetUnit, getBitUnitConversions())
  }
  else if(sourceUnit[sourceUnit.length - 1] === B && targetUnit[targetUnit.length - 1] === b){
    let amountInBits = convertUnits(amount, sourceUnit, b, getByteUnitConversions())

    return convertUnits(amountInBits, b, targetUnit, getBitUnitConversions())
  }
  else if(sourceUnit[sourceUnit.length - 1] === b && targetUnit[targetUnit.length - 1] === B){
    let amountInBits = convertUnits(amount, sourceUnit, b, getBitUnitConversions())

    return convertUnits(amountInBits, b, targetUnit, getByteUnitConversions())
  }
}

const UNITS_BASE1 = {
  b,
  B,
  KB,
  MB,
  GB,
  TB,
  Kb,
  Mb,
  Gb,
  Tb,
  conversionFactorForOneLevel: 1000,
}
const UNITS_BASE2 = {
  ...UNITS_BASE1,
  order: [UNITS_BASE1.B, UNITS_BASE1.KB, UNITS_BASE1.MB, UNITS_BASE1.GB, UNITS_BASE1.TB]
}

const UNITS = {
  ...UNITS_BASE2,
  convertDataUnits,
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

function removeDir(path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)

    if (files.length > 0) {
      files.forEach(function(filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          removeDir(path + "/" + filename)
        } else {
          fs.unlinkSync(path + "/" + filename)
        }
      })
      fs.rmdirSync(path)
    } else {
      fs.rmdirSync(path)
    }
  } else {
    console.log("Directory path not found.")
  }
}

function removeNameFromPath(filePath) {
    return `${filePath.substr(0, filePath.lastIndexOf('\\'))}\\`
  }

function makeDirIfItDoesNotExist(directory) {
  //var fs = window.require('fs');
  try{
    if (defined(directory) && !fs.existsSync(directory)){
      fs.mkdirSync(directory, { recursive: true }, (err) => {
        if(err) {
          throw err
        }
      })
    }
  }
  catch(error) { 
    //alert(`Failed to create directory "${directory}"`)
    console.log(`ERROR when attempting to create directory "${directory}". Error is as follows:`)
    console.log(error)
  }
}
function saveTo(fileContent, filePath) {
  //var fs = window.require('fs');
  try { 
    fs.writeFileSync(filePath, fileContent, 'utf-8'); 
  }
  catch(e) { alert('Failed to save to file!');
    return console.log(e);
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
  getSizeInBytes(filePath) {
    try {
    let stats = fs.statSync(filePath)
    let fileSizeInBytes = stats["size"]

    return fileSizeInBytes
    }
    catch(err) {
      //^^//console.log("Error getting file size. Error: " + err);
      alert("Error getting file size. Please check that the file exists.");
    }
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
  saveTo,
  createAppendStream(filePath) {
    let stream = fs.createWriteStream(filePath, { flags: 'a' })

    return stream
  },
  async appendTo(fileContent, filePathOrStream, closeStream = false) {
    let { filePath, stream } = filePathOrStream

    if(!defined(stream)) {
      stream = fs.createWriteStream(filePath, { flags: 'a' })
      closeStream = true
    }

    let writeResult = await stream.write(fileContent)

    if(closeStream) { await stream.end() }

    return writeResult
  },
  makeDirIfItDoesNotExist,
  makeFileIfItDoesNotExist(filePath, defaultContent = '') {
    try {
      makeDirIfItDoesNotExist(removeNameFromPath(filePath))

      if(!fs.existsSync(filePath)) {
        saveTo(defaultContent, filePath)
      }
    }
    catch(error) {
      console.log("error in File.makeFileIfItDoesNotExist()")
    }
  },
  deleteDirIfItExists: removeDir,
  /*
  async deleteDirIfItExists(directory) 
  {
    console.log(`DIRECTORY TO BE DELETED: ${directory}`)
    try {
      if(defined(directory && fs.existsSync(directory))) {
        var rimraf = require("rimraf")
        //let result = await rimraf(directory, function() { console.log(`deleteDirIfItExists: deleted the following directory: ${directory}`)})
        return rimraf.sync(directory)
        //return result
      }
    }
    catch(error) {
      console.log(`ERROR when attempting to delete directory "${directory}". Error is as follows:`)
      console.log(error)
    }
  },
  */
  removeFileExtension(fileName) {
    return fileName.substr(0, fileName.lastIndexOf('.'))
  },
  getNameFromPath(filePath) {
    let filePathSplit = filePath.split('\\')
    return filePathSplit[filePathSplit.length - 1]
  },
  removeNameFromPath,
  async getMd5Hash(filePath) {
    let md5 = require('md5')
    let buffer = fs.readFileSync(filePath)
    let hexSync = md5(buffer)

    console.log("MD5 SYNC HEX:")
    console.log(hexSync)

    let hex
    
    await fs.readFile(filePath, function(err, buf) {
      let hex = md5(buf)
      console.log("MD5 ASYNC HEX:")
      console.log(hex);
    });

    return hex
    /*
    const crypto = require('crypto');
    //const fs = require('fs');

    console.log(`### getMd5Hash filePath: ${filePath}`)

    const fileBuffer = await fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);

    const hex = hashSum.digest('hex');

    console.log(hex);

    return hex

    */

    /*
    let crypto = require('crypto')
    const fileBuffer = fs.readFileSync(filePath)
    const hashSum = crypto.createHash('md5')

    await hashSum.update(fileBuffer)
    const hex = hashSum.digest('hex')

    return hex
    */
    /*
    let hashOfFile = crypto.createHash('md5')
    let stream = fs.createReadStream(filePath)

    stream.on('data', function (data) {
      hashOfFile.update(data, 'utf8')
    })

    await stream.on('end', function () {
      hashOfFile.digest('hex') // 34f7a3113803f8ed3b8fd7ce5656ebec
    })
    */
  }
}

export default File