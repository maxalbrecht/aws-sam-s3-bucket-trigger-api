import handleClickBrowse from './handleClickBrowse'
import updatePriorityOptions from './updatePriorityOptions'
import handleSubmit from './handleSubmit.js'
import { onDragStart, onDragUpdate, onDragEnd } from './dndListFunctions'
import handleChange from './handleChange'
import mapDispatchToProps from './mapDispatchToProps'
import getConstructorState from './getConstructorState'

// Connect the App component's functions to the component itself
function logicConstructor(props) {
  this.state = getConstructorState();

  // Binding imported logic functions
  this.mapDispatchToProps = mapDispatchToProps.bind(this);
  this.handleClickBrowse = handleClickBrowse.bind(this);
  this.updatePriorityOptions = updatePriorityOptions.bind(this);
  this.handleChange = handleChange.bind(this);
  this.handleSubmit = handleSubmit.bind(this);
  this.onDragStart = onDragStart.bind(this);
  this.onDragUpdate = onDragUpdate.bind(this);
  this.onDragEnd = onDragEnd.bind(this);
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