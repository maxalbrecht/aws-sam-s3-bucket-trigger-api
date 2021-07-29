import defined from './../../../utils/defined'

function Clean(field) { 
  if(!defined(field)) {
    return ""
  } else {
    return field.replace(/\s+/g, '');
  }
}

function CheckForEmptyFields() {
  let areThereEmptyFields = true
  const { sourceFile } = this.state

  if(Clean(sourceFile) !== '') {
    areThereEmptyFields = false
  }

  return areThereEmptyFields
}

export default CheckForEmptyFields

