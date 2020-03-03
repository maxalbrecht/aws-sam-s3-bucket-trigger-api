import { action } from './../../../../utils/action'
import { TOGGLE_JOB_DETAILS } from './../../../../constants/action-types'
var store = window.store;

function handleToggleCollapse() {
  //this.JobDetailsIsOpen = !(this.JobDetailsIsOpen);

  store.dispatch(action(TOGGLE_JOB_DETAILS, this))
}

export default handleToggleCollapse