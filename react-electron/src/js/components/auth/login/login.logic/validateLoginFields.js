function ValidateLoginFields() {
  let errorsPresent = true;
  let newErrors = {
    ...this.state.errors
  }

  newErrors.blankfield = this.CheckForEmptyFields();

  if(newErrors.blankfield === true) {
    errorsPresent = true;
  }
  else {
    errorsPresent = false;
  }

  let newState = {
    ...this.state,
    errors: {
      ...newErrors
    }
  }

  this.setState(newState);

  return errorsPresent;
}

export default ValidateLoginFields;