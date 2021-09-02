import AUTH_CONSTANTS from './../../../../constants/auth'
import File from './../../../../utils/file'
import Logging from './../../../../utils/logging'
import defined from './../../../../utils/defined'
import isDev from './../../../../utils/is-dev'

//const isDev = require("electron-is-dev")
var DEV_CREDENTIALS
try {
  if(isDev) {
    DEV_CREDENTIALS = JSON.parse(File.getContent(AUTH_CONSTANTS.DEV_CREDENTIALS))
  }
}
catch(error) {
  Logging.logError("Error trying to initialize auth.login.logic.getConstructorState's dev credentials. Error:", error)
}

function getConstructorState() {
  let username = (defined(DEV_CREDENTIALS) && isDev ? DEV_CREDENTIALS.username : "")
  let password = (defined(DEV_CREDENTIALS) && isDev ? DEV_CREDENTIALS.password : "")
  let confirm = (isDev ? "1" : null)

  return {
    username: username,
    password: password,
    errors: {
      cognito: null,
      blankfield: false
    },
    attemptingLogin: false,
    attemptingConfirm: false,
    cognitoUser: null,
    cognitoTOTPCode: null,
    confirm: confirm
  }
}

export default getConstructorState;