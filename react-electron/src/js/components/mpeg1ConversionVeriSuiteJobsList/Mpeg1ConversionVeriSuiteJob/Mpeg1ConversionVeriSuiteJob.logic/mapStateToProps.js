import UpdateComponent from './../../../../utils/updateComponent'
import defined from './../../../../utils/defined'
import firstEqualsOneOfTheOthers from './../../../../utils/first-equals-one-of-the-others'
import { TOGGLE_JOB_DETAILS, RECEIVED_MPEG1_CONVERSION_JOB_UPDATE, MPEG1_CONVERSION_THIRD_PARTY_JOB_CREATED } from './../../../../constants/action-types'
import Logging from './../../../../utils/logging'
const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps) {
  let update = {}

  if(defined(state, "mpeg1ConversionVeriSuiteJobs")) {
    state.mpeg1ConversionVeriSuiteJobs.forEach(mpeg1ConversionVeriSuiteJob => {
      if(mpeg1ConversionVeriSuiteJob.id === ownProps.Mpeg1ConversionVeriSuiteJobObject.id) {
        if(
          defined(state, "action.type", "action.payload")
          && (
            (
              firstEqualsOneOfTheOthers(state.action.type, MPEG1_CONVERSION_THIRD_PARTY_JOB_CREATED, RECEIVED_MPEG1_CONVERSION_JOB_UPDATE)                
              && defined(state.action.payload.veriSuiteJobId)
              && mpeg1ConversionVeriSuiteJob.id === state.action.payload.veriSuiteJobId
            ) 
            || (
              state.action.type === TOGGLE_JOB_DETAILS
              && defined(state.action.payload.Mpeg1ConversionVeriSuiteJobObject, "id")
              && mpeg1ConversionVeriSuiteJob.id === state.action.payload.Mpeg1ConversionVeriSuiteJobObject.id
            ) 
          )
        ) {
          UpdateComponent(state)

          update.TriggerRender = uuidv4()
        }
        else {
          update.mpeg1ConversionStatus = mpeg1ConversionVeriSuiteJob.mpeg1Converter.mpeg1ConversionStatus 
        }
      }
    })
  }

  return update
}

export default mapStateToProps