import { LOG_OUT } from './../constants/action-types'
import { action } from './../utils/action'

async function LogOut(that) {
  let store = window.store;
  console.log("LogOut this:");
  console.log(this);
  
  let payload = { type: LOG_OUT, that: that }

  store.dispatch(action(LOG_OUT, payload))
}

export default LogOut;