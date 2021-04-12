import defined from './../../../utils/defined'
import Logging from './../../../utils/logging'
import JobArchiver from "../../../classes/jobArchiver/jobArchiver"
import getConstructorState from './getConstructorState'

const uuidv4 = window.require("uuid/v4")

async function handleSubmit(event) {
  let date = new Date()
  event.preventDefault();
  //^^//console.log("Inside Job Archiving handleSubmit()...")

  let storeState = window.store.getState()

  //^^//console.log(storeState)
  
  let errorPresent = this.ValidateJobArchivingFields();

  try {
    if(errorPresent === false) {

      // ARCHIVE JOB
      //TODO: Implement
      if(defined(storeState.user)){
        storeState.user.resetLastTimeOfActivity()
        let currentId = uuidv4()

        let jobArchiver = new JobArchiver({
          externalJobNumber: this.state.jobNumber,
          year: this.state.year,
          month: this.state.month,
          assignedUserEmail: storeState.user.assignedUserEmail,
          contactName: storeState.user.contactName,
          contactEmail: storeState.user.contactEmail,
          contactPhone: storeState.user.contactPhone,
          id: currentId
        })
        
        this.props.AddArchivedJob({
          id: currentId,
          jobNumber: this.state.jobNumber,
          jobArchiver: jobArchiver,
          date: date
        })
        
        this.setState((state, props) => ({
          ...getConstructorState(),
          errors: state.errors
        }))
      } 
      else {
        alert("You are not logged in. Please log in and try again.");
      }


      //ADD ARCHIVED JOB TO LIST
      //TODO: Implement
    }
    else {
      Logging.error(null, "Job Archiving handleSubmit errorsPresent:", errorPresent)
    }
  
  } catch (error) {
    let e = null;
    !error.message ? e = { "message" : error } : e = error;
    this.setState({
      errors: {
        ...this.state.errors,
      }
    })

    Logging.logError("Error Archiving Job:", e)

  }
}

export default handleSubmit;