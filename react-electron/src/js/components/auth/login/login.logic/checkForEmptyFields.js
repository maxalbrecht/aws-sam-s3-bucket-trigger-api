import defined from './../../../../utils/defined'

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

  const { username, password, confirm } = this.state;

  if (
    Clean(username) !== ''
    && Clean(password) !== ''
    && (
      !defined(this.state.cognitoUser) 
      || Clean(confirm) !== ''
    )
  ) {
    areThereEmptyFields = false;
  }

  return areThereEmptyFields;
}

export default CheckForEmptyFields;