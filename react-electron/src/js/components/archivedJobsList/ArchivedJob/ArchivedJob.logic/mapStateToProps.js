import UpdateComponent from './updateComponent'
import defined from './../../../../utils/defined'
import { JOB_ARCHIVING_FINISHED } from './../../../../constants/action-types'
const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps){
  //^^//console.log("Inside ArchivedJobLogic mapStateToProps...")
  //^^//console.log("state.archivedJobs:")
  //^^//console.log(state.archivedJobs)

  let update = {}

  state.archivedJobs.forEach(job => {
    if(job.id === ownProps.ArchivedJobObject.id){
      if(defined(state.archivedJob)){
        //^^//console.log("state.action")
        //^^//console.log(state.action)
      }

      if(
        defined(state.action)
        && (state.action.type === JOB_ARCHIVING_FINISHED)
        && (job.id === state.action.payload.ArchivedJobObject.id)
      ){
        UpdateComponent(state)

        update.TriggerRender = uuidv4()
      }
      else {
        update.jobArchivingStatus = job.jobArchiver.jobArchivingStatus
      }
    }
  })

  return update
}

export default mapStateToProps