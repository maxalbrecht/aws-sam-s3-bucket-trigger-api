import getConstructorState from './getConstructorState'
import handleChange from './handleChange'
import handleSubmit from './handleSubmit'
import CheckForEmptyFields from './checkForEmptyFields'
import ValidateLoginFields from './validateLoginFields'
import handleConfirm from './handleConfirm'
import handleMFASetup from './handleMFASetup'

function logicConstructor(props) {
  this.state = getConstructorState();
  this.handleChange = handleChange.bind(this);
  this.handleSubmit = handleSubmit.bind(this);
  this.handleMFASetup = handleMFASetup.bind(this);
  this.handleConfirm = handleConfirm.bind(this);
  this.CheckForEmptyFields = CheckForEmptyFields.bind(this);
  this.ValidateLoginFields = ValidateLoginFields.bind(this);
}

export { logicConstructor };