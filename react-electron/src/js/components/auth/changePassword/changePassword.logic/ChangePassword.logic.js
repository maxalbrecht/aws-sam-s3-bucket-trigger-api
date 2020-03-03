import getConstructorState from './getConstructorState'
import handleChange from './handleChange'
import handleSubmit from './handleSubmit'
import CheckForEmptyFields from './checkForEmptyFields'
import CheckIfPasswordsMatch from './../../auth.logic/checkIfPasswordsMatch'
import ValidateChangePasswordFields from './validateChangePasswordFields'

function logicConstructor(props) {
  this.state = getConstructorState();
  this.handleChange = handleChange.bind(this);
  this.handleSubmit = handleSubmit.bind(this);
  this.CheckForEmptyFields = CheckForEmptyFields.bind(this);
  this.CheckIfPasswordsMatch = CheckIfPasswordsMatch.bind(this);
  this.ValidateChangePasswordFields = ValidateChangePasswordFields.bind(this);
}

export { logicConstructor };