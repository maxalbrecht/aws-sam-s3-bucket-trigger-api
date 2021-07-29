function BlankfieldErrorDisplay(blankField) {
  let errors = []

  if(blankField === true){
    errors.push("Required field is blank")
  }

  return errors
}

export default BlankfieldErrorDisplay