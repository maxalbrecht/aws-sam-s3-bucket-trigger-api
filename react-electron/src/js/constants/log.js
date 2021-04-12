import STRING_CONSTANTS from './string'

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