import defined from './../../../utils/defined'
import Mpeg1Converter from "./../../../classes/mpeg1Converter/mpeg1Converter"
import Logging from './../../../utils/logging'
import getConstructorState from './getConstructorState'

const uuidv4 = window.require("uuid/v4")

async function handleSubmit(event) {
  try {
    let date = new Date()
    if(!defined(event.preventDefault)) {
      event.preventDefault()
    }
    Logging.log("Inside MpegConversion handleSubmit()...")

    let storeState = window.store.getState()

    Logging.log("storeState: ", storeState)

    let errorPresent = this.ValidateMpeg1ConversionFields()
    
    if(errorPresent === false) {
      // CONVERT TO MPEG1
      if(defined(storeState.user)) {
        if(
          defined(this.state.sourceFiles, "columns.column-1.docIds")
          && this.state.sourceFiles.columns["column-1"].docIds.length > 0
        ) {
          storeState.user.resetLastTimeOfActivity()
          let currentVeriSuiteJobId = uuidv4()

          let mpeg1Converter = new Mpeg1Converter(
            this.state.jobNumber,
            this.state.sourceFiles,
            this.state.sourceFiles.columns["column-1"].docIds,
            storeState.user.assignedUserEmail,
            storeState.user.contactName,
            storeState.user.contactEmail,
            storeState.user.contactPhone,
            currentVeriSuiteJobId 
          )
          
          this.props.addMpeg1ConversionJob({
            id: currentVeriSuiteJobId,
            jobNumber: this.state.jobNumber,
            mpeg1Converter: mpeg1Converter, 
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
      Logging.log("Mpeg1Conversion.logic.handleSubmit errorPresent:", errorPresent)
    }
  } catch (error) {
    let e = null
    !error.message ? e = { "message": error } : e = error
    this.setState({
      errors: { ...this.state.errors }
    })

    Logging.LogError("Error Converting to MPEG1. error:", e)
  }
}

export default handleSubmit