const HASHTAG_LINE = "############################################################"
const SECTION_START = "vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv"
const SECTION_END = "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"

export const Logging = {
  Log(message){
    console.log(message)
  },
  LogEach(...messages){
    messages.forEach(message => this.Log(message))
  },
  LogSpacerLine(){
    console.log(HASHTAG_LINE)
  },
  LogSectionStart(){
    console.log(SECTION_START)
  },
  LogSectionEnd(){
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