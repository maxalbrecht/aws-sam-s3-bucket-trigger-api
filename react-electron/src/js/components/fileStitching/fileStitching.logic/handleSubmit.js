import defined from './../../../utils/defined'
import FileStitcher from "./../../../classes/fileStitcher/fileStitcher"

const uuidv4 = window.require("uuid/v4")

async function handleSubmit(event) {
  let date = new Date()
  event.preventDefault()

  console.log("Inside File Stitching handleSubmit()...")

  let storeState = window.store.getState()

  console.log("storeState:")
  console.log(storeState)

  let errorPresent = this.ValidateFileStitchingFields()

  try{
    if(errorPresent === false) {
      const { jobNumber } = this.state

      //STITCH FILE
      //TODO: Implement
      if(defined(storeState.user)){
        storeState.user.resetLastTimeOfActivity()
        let currentId = uuidv4()

        let fileStitcher = new FileStitcher({
          externalJobNumber:  this.state.jobNumber,
          assignedUserEmail: storeState.uer.assignedUserEmail,
          contactName: storeState.user.contactName,
          contactEmail:storeState.user.contactEmail,
          contactPhone: storeState.user.contactPhone,
          id: currentId
        })

        this.props.AddStitchedFile({
          id: currentId,
          jobNumber: this.state.jobNumber,
          fileStitcher: fileStitcher,
          date:date
        })
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





