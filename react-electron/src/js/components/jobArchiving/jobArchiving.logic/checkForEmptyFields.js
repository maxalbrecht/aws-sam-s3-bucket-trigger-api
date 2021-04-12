function Clean(field) {
  if (
    field === undefined
    || field === null
  ) {
    return "";
  } else {
    return field.replace(/\s+/g, '');
  }
}

function CheckForEmptyFields() {
  let areThereEmptyFields = true;
  const { jobNumber, year, month } = this.state;

  if(
    Clean(jobNumber) !== ''
    && Clean(year) !== ''
    && Clean(month) !== ''
  ) {
    areThereEmptyFields = false;
  }

  return areThereEmptyFields;
}

export default CheckForEmptyFields;