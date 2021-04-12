import UpdateComponent from './../../../../utils/updateComponent'
import defined from './../../../../utils/defined'
import firstEqualsOneOfTheOthers from './../../../../utils/first-equals-one-of-the-others'
import { TOGGLE_JOB_DETAILS, RECEIVED_MPEG_CONVERSION_JOB_UPDATE, MPEG_CONVERSION_THIRD_PARTY_JOB_CREATED } from './../../../../constants/action-types'
const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps) {
  let update = {}

  if(defined(state, "mpegConversionVeriSuiteJobs")) {
    state.mpegConversionVeriSuiteJobs.forEach(mpegConversionVeriSuiteJob => {
      if(mpegConversionVeriSuiteJob.id === ownProps.MpegConversionVeriSuiteJobObject.id) {
        if(
          defined(state, "action.type", "action.payload")
          && (
            (
              firstEqualsOneOfTheOthers(state.action.type, MPEG_CONVERSION_THIRD_PARTY_JOB_CREATED, RECEIVED_MPEG_CONVERSION_JOB_UPDATE)                
              && defined(state.action.payload.veriSuiteJobId)
              && mpegConversionVeriSuiteJob.id === state.action.payload.veriSuiteJobId
            ) 
            || (
              state.action.type === TOGGLE_JOB_DETAILS
              && defined(state.action.payload.MpegConversionVeriSuiteJobObject, "id")
              && mpegConversionVeriSuiteJob.id === state.action.payload.MpegConversionVeriSuiteJobObject.id
            ) 
          )
        ) {
          UpdateComponent(state)

          update.TriggerRender = uuidv4()
        }
        else {
          update.mpegConversionStatus = mpegConversionVeriSuiteJob.mpegConverter.mpegConversionStatus 
        }
      }
    })
  }

  return update
}

export default mapStateToProps