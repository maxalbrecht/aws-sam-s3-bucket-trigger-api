import { TOGGLE_DARK_THEME } from './../constants/action-types'
import { action } from './../utils/action'

function ToggleDarkTheme(that) {
  let store = window.store;
  let payload = { type: TOGGLE_DARK_THEME, that: that }

  store.dispatch(action(TOGGLE_DARK_THEME, payload))
}

export default ToggleDarkTheme