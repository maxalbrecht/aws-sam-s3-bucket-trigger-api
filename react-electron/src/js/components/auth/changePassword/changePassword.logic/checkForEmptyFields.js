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

  const { username, currentPassword, password, passwordConfirm } = this.state;
  if (
    Clean(username) !== ''
    && Clean(currentPassword) !== ''
    && Clean(password) !== ''
    && Clean(passwordConfirm) !== ''
  ) {
    areThereEmptyFields = false;
  }

  return areThereEmptyFields;
}

export default CheckForEmptyFields;