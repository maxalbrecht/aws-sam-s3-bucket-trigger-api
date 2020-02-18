function BlankfieldErrorDisplay(blankfield) {
  let errors = []

  if(blankfield === true) {
    errors.push("Required field is blank")
  }

  return errors
}

export default BlankfieldErrorDisplay;