import { CLEAR_STATE_ACTION } from './../constants/action-types'
import { action } from './action'

function ClearStateAction(store) {
  store.dispatch(action(CLEAR_STATE_ACTION, CLEAR_STATE_ACTION))
}

export default ClearStateAction;