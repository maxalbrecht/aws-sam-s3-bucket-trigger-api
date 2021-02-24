import UpdateComponent from './updateComponent'
import defined from './../../../../utils/defined'
import { FILE_STITCHING_QUEUED, TOGGLE_JOB_DETAILS } from './../../../../constants/action-types'
import Logging from './../../../../utils/logging'

const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps){
  Logging.LogSectionStart()
  Logging.Log("Inside StitchedFile Logic mapStateToProps...")
  Logging.LogEach("state.stitchedFiles:", state.stitchedFiles)
  Logging.LogEach("ownProps: ", ownProps)

  let update = {}

  state.stitchedFiles.forEach(file => {
    if(file.id === ownProps.StitchedFileObject.id){
      Logging.Log("We have found the states.stitchedFiles record that matches the current StitchedFile object.")
      
      if(defined(state.action)){
        Logging.LogEach("state.action", state.action)
      } else {
        Logging.Log("state.action is undefined")
      }

      if(
        defined(state.action)
        && (
          state.action.type === FILE_STITCHING_QUEUED
          || state.action.type === TOGGLE_JOB_DETAILS
        )
        && (file.id === state.action.payload.StitchedFileObject.id)
      ){
        UpdateComponent(state)

        update.TriggerRender = uuidv4()
      }
      else {
        Logging.Log("Setting update.fileStitchingStatus equal to file.fileStitcher.fileStitchingStatus")
        Logging.LogEach("current file:", file)
        update.fileStitchingStatus = file.fileStitcher.fileStitchingStatus
      }
    }
  })

  Logging.LogSectionEnd()

  return update
}

export default mapStateToProps
