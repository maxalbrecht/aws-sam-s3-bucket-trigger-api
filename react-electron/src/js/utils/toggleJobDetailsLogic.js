//import defined from '../../../../utils/defined'
import defined from './defined'
import { TOGGLE_JOB_DETAILS } from './../constants/action-types'
import Logging from './logging'

function ToggleJobDetailsLogic(state) {
  Logging.LogSectionStart("Inside utils.ToggleJobDetailsLogic()...")
  Logging.log("state parameter:", state, "state.action.payload.JobDetailsIsOpen:", state.action.payload.JobDetailsIsOpen)
  var result = false;

  if(defined(state.action.payload.JobDetailsIsOpen) && state.action.type === TOGGLE_JOB_DETAILS) {
    result = !(state.action.payload.JobDetailsIsOpen);
  }
  else if (defined(state.action.payload.JobDetailsIsOpen)) {
    result = state.action.payload.JobDetailsIsOpen;
  }
  else {
    result = false;
  }
  
  Logging.log("result:", result)
  Logging.LogSectionEnd()

  return result; 
}

export default ToggleJobDetailsLogic;