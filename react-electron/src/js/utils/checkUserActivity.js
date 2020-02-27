import { action } from './action'
import { CHECK_USER_ACTIVITY } from './../constants/action-types'
import defined from './../utils/defined'
let store = window.store

let timeoutTimeInMinutes = 1
let timeoutTimeInMilliseconds = timeoutTimeInMinutes * 60 * 1000

function CheckUserActivity(that) {
  let payload = {
    type: CHECK_USER_ACTIVITY,
    that: that
  }

  setInterval(
    async function() { 
      const LOGIN = '/login'
      await store.dispatch(action(CHECK_USER_ACTIVITY, payload))
      let storeState = store.getState();
      if(
        !defined(storeState.user)
        && that.props.history.location.pathname !== LOGIN
      ) {
        that.props.history.push(LOGIN)
      }
    },
    timeoutTimeInMilliseconds
  )
}
export default CheckUserActivity;