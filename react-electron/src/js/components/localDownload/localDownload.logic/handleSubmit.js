import getConstructorState from './getConstructorState'
import LocalDownloader from '../../../classes/localDownloader/localDownloader'
import defined from './../../../utils/defined'
import Logging from './../../../utils/logging'

const uuidv4 = window.require("uuid/v4")

function handleSubmit(event) {
  event.preventDefault()
  event.stopPropagation()

  try {
    let date = new Date()

    if(!defined(event.preventDefault)) {
      event.preventDefault()
    }

    let storeState = window.store.getState()
    let errorPresent = this.ValidateFields()

    if(errorPresent === false) {
      if(defined(storeState.user)){
        if(defined(this.state, "sourceFile") && this.state.sourceFile.length > 0) {
          storeState.user.resetLastTimeOfActivity()
          let currentVeriSuiteJobId = uuidv4()

          Logging.log("localDownload.handleSubmit this.state", this.state, "storeState:", storeState)

          let localDownloader = new LocalDownloader(
            this.state.sourceFile,
            storeState.user.assignedUserEmail,
            storeState.user.contactName,
            storeState.user.contactEmail,
            storeState.user.contactPhone,
            currentVeriSuiteJobId
          )
          // addLocalDownloadJob()
          this.props.addLocalDownloadJob({
            id:currentVeriSuiteJobId,
            sourceFile: this.state.sourceFile,
            localDownloader: localDownloader,
            date: date
          })
          
          this.setState((state, props) => ({
            ...getConstructorState(),
            errors: state.errors
          }))
        } else {
          alert("No source file selected. Please select a source file and try again")
        }
      } else {
        alert("You are not logged in. Please log in and try again.")
      }
    } else {
      Logging.log("LocalDownload.logic.handleSubmit errorPresent:", errorPresent)
    }
  } catch(error) {
    let e = null
    !error.message? e = { "message": error } :e = error

    this.setState((state, props) => ({
      errors: { ...state.errors }
    }))

    Logging.logError("Error in LocalDownload.handleSubmit()...", e)
  }
}

export default handleSubmit