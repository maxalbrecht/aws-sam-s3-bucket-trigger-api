function CognitoErrorDisplay(cognitoError) {
  let errors = []
  if (cognitoError !== null) {
    errors.push(cognitoError.message)
  }

  return errors
}

export default CognitoErrorDisplay;