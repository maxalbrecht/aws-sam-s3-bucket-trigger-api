import ToggleJobDetailsLogic from './toggleJobDetailsLogic'
import { TOGGLE_JOB_DETAILS } from './../../../../constants/action-types'
import defined from '../../../../utils/defined'
import ClearStateAction from './../../../../utils/clearStateAction'
var store = window.store;

function UpdateComponent(state) {
  let toggleResult = ToggleJobDetailsLogic(state);

  if(state.action.type === TOGGLE_JOB_DETAILS && defined(state.action.payload)) {
    state.action.payload.JobDetailsIsOpen = toggleResult;
  }

  ClearStateAction(store);
}

export default UpdateComponent;