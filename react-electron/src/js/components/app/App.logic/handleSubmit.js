////////////////////////////////////////////////////////////////////
// Handle submit when the user clicks on the Submit Job Button

import Deposition from "../../../classes/deposition/deposition";
import APIPayloadCreator from "../../../classes/api_call/api_payload_creator";
import APICaller from "../../../classes/api_call/api_caller";
import { ConvertPriorityStringToInt, NORMAL, HIGH } from "../../../constants/priority_options"
import { QuickSync } from "../../../constants/order_types"
import initialData from '../../dnd_list/initial-data'
import defined from './../../../utils/defined'

const uuidv4 = window.require("uuid/v4");

// Method to prepare to call the API with an APICaller object
// Gives the default job path that is used for the jobInputPath and jobOutputPath
// and passed as part of the API call
function ReturnJobPath(jobNumber, subfolders, inputOrOutput = "input") {
  let mainFolder = "vxtprod";
  let region = "region=us_east_1";
  let path = `aws://${mainFolder}/${jobNumber}${subfolders}?region=${region}`;
  
  return path;
}


function GetSubfolders(fileList_raw){
  let subfolders = ""

  if( fileList_raw.docs !== undefined && Object.keys(fileList_raw.docs).length > 0){
    let value = fileList_raw.docs[Object.keys(fileList_raw.docs)[0]]
    let docValue = value.content
    let docValueSplit = docValue.split('\\');

    for (let i = 2; i < docValueSplit.length - 1; i++) {
      subfolders += "/" + docValueSplit[i]
    }
  }

  return subfolders
}

// Creates an APIPayloadCreator and APICaller to call the external API
// Once this is done, it adds the submitted job so that it can be
// displayed in the UI
 function handleSubmit(event) {
  let date = new Date();
  let storeState = window.store.getState()
  let subfolders = GetSubfolders(this.state.sourceFiles)
  

  if(defined(storeState.user)) {
    storeState.user.resetLastTimeOfActivity();
    let currentId = uuidv4();
    event.preventDefault();

    let apiPayloadCreator = new APIPayloadCreator({
      externalJobNumber: this.state.jobNumber,
      // DO NOT ERASE
      //deponentFirstName: this.state.deposition.deponentFirstName,
      //deponentLastName: this.state.deposition.deponentFirstName,
      //depositionDate: this.state.deposition.depositionDate,
      //caseName: this.state.deposition.caseName,
      //caseNumber: this.state.deposition.caseNumber,
      jobInputPath: ReturnJobPath(this.state.jobNumber, subfolders),
      jobOutputPath: ReturnJobPath(this.state.jobNumber, subfolders, "output"),
      orderType: this.state.orderType,
      fileList_raw: this.state.sourceFiles,
      priority: ConvertPriorityStringToInt(this.state.priority),
      assignedUserEmail: storeState.user.assignedUserEmail,
      imageType: 3,
      imageBranding: "Veritext", 
      createImage: 1,
      contactName: storeState.user.contactName,
      contactEmail: storeState.user.contactEmail,
      contactPhone: storeState.user.contactPhone,
      allowedConfidenceLevelPercent: 70,
      fileOrder: this.state.sourceFiles.columns["column-1"].docIds,
      notes: this.state.notes
    });

    let apiCaller = new APICaller(apiPayloadCreator, currentId);
    
    this.props.addArticle(
      {
        id: currentId,
        title: this.state.title,
        jobNumber: this.state.jobNumber,
        sourceFiles: this.state.sourceFiles,
        orderType: this.state.orderType,
        priority: this.state.priority,
        notes: this.state.notes,
        payloadCreator: APIPayloadCreator,
        apiCaller: apiCaller,
        date: date
      }
    );
    

    this.setState(
      { 
        id: "",
        title: "",
        jobNumber: "",
        sourceFiles: initialData,
        orderType: QuickSync,
        priority: NORMAL,
        priorityOptions: [NORMAL, HIGH],
        notes: "",
        user: this.state.user,
        deposition: new Deposition() 
      }
    )
  }
  else {
    alert("You are not logged in. Please log in and try again.");
  }
}

export default handleSubmit;