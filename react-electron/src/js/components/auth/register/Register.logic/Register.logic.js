import getConstructorState from './getConstructorState'
import handleChange from './handleChange'
import handleSubmit from './handleSubmit'
import CheckForEmptyFields from './checkForEmptyFields'
import CheckIfPasswordsMatch from '../../auth.logic/checkIfPasswordsMatch'
import ValidateRegisterFields from './validateRegisterFields'

function logicConstructor(props) {
  this.state = getConstructorState();
  this.handleChange = handleChange.bind(this);
  this.handleSubmit = handleSubmit.bind(this);
  this.CheckForEmptyFields = CheckForEmptyFields.bind(this);
  this.CheckIfPasswordsMatch = CheckIfPasswordsMatch.bind(this);
  this.ValidateRegisterFields = ValidateRegisterFields.bind(this);
}

export { logicConstructor };