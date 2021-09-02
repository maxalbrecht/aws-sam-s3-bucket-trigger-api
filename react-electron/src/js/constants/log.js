import STRING_CONSTANTS from './string'
import loggingSettingsDefault from './logging-settings-default'
import defined from './../utils/defined'
import File from './../utils/file'

let msgTypes = {
  error: "error",
  warn: "warn",
  info: "info",
  verbose: "verbose",
  debug: "debug",
  silly: "silly"
}
msgTypes.asList = Object.values(msgTypes)


let loggingSettingsFile = `${STRING_CONSTANTS.USER_DATA_FOLDER}\\logging\\loggingSettings.json`
File.makeFileIfItDoesNotExist(loggingSettingsFile, JSON.stringify(loggingSettingsDefault).replace(/{/g, "{\n\t").replace(/,/g, ",\n\t").replace(/}/g, "\n}"))
let settings = JSON.parse(File.getContent(loggingSettingsFile))

console.log(`${
  (defined(settings, "logToFile") && !settings.logToFile) ? "LOG.settings.logToFile === false. Will NOT log to file" : "Will log to file"
}`)

const LOG = {
  settings,
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
    includeStackTrace: true,
    maxFileCount: 75
  },
  msgTypes: { ...msgTypes },
  dividers: {
    hashtagLine: "############################################################",
    sectionStart: "vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",
    sectionEnd: "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
  }
}

export default LOG