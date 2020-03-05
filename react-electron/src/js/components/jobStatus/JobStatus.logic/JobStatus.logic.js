import handleChange from './handleChange'
import getConstructorState from './getConstructorState'
import onDragEnd from './onDragEnd'

function logicConstructor(props) {
  this.state = getConstructorState()

  // Bind imported logic functions
  this.handleChange = handleChange.bind(this)
  this.onDragEnd = onDragEnd.bind(this)
}

export {
  logicConstructor
}