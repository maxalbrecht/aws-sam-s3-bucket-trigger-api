import DateUtils from './date-utils'
import defined from './defined'
import File from './file'
import Int from './int'
import firstEqualsOneOfTheOthers from './first-equals-one-of-the-others'
//import STRING_CONSTANTS from './../constants/string'
import LOG from './../constants/log'
import DATA from './../constants/data'
const fs = window.require('fs')
const uuidv4 = window.require("uuid/v4")

/*
let msgTypes = {
  error: "error",
  warn: "warn",
  info: "info",
  verbose: "verbose",
  debug: "debug",
  silly: "silly"
}
msgTypes.asList = Object.values(msgTypes)

const LOG = {
  file: {
    directory: `${STRING_CONSTANTS.USER_DATA_FOLDER}\\logging\\`,
    name: {
      base: "VeriSuite_log",
      ext: ".log"
    },
    sizeLimitInMB: 1.5,
    delimiters:{ 
      field: "|^|",
      record:"|<^|"
    },
    levelMinLength: 5,
    includeStackTrace: true
  },
  msgTypes: { ...msgTypes },
  dividers: {
    hashtagLine: "############################################################",
    sectionStart: "vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",
    sectionEnd: "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
  }
}
*/

/*
let DATA_BASE = {
  types: {
    boolean: "boolean",
    number: "number",
    bigint: "bigint",
    symbol: "symbol",
    function: "function"
  }
}

DATA_BASE.types.asList = Object.values(DATA_BASE.types)
const DATA = { ...DATA_BASE }
*/

/*
const HASHTAG_LINE = "############################################################"
const SECTION_START = "vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv"
const SECTION_END = "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
*/

/*
const error_const = "error"
const warn_const = "warn"
const info_const = "info"
const verbose_const = "verbose"
const debug_const = "debug"
const silly_const = "silly"
*/

//const MSG_TYPES = { ...MSG_TYPES_BASE }

/*
let DATA_TYPES_BASE = {
  boolean: "boolean",
  number: "number",
  bigint: "bigint",
  symbol: "symbol",
  function: "function"
}
DATA_TYPES_BASE.asList = Object.values(DATA_TYPES_BASE)
const DATA_TYPES = { ...DATA_TYPES_BASE }
*/
//[DATA_TYPES_BASE.boolean, DATA_TYPES_BASE.number, DATA_TYPES_BASE.bigint, DATA_TYPES_BASE.symbol, DATA_TYPES_BASE.function]

function getLogFileStream() {
  try {
    return fs.createWriteStream(getLogFilePath(LOG.file.directory), { flags: 'a' })
  } catch(error) {
    console.error("error in Logging.getLogFileStream()", error)
  }
}

function buildLogFileName(fileNameBase, dateStamp, i, fileNameExt) {
  return `${fileNameBase}_${dateStamp}_${Int.ThreeChars(i)}${fileNameExt}`
}

function getLogFilePath(fileDirectory) {
  let dateStamp = DateUtils.getCurrentDateStamp()

  File.makeDirIfItDoesNotExist(fileDirectory)

  let indexOfLatestLogFile = 1

  for(let i = fs.readdirSync(fileDirectory).length; i > 0; i--) {
    let currentFileName = buildLogFileName(LOG.file.name.base, dateStamp, i, LOG.file.name.ext)
    let currentFilePath = `${fileDirectory}${currentFileName}`

    if(fs.existsSync(currentFilePath)) {
      indexOfLatestLogFile = i
      break
    }
  }

  for (let i = indexOfLatestLogFile; i < 10000; i++) {
    let fileName = buildLogFileName(LOG.file.name.base, dateStamp, i, LOG.file.name.ext)
    let filePath = `${fileDirectory}${fileName}`

    if(!File.overSizeLimit(filePath, LOG.file.sizeLimitInMB, "MB")) { return filePath }
  }
}

function getStackTrace() {
  let obj = {}
  Error.captureStackTrace(obj, getStackTrace)
  let stack = obj.stack.split('\n').map(function (line) { return line.trim() })

  return `STACK TRACE:\n\t${stack.splice(stack[0] === 'Error' ? 2 : 1).join('\n\t')}\n`;
}

function isError(obj){
    return Object.prototype.toString.call(obj) === "[object Error]";
}

function stringifyError(error) {
  var alt = {};

  Object.getOwnPropertyNames(error).forEach(function (key) {
      alt[key] = this[key];
  }, error);

  return alt;
}

/*
function filterOutCircularReferences(key, value) {
  let cache = []

  //filters vue.js internal properties
  if(key && key.length > 0 && (key.charAt(0) === "$" || key.charAt(0) === "_")) {
      return;
  }

  if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
      }
      // Store value in our collection
      cache.push(value);
  }

  return value;
}
*/

 const replacerFunc = () => {
    const visited = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (visited.has(value)) {
          return;
        }
        visited.add(value);
      }
      return value;
    };
  };

function stringifyObject(obj) {
  let space = 2

  let result = JSON.stringify(obj, replacerFunc(), space)

  return result

}

function formatLogMessage(message){
  try{
    if(!defined(message)) { message = "<<NOT DEFINED>>"}
    else if(message === "") { message = "<<EMPTY STRING>>"}
    else if(typeof message === DATA.types.string) { }
    else if(Array.isArray(message) && message.length === 0) { message = "<<EMPTY ARRAY>>"}
    else if(Array.isArray(message)) { message = message.toString() }
    else if(typeof message === DATA.types.object && isError(message)) { message = stringifyError(message) }
    else if(typeof message === DATA.types.object) { 
      message = `OBJECT:\n\t${stringifyObject(message).replace(/\n/g, '\n\t')}\n`
    }
    else if(firstEqualsOneOfTheOthers(typeof message, ...DATA.types.asList)) { 
      message = message.toString() 
    }
  } catch(error) {
    console.error("Error caught in Logging.formatLogMessage() when trying to format message parameter.", error)
    message = "<<ERROR formatting message for log file. Details were printed to the console>>"
  }

  return message
}

function addOtherFieldsToLogRecord(logRecord, level = ""){
  let result = ""

  try{
    let fieldValues = [
      DateUtils.getCurrentISOTimestamp(),
      level.padEnd(LOG.file.levelMinLength).toUpperCase(),
      logRecord,
      uuidv4(),
      LOG.file.includeStackTrace ? getStackTrace() : "<<LOG.file.includeStackTrace SET TO FALSE>>"
    ]

    for (let i = 0; i < fieldValues.length; i++) {
      if(i !== 0) { result += ' ' }
      result += fieldValues[i]
      if(i !== fieldValues.length - 1) { result += ` ${LOG.file.delimiters.field}` }
    }
  }catch(error) {
    logError("Error caught in Logging.addOtherFieldsToLogRecord().", error)
    result = "<<ERROR adding record fields>>"
  }

  try{ result += ` ${LOG.file.delimiters.record}\n` }
  catch(error) {
    logError("error caught adding log record delimiter", error)
    result = "<<ERROR adding record delimiter>>"
  }

  return result
}

function getOldestFile(dir) {
  let out = []
  let files = fs.readdirSync(dir)

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let stats = fs.statSync(`${dir}${file}`)

    if(stats.isFile()) {
      out.push({ "file":file, "mtime": stats.mtime.getTime() })
    }
  }

  out.sort(function(a, b) {
    return a.mtime - b.mtime
  })

  return (out.length > 0) ? out[0].file : ""
}

function rollLogFilesIfOverSizeLimit() {
  try {
    if(fs.readdirSync(LOG.file.directory).length > LOG.file.maxFileCount) {
      fs.unlinkSync(`${LOG.file.directory}${getOldestFile(LOG.file.directory)}`)
    }
  } catch(error) {
    console.error("Logging.rollLogFilesIfOverSizeLimit(): Error rolling log files", error)
  }
}

function logToFile(level, ...messages) {
  try {
    if( !(defined(LOG, "settings.logToFile") && !LOG.settings.logToFile) ) {
      rollLogFilesIfOverSizeLimit()
      let stream = getLogFileStream()
      let concatenatedMessages =""
      let length = messages.length

      try {
        for (let i = 0; i < length; i++) {
          let header = `${(length > 1 ? `\n\t` : "")}message${(length > 1 ? ` ${i + 1}` : "")}: `
          let body = `${formatLogMessage(messages[i])}${(length > 1 && i + 1 === length ? "\n " : "")}`
          concatenatedMessages += `${header}${body}`
        }

        File.appendTo(addOtherFieldsToLogRecord(concatenatedMessages, level), { stream: stream })
      }
      catch(error) {
        console.error("error in logToFile() when appending to log file", error)
      }

      stream.end()
    }
  } 
  catch(error){
    console.error("error in logToFile()", error)
  }
}

function logError(errorMessage, error){
  try {
    logWithLevel(LOG.msgTypes.error, [error, errorMessage])
  }
  catch(error) {
    console.error("error in logError", error)
    //logWithLevel(LOG.msgTypes.error, error, "error in logError")
  }
}

function logToConsole(level, ...messages) {
  try {
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];

      if(level === LOG.msgTypes.error) {
        if(defined(messages[0])) { // we expect the first element to be the error 
          if(messages.length === 1) { console.error("<EMPTY MESSAGE>>", messages[0]) }
          else if(i > 0) { console.error(messages[i], messages[0]) }
        }
        else if(i > 0) { console.error(messages[i]) }
      }
      else if(firstEqualsOneOfTheOthers(level, ...LOG.msgTypes.asList)){
        if(typeof console[level] === DATA.types.function) { console[level](message) }
        else { console.info(message) }
      }
      else { console.warn(message) }
    }
  }
  catch(error) {
    console.error("error in logToConsole.", error)
  }
}

function logWithLevel(level, ...messages){
  try {
    logToFile(level, ...messages)
    logToConsole(level, ...messages)
  }
  catch(error) {
    console.error("Error within Logging.logWithLevel()", error)
  } 
}

export const Logging = {
  logToFile: logToFile,
  logWithLevel: logWithLevel,
  error(error, ...messages){ logWithLevel(LOG.msgTypes.error, error, ...messages) },
  warn(...messages){ logWithLevel(LOG.msgTypes.warn, ...messages) },
  info(...messages){ logWithLevel(LOG.msgTypes.info, ...messages) },
  verbose(...messages){ logWithLevel(LOG.msgTypes.verbose, ...messages) },
  debug(...messages){ logWithLevel(LOG.msgTypes.debug, ...messages) },
  silly(...messages){ logWithLevel(LOG.msgTypes.silly, ...messages) },
  log(...messages){
    logWithLevel(LOG.msgTypes.info, ...messages)
  },
  LogSpacerLine(level = LOG.msgTypes.verbose){ logWithLevel(level, LOG.dividers.hashtagLine) },
  LogSectionStart(sectionHeader, level = LOG.msgTypes.verbose){
    logWithLevel(level, `${LOG.dividers.sectionStart}${defined(sectionHeader) ? `\n>>> ${sectionHeader} <<<\n` : ""}`)
  },
  LogSectionEnd(sectionHeader, level = LOG.msgTypes.verbose){
    logWithLevel(level, `${defined(sectionHeader) ? `\n>>> ${sectionHeader} <<<\n` : ""}${LOG.dividers.sectionStart}`)
  },
  logError: logError,
  logAndThrowError(errorMessage, error){
    logError(errorMessage, error)

    throw error
  }
}

export default Logging 