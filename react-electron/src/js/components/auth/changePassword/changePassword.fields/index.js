
import Username from './../../auth.fields/username'
import CurrentPassword from './currentPassword'
import Password from './../../auth.fields/password'
import PasswordConfirm from './../../auth.fields/passwordConfirm'
import ChangePasswordButton from './changePasswordButton'
import FormErrors from './../../auth.fields/formErrors'

function fieldBind() {
  console.log("inside ChangePassword fieldBind()...");
  this.Username = Username.bind(this);
  this.CurrentPassword = CurrentPassword.bind(this);
  this.Password = Password.bind(this);
  this.PasswordConfirm = PasswordConfirm.bind(this);
  this.ChangePasswordButton = ChangePasswordButton.bind(this);
  this.FormErrors = FormErrors.bind(this);
}

export default fieldBind;