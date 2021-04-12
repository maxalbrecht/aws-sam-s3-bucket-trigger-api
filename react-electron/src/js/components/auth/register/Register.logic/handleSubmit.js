import { Auth } from 'aws-amplify';

var store = window.store;

async function handleSubmit(event) {
  event.preventDefault();
  //^^//console.log("Inside Register handleSubmit()...")

  let newState = { ...this.state }
  newState.attemptingRegistration = true;

  await this.setState(newState);
  
  let errorPresent = this.ValidateRegisterFields();

  try {
    if (errorPresent === false) {
      
      // Currently users are not allowed to sign themselves up.
      // The following code has been left here in case we want to
      // enable this later.
      /*
      const { username, email, password } = this.state;

      const signUpResponse = await Auth.signUp({
        username,
        password,
        attributes: {
          email: email
        }
      })    

      //^^//console.log("Register handleSubmit() signUpResponse:");
      //^^//console.log(signUpResponse);
      alert("Registration Result: " + JSON.stringify(signUpResponse));
      */

      let newState = { ...this.state };
      newState.attemptingRegistration = false;

      this.setState(newState);
    }
    else {
      //^^//console.log("Register handleSubmit errorsPresent:");
      //^^//console.log(errorPresent);
    }

  } catch (error) {
    //^^//console.log("Error registering user. error:");
    //^^//console.log(JSON.stringify(error));
    alert("There was an error during user registration. Please reach out to support with the following error: " + JSON.stringify(error));
  }

}

export default handleSubmit;