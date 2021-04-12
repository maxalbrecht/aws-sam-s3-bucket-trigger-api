import Username from '../../auth.fields/username'
import Email from './email'
import Password from '../../auth.fields/password'
import PasswordConfirm from './../../auth.fields/passwordConfirm'
import RegisterButton from './registerButton'
import FormErrors from './../../auth.fields/formErrors'

function fieldBind() {
  //^^//console.log("inside register fieldBind()...")
  this.Username = Username.bind(this);
  this.Email = Email.bind(this);
  this.Password = Password.bind(this);
  this.PasswordConfirm = PasswordConfirm.bind(this);
  this.RegisterButton = RegisterButton.bind(this);
  this.FormErrors = FormErrors.bind(this);
}

export default fieldBind;