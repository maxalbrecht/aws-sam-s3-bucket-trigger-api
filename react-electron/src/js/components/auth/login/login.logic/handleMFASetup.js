function handleMFASetup() {
  let newState = { ...this.state };
  newState.cognitoTOTPCode = null;
  this.setState(newState)
}

export default handleMFASetup;