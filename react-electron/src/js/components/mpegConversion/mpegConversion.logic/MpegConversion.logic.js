import getConstructorState from './getConstructorState'
import handleChange from './handleChange'
import handleSubmit from './handleSubmit'
import CheckForEmptyFields from './checkForEmptyFields'
import ValidateMpegConversionFields from './validateMpegConversionFields'
import handleClickBrowse from './handleClickBrowse'
import handleJobNumberPressEnterKey from './../../app/App.logic/handleJobNumberPressEnterKey'
import mapDispatchToProps from './mapDispatchToProps'
import { ADD_MPEG_CONVERSION_APP_TO_STORE } from './../../../constants/action-types'
import { action } from './../../../utils/action'
import RemoveDoc from './../../app/App.logic/removeDoc'
import { MPEG_CONVERSION_VIEW } from './../../../constants/view-names'

import { onDragStart, onDragUpdate, onDragEnd } from './../../app/App.logic/dndListFunctions'

function logicConstructor(props) {
  this.state = getConstructorState()
  this.viewName = MPEG_CONVERSION_VIEW

  let payload = {
    type: ADD_MPEG_CONVERSION_APP_TO_STORE,
    mpegConversionApp: this
  }

  window.store.dispatch(action(ADD_MPEG_CONVERSION_APP_TO_STORE, payload))

  //Binding imported logic functions
  this.handleChange = handleChange.bind(this)
  this.handleSubmit = handleSubmit.bind(this)
  this.handleClickBrowse = handleClickBrowse.bind(this)
  this.handleJobNumberPressEnterKey = handleJobNumberPressEnterKey.bind(this)
  this.CheckForEmptyFields = CheckForEmptyFields.bind(this)
  this.ValidateMpegConversionFields = ValidateMpegConversionFields.bind(this)
  this.mapDispatchToProps = mapDispatchToProps.bind(this)
  this.onDragStart = onDragStart.bind(this)
  this.onDragUpdate = onDragUpdate.bind(this)
  this.onDragEnd = onDragEnd.bind(this)
  this.RemoveDoc = RemoveDoc.bind(this)
}

export { mapDispatchToProps, logicConstructor }