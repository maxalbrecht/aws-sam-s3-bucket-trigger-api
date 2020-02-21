import User from "../../../classes/user/user"
import Deposition from "../../../classes/deposition/deposition"
import { NORMAL, HIGH } from "../../../constants/priority_options"
import { QuickSync } from "../../../constants/order_types"
import initialData from '../../dnd_list/initial-data'

//////////////////////////////////////////////////////////////////////////
// Boilerplate code to connect these logic files to the React Component
function getConstructorState() {
  //let users = createUsers();
  
  //let user = users.JamesUser;
  //let user = users.DaveUser;
  //console.log("user:");
  //console.log(user);

  return {
    id: "",
    title: "",
    jobNumber: "",
    sourceFiles: initialData,
    orderType: QuickSync,
    priorityOptions: [NORMAL, HIGH],
    priority: NORMAL,
    notes: "",
    deposition: new Deposition() 
  }
}

/*
function createUsers() {
  let users = {};
  
  let JamesUser = new User({
    contactName: "james",
    contactEmail:"jmaraska@veritext.com",
    contactPhone: "9735494532",
    assignedUserEmail: "YLAJ-AJ-QCuser@yeslaw.net"
  });
  let DaveUser = new User({
    contactName: "Dave",
    contactEmail: "ddasilva@veritext.com",
    contactPhone: "9735494436",
    assignedUserEmail: "ddasilva@veritext.com"
  })

  users.JamesUser = JamesUser;
  users.DaveUser = DaveUser;

  return users;
}
*/

export default getConstructorState