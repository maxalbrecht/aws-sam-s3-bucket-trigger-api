function getConstructorState() {
  return {
    username: "",
    password: "",
    errors: {
      cognito: null,
      blankfield: false
    },
    attemptingLogin: false,
    attemptingConfirm: false,
    cognitoUser: null,
    cognitoTOTPCode: null,
    confirm: null
  }
}

export default getConstructorState;