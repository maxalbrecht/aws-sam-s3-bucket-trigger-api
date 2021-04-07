import defined from './defined'
const electron_log = require('electron-log')

const HASHTAG_LINE = "############################################################"
const SECTION_START = "vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv"
const SECTION_END = "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
const error_const = "error"
const warn_const = "warn"
const info_const = "info"
const verbose_const = "verbose"
const debug_const = "debug"
const silly_const = "silly"

export const Logging = {
  error(...messages){
    this.logWithLevel(error_const, messages)
  },
  warn(...messages){
    this.logWithLevel(warn_const, messages)
  },
  info(...messages){
    this.logWithLevel(info_const, messages)
  },
  verbose(...messages){
    this.logWithLevel(verbose_const, messages)
  },
  debug(...messages){
    this.logWithLevel(debug_const, messages)
  },
  silly(...messages){
    this.logWithLevel(silly_const, messages)
  },
  logWithLevel(level, ...messages){
    messages.forEach(message => {
      //electron_log[level](message)
      console.log(message)
    })
  },
  log(...messages){
    messages.forEach(message => {
      // console.log(message)
      this.logWithLevel("info", messages)
    })
  },
  LogSpacerLine(){
    console.log(HASHTAG_LINE)
  },
  LogSectionStart(sectionHeader){
    console.log(SECTION_START)

    if(defined(sectionHeader)) {
      console.log(`>>> ${sectionHeader} <<<`)
    }
  },
  LogSectionEnd(sectionHeader){
    if(defined(sectionHeader)) {
      console.log(`>>> ${sectionHeader} <<<`)
    }

    console.log(SECTION_END)
  },
  LogError(errorMessage, error){
    console.log(`${errorMessage} Error: ${error}`)
  },
  LogAndThrowError(errorMessage, error){
    this.LogError(errorMessage, error)

    throw error
  }
}

export default Logging 