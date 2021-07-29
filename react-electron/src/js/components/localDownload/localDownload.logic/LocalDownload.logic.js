import getConstructorState from './getConstructorState'
import handleSubmit from './handleSubmit'
import CheckForEmptyFields from './checkForEmptyFields'
import ValidateFields from './validateFields'
import handleClickBrowse from './handleClickBrowse'
import mapDispatchToProps from './mapDispatchToProps'
import { ADD_LOCAL_DOWNLOAD_APP_TO_STORE } from '../../../constants/action-types'
import { action } from './../../../utils/action'
import { LOCAL_DOWNLOAD_VIEW } from '../../../constants/view-names'

function logicConstructor(props) {
  this.state = (getConstructorState())
  this.viewName = LOCAL_DOWNLOAD_VIEW

  let payload = {
    type: ADD_LOCAL_DOWNLOAD_APP_TO_STORE,
    localDownloadApp: this
  }

  window.store.dispatch(action(ADD_LOCAL_DOWNLOAD_APP_TO_STORE, payload))

  this.handleSubmit = handleSubmit.bind(this)
  this.handleClickBrowse = handleClickBrowse.bind(this)
  this.CheckForEmptyFields = CheckForEmptyFields.bind(this)
  this.ValidateFields = ValidateFields.bind(this)
}

export { mapDispatchToProps, logicConstructor }