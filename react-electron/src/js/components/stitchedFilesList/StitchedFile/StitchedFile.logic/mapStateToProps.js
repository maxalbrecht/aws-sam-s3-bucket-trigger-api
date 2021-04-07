import UpdateComponent from './updateComponent'
import defined from './../../../../utils/defined'
import { FILE_STITCHING_QUEUED, TOGGLE_JOB_DETAILS } from './../../../../constants/action-types'
import Logging from './../../../../utils/logging'

const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps){
  Logging.LogSectionStart()
  Logging.log("Inside StitchedFile Logic mapStateToProps...")
  Logging.log("state.stitchedFiles:", state.stitchedFiles)
  Logging.log("ownProps: ", ownProps)

  let update = {}

  state.stitchedFiles.forEach(file => {
    if(file.id === ownProps.StitchedFileObject.id){
      Logging.log("We have found the states.stitchedFiles record that matches the current StitchedFile object.")
      
      if(defined(state.action)){
        Logging.log("state.action", state.action)
      } else {
        Logging.log("state.action is undefined")
      }

      if(
        defined(state.action)
        && (
          state.action.type === FILE_STITCHING_QUEUED
          || state.action.type === TOGGLE_JOB_DETAILS
        )
        && (
          defined(state.action.payload)
          && defined(state.action.payload.StitchedFileObject)
          && defined(state.action.payload.StitchedFileObject.id)
          && file.id === state.action.payload.StitchedFileObject.id
          )
      ){
        UpdateComponent(state)

        update.TriggerRender = uuidv4()
      }
      else {
        Logging.log("Setting update.fileStitchingStatus equal to file.fileStitcher.fileStitchingStatus")
        Logging.log("current file:", file)
        update.fileStitchingStatus = file.fileStitcher.fileStitchingStatus
      }
    }
  })

  Logging.LogSectionEnd()

  return update
}

export default mapStateToProps
