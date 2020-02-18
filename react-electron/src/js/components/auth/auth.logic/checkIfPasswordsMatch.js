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

function CheckIfPasswordsMatch() {
  let doPasswordsMatch = true;

  // If one of the password fields is empty we return true, since
  // we are already checking for empty fields
  if(Clean(this.state.password) === ''
    || Clean(this.state.passwordConfirm) === ''
  ) {
    doPasswordsMatch = true;
  } else if(this.state.password !== this.state.passwordConfirm) {
    doPasswordsMatch = false;
  }
  
  return doPasswordsMatch;
}

export default CheckIfPasswordsMatch;