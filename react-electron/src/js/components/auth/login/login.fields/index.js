import FormErrors from './../../auth.fields/formErrors'
import Username from '../../auth.fields/username'
import Password from '../../auth.fields/password'
import LoginButton from './loginButton'
import Confirm from './confirm'
import ConfirmButton from './confirmButton'
import MFASetup from './mfaSetup'

function fieldBind() {
  console.log("inside register fieldBind()...")
  this.Username = Username.bind(this);
  this.Password = Password.bind(this);
  this.LoginButton= LoginButton.bind(this);
  this.FormErrors = FormErrors.bind(this);
  this.Confirm = Confirm.bind(this);
  this.ConfirmButton = ConfirmButton.bind(this);
  this.MFASetup = MFASetup.bind(this);
}

export default fieldBind;