import defined from './../../../utils/defined'
import MpegConverter from "./../../../classes/mpegConverter/mpegConverter"
import Logging from './../../../utils/logging'
import getConstructorState from './getConstructorState'

const uuidv4 = window.require("uuid/v4")

function handleSubmit(event) {
  event.preventDefault()
  event.stopPropagation()
  Logging.debug("--- INSIDE MPEGCONVERSION.LOGIC.HANDLESUBMIT() ---")

  try {
    let date = new Date()
    if(!defined(event.preventDefault)) {
      event.preventDefault()
    }
    Logging.log("Inside MpegConversion handleSubmit()...")

    let storeState = window.store.getState()

    let errorPresent = this.ValidateMpegConversionFields()
    
    if(errorPresent === false) {
      // CONVERT TO MPEG
      if(defined(storeState.user)) {
        if(
          defined(this.state.sourceFiles, "columns.column-1.docIds")
          && this.state.sourceFiles.columns["column-1"].docIds.length > 0
        ) {
          storeState.user.resetLastTimeOfActivity()
          let currentVeriSuiteJobId = uuidv4()

          let mpegConverter = new MpegConverter(
            this.state.jobNumber,
            this.state.sourceFiles,
            this.state.sourceFiles.columns["column-1"].docIds,
            storeState.user.assignedUserEmail,
            storeState.user.contactName,
            storeState.user.contactEmail,
            storeState.user.contactPhone,
            currentVeriSuiteJobId 
          )
          
          this.props.addMpegConversionJob({
            id: currentVeriSuiteJobId,
            jobNumber: this.state.jobNumber,
            mpegConverter: mpegConverter, 
            date: date
          })

          this.setState((state, props) => ({
            ...getConstructorState(),
            errors: state.errors
          }))
        }
        else {
          alert("No source files selected. Please select at least one source file and try again.")
        }
      }
      else {
        alert("You are not logged in. Please log in and try again.")
      }
    }
    else {
      Logging.log("MpegConversion.logic.handleSubmit errorPresent:", errorPresent)
    }
  } catch (error) {
    let e = null
    !error.message ? e = { "message": error } : e = error
    this.setState({
      errors: { ...this.state.errors }
    })

    Logging.logError("Error Converting to MPEG. error:", e)
  }
  
}

export default handleSubmit