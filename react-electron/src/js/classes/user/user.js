import defined from './../../utils/defined'
import users from './users'
import { DEV, PROD } from './../../constants/environments'

class User {
  constructor(cognitoUser) {
    this.username = null;
    this.assignedUserEmail = null;
    this.contactEmail = null;
    this.contactName = null;
    this.contactPhone = null;
    this.lastTimeOfActivity = new Date();

    if (defined(cognitoUser)) {
      let environment = this.chooseEnvironment();
      console.log("User constructor cognitoUser:");     
      console.log(cognitoUser);     

      console.log("users:");
      console.log(users)

      let selectedUser = null;
      
      users[environment].forEach(user => {
        if (user.username === cognitoUser.username ) {
          selectedUser = user;
        }
      })
      
      this.cognitoUser = cognitoUser;
      this.contactName = selectedUser.contactName;
      this.contactEmail = selectedUser.contactEmail;
      this.contactPhone = selectedUser.contactPhone;
      this.assignedUserEmail = selectedUser.assignedUserEmail;

      console.log("User constructor selectedUser:");
      console.log(selectedUser);

      console.log("User this.contactName:");
      console.log(this.contactName);
      console.log("User this.contactEmail:");
      console.log(this.contactEmail);
      console.log("User this.contactPhone:");
      console.log(this.contactPhone);
      console.log("User this.assignedUserEmail:");
      console.log(this.assignedUserEmail);
    }
    else {
      console.log("User constructor cognitoUser is not defined");
    }
  }

  /*
  constructor({
    contactName,
    contactEmail,
    contactPhone,
    assignedUserEmail
  }={}){
    this.contactName = contactName;
    this.contactEmail = contactEmail;
    this.contactPhone = contactPhone;
    this.assignedUserEmail = assignedUserEmail;
  }
  */
  chooseEnvironment() {
    const isDev = window.require("electron-is-dev");
    console.log("chooseEnvironment isDev:")
    console.log(isDev);

    if(isDev) {
      return DEV
    }
    else {
      return PROD
    }
  }

  resetLastTimeOfActivity() {
    this.lastTimeOfActivity = new Date()
  }
}



export default User;