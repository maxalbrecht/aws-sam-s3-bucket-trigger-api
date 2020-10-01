import defined from './../../../utils/defined'
import JobArchiver from "../../../classes/jobArchiver/jobArchiver"

const uuidv4 = window.require("uuid/v4")

async function handleSubmit(event) {
  let date = new Date()
  event.preventDefault();
  console.log("Inside Job Archiving handleSubmit()...")

  let storeState = window.store.getState()

  console.log(storeState)
  
  let errorPresent = this.ValidateJobArchivingFields();

  try {
    if(errorPresent === false) {
      const { jobNumber, year, month } = this.state;

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

        console.log("this.state:")
        console.log(this.state)

        this.setState({
          id: "",
          jobNumber: "",
          year: "",
          month: "",
          user: this.state.user
        })

      } 
      else {
        alert("You are not logged in. Please log in and try again.");
      }


      //ADD ARCHIVED JOB TO LIST
      //TODO: Implement
    }
    else {
      console.log("Job Archiving handleSubmit errorsPresent:");
      console.log(errorPresent);
    }
  
  } catch (error) {
    let e = null;
    !error.message ? e = { "message" : error } : e = error;
    this.setState({
      errors: {
        ...this.state.errors,
      }
    })

    console.log("Error Archiving Job. error:");
    console.log(e);
  }
}

export default handleSubmit;