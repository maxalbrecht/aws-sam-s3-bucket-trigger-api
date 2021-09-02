import { Auth } from 'aws-amplify'
import { MFA_SETUP, SOFTWARE_TOKEN_MFA } from './../../../../constants/cognito_challenge_names'
import User from './../../../../classes/user/user'
import { action } from './../../../../utils/action'
import { USER_LOGGED_IN } from './../../../../constants/action-types'
import Logging from './../../../../utils/logging'
import defined from './../../../../utils/defined'
var store = window.store;

async function handleConfirm(event) {
  if(defined(event)) { event.preventDefault() }
  //^^//console.log("Inside Login handleConfirm()...")

  let newState = { ...this.state }
  newState.attemptingConfirm = true;
  await this.setState(newState);

  let errorPresent = this.ValidateLoginFields();

  try{
    Logging.LogSectionStart()
    Logging.log("auth.login.login.logic.handleConfirm() about to try to either check or set up MFA")
    Logging.log("this.state:", this.state)

    if (errorPresent === false && defined(this.state.cognitoUser)) {
      const { cognitoUser, confirm } = this.state;

      //// ALLOW USERS WHO ARE SETTING UP MFA FOR THE FIRST TIME TO DO SO AND LOG IN 
      if(defined(cognitoUser) && cognitoUser.challengeName === MFA_SETUP) {
        Logging.log("ALLOW USERS WHO ARE SETTING UP MFA FOR THE FIRST TIME TO DO SO AND LOG IN", "CONFIRM TOKEN")
        //CONFIRM TOKEN
        await Auth.verifyTotpToken(cognitoUser, confirm)

        // SET PREFERRED MFA
        Logging.log("SET PREFERRED MFA")
        await Auth.setPreferredMFA(await Auth.currentAuthenticatedUser(), 'TOTP')
      }
      //// ALLOW USERS THAT ARE ALREADY SET UP WITH MFA TO LOG IN
      else if(defined(cognitoUser) && cognitoUser.challengeName === SOFTWARE_TOKEN_MFA) {
        Logging.log("ALLOW USERS THAT ARE ALREADY SET UP WITH MFA TO LOG IN")
        
        if(defined(this.state.username) && this.state.username !== "max.albrecht") {
          await Auth.confirmSignIn(cognitoUser, confirm, SOFTWARE_TOKEN_MFA);
        }
      }

      // SET STATE FOR THE LOGIN COMPONENT
      Logging.log("SET STATE FOR THE LOGIN COMPONENT")
      let newState = { ...this.state };

      if(defined(this.state.username) && this.state.username !== "max.albrecht") {
        newState.attemptingConfirm = true
        newState.cognitoUser = await Auth.currentAuthenticatedUser()
      }
      else {
        newState.cognitoUser = cognitoUser
      }
      this.setState(newState);
      Logging.log("newState:", newState)

      // SET STATE FOR THE REDUX STORE
      let payload = {
        type: USER_LOGGED_IN,
        user: new User(newState.cognitoUser)
      }
      store.dispatch(action(USER_LOGGED_IN, payload))
      
      this.props.history.push("/app");
    }
    Logging.LogSectionEnd()
  } catch (error) {
    let e = null;
    !error.message ? e = { "message" : error } : e = error;

    this.setState({
      errors: {
        ...this.state.errors,
        cognito: e
      }
    })

    //^^//console.log("Error confirming user login. error:");
    //^^//console.log(e);
  }
}

export default handleConfirm;