function ValidateChangePasswordFields() {
  let errorsPresent = true;
  let newErrors = {
    ...this.state.errors
  }

  // CHECK EACH FIELD
  newErrors.blankfield = this.CheckForEmptyFields();
  newErrors.passwordmatch = this.CheckIfPasswordsMatch();
  if(newErrors.blankfield ===true
    || newErrors.passwordmatch === false
  ) {
    errorsPresent = true;
  }
  else {
    errorsPresent = false;
  }

  let  newState = {
    ...this.state,
    errors: {
      ...newErrors
    }
  }

  this.setState(newState);

  return errorsPresent;
}

export default ValidateChangePasswordFields;