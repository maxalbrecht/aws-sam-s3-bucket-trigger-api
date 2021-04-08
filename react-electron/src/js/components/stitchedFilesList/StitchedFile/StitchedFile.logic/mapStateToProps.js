import UpdateComponent from './updateComponent'
import defined from './../../../../utils/defined'
import { FILE_STITCHING_QUEUED, TOGGLE_JOB_DETAILS, RECEIVED_MPEG1_CONVERSION_JOB_UPDATE, MPEG1_CONVERSION_THIRD_PARTY_JOB_CREATED } from './../../../../constants/action-types'
import Logging from './../../../../utils/logging'
import firstEqualsOneOfTheOthers from './../../../../utils/first-equals-one-of-the-others'

const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps){
  Logging.LogSectionStart("Inside StitchedFile Logic mapStateToProps...")
  Logging.log("state:", state, "ownProps: ", ownProps)

  let update = {}

  state.stitchedFiles.forEach(file => {
    if(file.id === ownProps.StitchedFileObject.id){
      Logging.log("We have found the states.stitchedFiles record that matches the current StitchedFile object.")

      if(
        defined(state, "action.type", "action.payload")
        && (
          (
            firstEqualsOneOfTheOthers(state.action.type, FILE_STITCHING_QUEUED, TOGGLE_JOB_DETAILS)
            && defined(state.action.payload, "StitchedFileObject.id")
            && file.id === state.action.payload.StitchedFileObject.id
          )
          || (
            firstEqualsOneOfTheOthers(state.action.type, MPEG1_CONVERSION_THIRD_PARTY_JOB_CREATED, RECEIVED_MPEG1_CONVERSION_JOB_UPDATE)                
            && defined(state.action.payload.veriSuiteJobId)
            && file.id === state.action.payload.veriSuiteJobId
          )
        )
      ){
        UpdateComponent(state)

        update.TriggerRender = uuidv4()
      }
      else {
        Logging.log("Setting update.fileStitchingStatus equal to file.fileStitcher.fileStitchingStatus", "current file:", file)
        update.fileStitchingStatus = file.fileStitcher.fileStitchingStatus
      }
    }
  })

  Logging.LogSectionEnd()

  return update
}

export default mapStateToProps
