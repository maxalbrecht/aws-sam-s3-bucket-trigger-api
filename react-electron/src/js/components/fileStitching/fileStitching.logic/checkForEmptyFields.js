import defined from './../../../utils/defined'

function Clean(field) {
  if(
    field === undefined
    || field === null
  ) {
    return ""
  } else {
    return field.replace(/\s+/g, '');
  }
}

function CheckForEmptyFields() {
  let areThereEmptyFields = true
  const { jobNumber } = this.state

  if(defined(jobNumber) && Clean(jobNumber) !== '') {
    areThereEmptyFields = false
  }

  return areThereEmptyFields
}

export default CheckForEmptyFields