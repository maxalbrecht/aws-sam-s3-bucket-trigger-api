function getConstructorState() {
  console.log("inside register getConstructorState");
  
  return {
    username: "",
    email: "",
    password: "",
    passwordConfirm:"",
    errors: {
      cognito: null,
      blankfield: false,
      passwordmatch: true 
    },
    attemptingRegistration: false
  }
}

export default getConstructorState;