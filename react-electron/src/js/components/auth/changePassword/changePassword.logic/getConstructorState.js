function getConstructorState() {
  console.log("Inside ChangePassword getConstructorState")

  return {
    username: "",
    currentPassword: "",
    password: "",
    passwordConfirm:"",
    errors: {
      cognito: null,
      blankfield: false,
      passwordmatch: true 
    },
    attemptingChangePassword: false
  }
}

export default getConstructorState;