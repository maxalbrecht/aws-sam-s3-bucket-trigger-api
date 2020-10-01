import { Auth } from 'aws-amplify'
import { MFA_SETUP, SOFTWARE_TOKEN_MFA } from './../../../../constants/cognito_challenge_names'
import User from './../../../../classes/user/user'
import { action } from './../../../../utils/action'
import { USER_LOGGED_IN } from './../../../../constants/action-types'
import defined from './../../../../utils/defined'
var store = window.store;

async function handleConfirm(event) {
  event.preventDefault();
  console.log("Inside Login handleConfirm()...")

  let newState = { ...this.state }
  newState.attemptingConfirm = true;
  await this.setState(newState);

  let errorPresent = this.ValidateLoginFields();

  try{
    if (errorPresent === false && defined(this.state.cognitoUser)) {
      const { cognitoUser, confirm } = this.state;

      //// ALLOW USERS WHO ARE SETTING UP MFA FOR THE FIRST TIME TO DO SO AND LOG IN 
      if(defined(cognitoUser) && cognitoUser.challengeName === MFA_SETUP) {
        //CONFIRM TOKEN
        await Auth.verifyTotpToken(cognitoUser, confirm)

        // SET PREFERRED MFA
        await Auth.setPreferredMFA(await Auth.currentAuthenticatedUser(), 'TOTP')
      }
      //// ALLOW USERS THAT ARE ALREADY SET UP WITH MFA TO LOG IN
      else if(defined(cognitoUser) && cognitoUser.challengeName === SOFTWARE_TOKEN_MFA) {
        await Auth.confirmSignIn(cognitoUser, confirm, SOFTWARE_TOKEN_MFA);
      }

      // SET STATE FOR THE LOGIN COMPONENT
      let newState = { ...this.state };
      newState.attemptingConfirm = true
      newState.cognitoUser = await Auth.currentAuthenticatedUser()
      this.setState(newState);

      // SET STATE FOR THE REDUX STORE
      let payload = {
        type: USER_LOGGED_IN,
        user: new User(newState.cognitoUser)
      }
      store.dispatch(action(USER_LOGGED_IN, payload))
      
      this.props.history.push("/app");
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

    console.log("Error confirming user login. error:");
    console.log(e);
  }
}

export default handleConfirm;