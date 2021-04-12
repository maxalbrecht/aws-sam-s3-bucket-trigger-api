import defined from './../../../utils/defined'
import Logging from './../../../utils/logging'
import FileStitcher from "./../../../classes/fileStitcher/fileStitcher"
import getConstructorState from './getConstructorState'
const uuidv4 = window.require("uuid/v4")

var convertToMpeg = true

async function handleSubmit(event) {
  try {
    Logging.info("Inside File Stitching handleSubmit()...")

    if(defined(event.preventDefault)) { event.preventDefault() }

    let date = new Date()
    let storeState = window.store.getState()
    let errorPresent = this.ValidateFileStitchingFields()

    if(!errorPresent) {
      if(defined(storeState.user)){
        Logging.info("this.state.audioAdjustment:", this.state.audioAdjustment, "this.state.destinationFileName", this.state.destinationFileName)

        storeState.user.resetLastTimeOfActivity()
        let currentFileId = uuidv4()

        let fileStitcher = new FileStitcher(
          this.state.jobNumber,
          this.state.sourceFiles,
          this.state.sourceFiles.columns["column-1"].docIds,
          this.state.audioAdjustment,
          this.state.destinationFileName,
          storeState.user.assignedUserEmail,
          storeState.user.contactName,
          storeState.user.contactEmail,
          storeState.user.contactPhone,
          currentFileId,
          convertToMpeg
        )

        this.props.addStitchedFile({
          id: currentFileId,
          jobNumber: this.state.jobNumber,
          fileStitcher: fileStitcher,
          date: date
        })

        this.setState((state, props) => ({
          ...getConstructorState(),
          errors: state.errors
        }))
      }
      else {
        alert("You are not logged in. Please log in and try again.")
      }
    }
    else {
      Logging.error(null, "File Stitching handleSubmit errorsPresent:", errorPresent)
    }
  } 
  catch (error) {
    let e = null
    !error.message ? e = { "message": error } : e = error
    this.setState({
      errors:{ ...this.state.errors }
    })

    Logging.logError("Error Stitching File. error:", e)
  }
}

export default handleSubmit





