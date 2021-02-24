import { ADD_SYNC_APP_TO_STORE } from './../../../constants/action-types'
import { action } from './../../../utils/action'
import handleClickBrowse from './handleClickBrowse'
import updatePriorityOptions from './updatePriorityOptions'
import handleSubmit from './handleSubmit.js'
import { onDragStart, onDragUpdate, onDragEnd } from './dndListFunctions'
import handleChange from './handleChange'
import mapDispatchToProps from './mapDispatchToProps'
import getConstructorState from './getConstructorState'
import handleJobNumberPressEnterKey from './handleJobNumberPressEnterKey'
import RemoveDoc from './removeDoc'
import { SYNC_VIEW } from './../../../constants/view-names'

// Connect the App component's functions to the component itself
function logicConstructor(props) {
  this.state = getConstructorState();
  this.viewName = SYNC_VIEW;

  let payload = {
    type: ADD_SYNC_APP_TO_STORE,
    syncApp: this
  }

  window.store.dispatch(action(ADD_SYNC_APP_TO_STORE, payload))

  console.log(" App logicConstructor window.store.getState()");
  console.log(window.store.getState());


  // Binding imported logic functions
  this.mapDispatchToProps = mapDispatchToProps.bind(this);
  this.handleClickBrowse = handleClickBrowse.bind(this);
  this.handleJobNumberPressEnterKey = handleJobNumberPressEnterKey.bind(this);
  this.updatePriorityOptions = updatePriorityOptions.bind(this);
  this.handleChange = handleChange.bind(this);
  this.handleSubmit = handleSubmit.bind(this);
  this.onDragStart = onDragStart.bind(this);
  this.onDragUpdate = onDragUpdate.bind(this);
  this.onDragEnd = onDragEnd.bind(this);
  this.RemoveDoc = RemoveDoc.bind(this);
}

export {
  mapDispatchToProps,
  handleClickBrowse,
  updatePriorityOptions,
  handleChange,
  handleSubmit,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  getConstructorState,
  logicConstructor
}