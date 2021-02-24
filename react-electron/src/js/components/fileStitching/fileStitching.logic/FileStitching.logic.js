import getConstructorState from './getConstructorState'
import handleChange from './handleChange'
import handleSubmit from './handleSubmit'
import CheckForEmptyFields from './checkForEmptyFields'
import ValidateFileStitchingFields from './validateFileStitchingFields'
import handleClickBrowse from './handleClickBrowse'
import handleJobNumberPressEnterKey from './../../app/App.logic/handleJobNumberPressEnterKey'
import handleDestinationFileNamePressEnterKey from './handleDestinationFileNamePressEnterKey'
import mapDispatchToProps from './mapDispatchToProps'
import { ADD_STITCH_APP_TO_STORE } from '../../../constants/action-types'
import { action } from './../../../utils/action'
import RemoveDoc from './../../app/App.logic/removeDoc'
import { STITCH_VIEW } from '../../../constants/view-names'

import { onDragStart, onDragUpdate, onDragEnd } from './../../../components/app/App.logic/dndListFunctions'

function logicConstructor(props){
  this.state = getConstructorState();
  this.viewName = STITCH_VIEW

  let payload = {
    type: ADD_STITCH_APP_TO_STORE,
    stitchApp: this
  }

  window.store.dispatch(action(ADD_STITCH_APP_TO_STORE, payload))

  // Binding imported logic functions
  this.state = getConstructorState()
  this.handleChange = handleChange.bind(this)
  this.handleSubmit = handleSubmit.bind(this)
  this.handleClickBrowse = handleClickBrowse.bind(this)
  this.handleJobNumberPressEnterKey = handleJobNumberPressEnterKey.bind(this)
  this.handleDestinationFileNamePressEnterKey = handleDestinationFileNamePressEnterKey.bind(this)
  this.CheckForEmptyFields = CheckForEmptyFields.bind(this)
  this.ValidateFileStitchingFields = ValidateFileStitchingFields.bind(this)
  this.mapDispatchToProps = mapDispatchToProps.bind(this)
  this.onDragStart = onDragStart.bind(this)
  this.onDragUpdate = onDragUpdate.bind(this)
  this.onDragEnd = onDragEnd.bind(this)
  this.RemoveDoc = RemoveDoc.bind(this)
}

export { mapDispatchToProps, logicConstructor }