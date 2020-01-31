////////////////////////////////////////////////////////////////////
// Handle submit when the user clicks on the Submit Job Button

import Deposition from "../../../classes/deposition/deposition";
import APIPayloadCreator from "../../../classes/api_call/api_payload_creator";
import APICaller from "../../../classes/api_call/api_caller";
import { ConvertPriorityStringToInt, ONE_DAY, TWO_DAYS } from "../../../constants/priority_options"
import { QuickSync } from "../../../constants/order_types"
import initialData from '../../dnd_list/initial-data'

const uuidv4 = window.require("uuid/v4");

// Method to prepare to call the API with an APICaller object
// Gives the default job path that is used for the jobInputPath and jobOutputPath
// and passed as part of the API call
function ReturnJobPath(jobNumber, inputOrOutput = "input") {
  let mainFolder = "vxttest01";
  let region = "region=us_east_1";
  let path = `aws://${mainFolder}/${jobNumber}?region=${region}`;
  
  return path;
}

// Creates an APIPayloadCreator and APICaller to call the external API
// Once this is done, it adds the submitted job so that it can be
// displayed in the UI
function handleSubmit(event) {
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
    jobInputPath: ReturnJobPath(this.state.jobNumber),
    jobOutputPath: ReturnJobPath(this.state.jobNumber, "output"),
    orderType: this.state.orderType,
    fileList_raw: this.state.sourceFiles,
    priority: ConvertPriorityStringToInt(this.state.priority),
    assignedUserEmail: this.state.user.assignedUserEmail,
    imageType: 1,
    createImage: 1,
    contactName: this.state.user.contactName,
    contactEmail: this.state.user.contactEmail,
    contactPhone: this.state.user.contactPhone,
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
      apiCaller: apiCaller
    }
  );

  this.setState(
    { 
      id: "",
      title: "",
      jobNumber: "",
      sourceFiles: initialData,
      orderType: QuickSync,
      priority: ONE_DAY,
      priorityOptions: [ONE_DAY, TWO_DAYS],
      notes: "",
      user: this.state.user,
      deposition: new Deposition() 
    }
  )
}

export default handleSubmit;