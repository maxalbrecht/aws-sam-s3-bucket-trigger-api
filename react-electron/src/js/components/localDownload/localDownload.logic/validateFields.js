function ValidateFields() {
  let errorsPresent = true
  let newErrors = { ...(this.state.errors) }

  newErrors.blankField = this.CheckForEmptyFields()
  errorsPresent = (newErrors.blankField === true ? true : false) 


  this.setState((state, props) => ({
    errors: { ...newErrors }
  }))

  return errorsPresent
}

export default ValidateFields