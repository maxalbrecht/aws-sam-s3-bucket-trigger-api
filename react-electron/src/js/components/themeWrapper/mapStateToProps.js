import Logging from './../../utils/logging'
import defined from './../../utils/defined'
import ClearStateAction from './../../utils/clearStateAction'
import { TOGGLE_DARK_THEME } from './../../constants/action-types'
const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps) {
  Logging.info("Inside themewrapper mapStateToProps()...")

  let update = { ...state }
  
  if(defined(state, "action.type") && state.action.type === TOGGLE_DARK_THEME) {
    Logging.info("Inside themeWrapper mapStateToProps() and state.action.type === TOGGLE_DARK_THEME", "Toggling dark theme...")

    ClearStateAction(window.store);
    update.TriggerRender = uuidv4()
  }

  return update
}

export default mapStateToProps