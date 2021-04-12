import { Auth } from 'aws-amplify';
import { NEW_PASSWORD_REQUIRED, MFA_SETUP } from './../../../../constants/cognito_challenge_names'
import defined from '../../../../utils/defined';

async function handleSubmit(event) {
  event.preventDefault();
  //^^//console.log("Inside Log in handleSubmit()...")

  let newState = { ...this.state }
  newState.attemptingLogin = true;
  await this.setState(newState);

  let errorPresent = this.ValidateLoginFields();

  try {
    if (errorPresent === false && !defined(this.state.cognitoUser)) {
      const { username, password } = this.state;

      // SIGN OUT ANY USERS THAT MIGHT ALREADY BE SIGNED IN ON THIS MACHINE
      try{
        await Auth.signOut({ global: true })
      } catch(error) {
        //^^//console.log("Login handleSubmit() error signing out previous users. Error:")
        //^^//console.log(error)
      }
      
      // ATTEMPTING TO SIGN USER IN
      const cognitoUser = await Auth.signIn(username, password)

      // GO TO PASSWORD CHANGE IF REQUIRED BY COGNITO
      if(cognitoUser.challengeName === NEW_PASSWORD_REQUIRED) {
        this.props.history.push("/changepassword");
        return null;
      }

      // SET UP MFA IF REQUIRED BY COGNITO
      let cognitoTOTPCode = null;
      if(cognitoUser.challengeName === MFA_SETUP) {
        cognitoTOTPCode = await Auth.setupTOTP(cognitoUser); 
      }
      
      // SET STATE FOR THE LOGIN COMPONENT
      let newState = { ...this.state };
      newState.attemptingLogin = false;
      newState.cognitoUser = cognitoUser;
      newState.cognitoTOTPCode = cognitoTOTPCode;
      newState.errors = {
        cognito: null,
        blankfield: false
      }
      await this.setState(newState);
    }
  } catch (error) {
    let e = null;
    !error.message ? e = { "message" : error } : e = error;
    this.setState({
      errors: {
        ...this.state.errors,
        cognito: e
      }
    })

    //^^//console.log("Error logging in user. error:");
    //^^//console.log(e);
  }
}

export default handleSubmit;