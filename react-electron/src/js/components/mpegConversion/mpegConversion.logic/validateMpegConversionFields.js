function ValidateMpegConversionFields() {
  let errorsPresent = true
  let newErrors = {
    ...this.state.errors
  }

  newErrors.blankField = this.CheckForEmptyFields()

  if(newErrors.blankField === true) {
    errorsPresent = true
  } else {
    errorsPresent = false
  }

  let newState = {
    ...this.state,
    errors: { ...newErrors }
  }

  this.setState(newState)

  return errorsPresent
}

export default ValidateMpegConversionFields