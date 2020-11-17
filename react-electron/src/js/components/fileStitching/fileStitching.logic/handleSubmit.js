import defined from './../../../utils/defined'
import FileStitcher from "./../../../classes/fileStitcher/fileStitcher"
import initialData from './../../dnd_list/initial-data'

const uuidv4 = window.require("uuid/v4")

async function handleSubmit(event) {
  try{
    let date = new Date()
    if(event.preventDefault !== undefined){
      event.preventDefault()
    }
    console.log("Inside File Stitching handleSubmit()...")

    let storeState = window.store.getState()

    console.log("storeState:")
    console.log(storeState)

    let errorPresent = this.ValidateFileStitchingFields()

    if(errorPresent === false) {
      const { jobNumber } = this.state

      //STITCH FILE
      //TODO: Implement
      if(defined(storeState.user)){
        storeState.user.resetLastTimeOfActivity()
        let currentFileId = uuidv4()

        console.log(this.state.destinationFileName)

        /*
        let fileStitcher = new FileStitcher({
          externalJobNumber:  this.state.jobNumber,
          fileList_raw: this.state.sourceFiles,
          fileOrder: this.state.sourceFiles.columns["column-1"].docIds,
          destinationFileName:this.state.destinationFileName,
          assignedUserEmail: storeState.user.assignedUserEmail,
          contactName: storeState.user.contactName,
          contactEmail:storeState.user.contactEmail,
          contactPhone: storeState.user.contactPhone,
          id: currentFileId
        })
        */

        let fileStitcher = new FileStitcher(
          this.state.jobNumber,
          this.state.sourceFiles,
          this.state.sourceFiles.columns["column-1"].docIds,
          this.state.destinationFileName,
          storeState.user.assignedUserEmail,
          storeState.user.contactName,
          storeState.user.contactEmail,
          storeState.user.contactPhone,
          currentFileId
        )

        this.props.addStitchedFile({
          id: currentFileId,
          jobNumber: this.state.jobNumber,
          fileStitcher: fileStitcher,
          date:date
        })

        this.setState(
          {
            jobNumber: "",
            destinationFileName: "",
            sourceFiles: initialData,
            user: this.state.user

          }
        )
      }
      else {
        alert("You are not logged in. Please log in and try again.")
      }

      //ADD STITCHED FILE TO LIST
      //TODO: Implement
    }
    else {
      console.log("File Stitching handleSubmit errorsPresent:")
      console.log(errorPresent)
    }
  } catch (error) {
    let e = null
    !error.message ? e = { "message": error } : e = error
    this.setState({
      errors:{
        ...this.state.errors
      }
    })

    console.log("Error Stitching File. error:")
    console.log(e)
  }
}

export default handleSubmit





