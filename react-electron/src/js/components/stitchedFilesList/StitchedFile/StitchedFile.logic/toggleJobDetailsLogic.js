import defined from '../../../../utils/defined'
import { TOGGLE_JOB_DETAILS } from './../../../../constants/action-types'

function ToggleJobDetailsLogic(state) {
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
  
  return result; 
}

export default ToggleJobDetailsLogic;