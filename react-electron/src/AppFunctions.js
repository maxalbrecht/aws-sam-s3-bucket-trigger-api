import { checkIfDirectoryExists } from './js/utils/directoryFunctions'
import { handleChange } from './js/utils/reactFormFunctions'
import User from "./js/components/user/user";
import Deposition from "./js/components/deposition/deposition";
import { addArticle } from "./js/actions/index";
import APIPayloadCreator from "./js/components/api_call/api_payload_creator";
import APICaller from "./js/components/api_call/api_caller";
import { ConvertPriorityStringToInt, ONE_DAY, TWO_DAYS, THREE_DAYS, FOUR_DAYS } from "./js/constants/priority_options"
import { QuickSync, Manual } from "./js/constants/order_types"
import initialData from './js/components/dnd_list/initial-data';

const uuidv4 = window.require("uuid/v4")
var electron = window.require("electron");
var remote = electron.remote;
var dialog = remote.dialog;

function mapDispatchToProps(dispatch) {
  return {
    addArticle: article => dispatch(addArticle(article))
  };
}

async function setDefaultPath(jobNumber) {
  let defaultPath = "";
  let prodPath = "Y:";
  let testPath = "E:";
  let devPath = "C:";

  try {
    if (checkIfDirectoryExists(prodPath)) {
      defaultPath = `${prodPath}\\vxttest01`;
    }
    else if (checkIfDirectoryExists(testPath)) {
      defaultPath = testPath;
    }
    else if (checkIfDirectoryExists(devPath)) {
      let devTempPath = `${devPath}\\Users\\devops2\\Documents\\GitHub\\aws-sam-s3-bucket-trigger-api\\react-electron\\private\\test_jobs`;
      console.log(`dev temp path: ${devTempPath}`);
      if (checkIfDirectoryExists(devTempPath)) {
        defaultPath = devTempPath;
      }
    }

    let tempPath = `${defaultPath}\\${jobNumber}`;
    if ( checkIfDirectoryExists(tempPath)) {
      defaultPath = tempPath;
    }
  }
  catch (e) {
    console.log(`Error setting browse window default window. Error: ${e}`);
  }

  return defaultPath;
}

async function handleClickBrowse() {
  let defaultPath = await setDefaultPath(this.state.jobNumber);

  var browseButtonResponse = 
    await dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        defaultPath: defaultPath
      }
    );
  var selectedFiles = await browseButtonResponse.filePaths;

  // Get the maximum id of the files that are already on the list
  var maxDocId = 0;
  Object.keys(this.state.sourceFiles.docs).forEach((key, index) => {
    var currentId = key.split('-')[1];
    if (currentId > maxDocId) {
      maxDocId = currentId;
    }
  })

  // Create a new copy of docs already on the list, and add newly selected files
  // Also add all of these files to the list of docIds for column-1
  var newDocs = {...this.state.sourceFiles.docs}
  var newColumnOneDocIds = [...this.state.sourceFiles.columns["column-1"].docIds]

  Object.values(selectedFiles).forEach((value) => {
    maxDocId++;
    var newKey = "doc-" + (maxDocId);
    
    newDocs[newKey] = {id: newKey, content: value};
    newColumnOneDocIds.push(newKey);
  });
  // Use our newDocs and NewColumnOneDocIds to create our new state
  const newState = {
    ...this.state,
    sourceFiles: {
      docs: newDocs,
      columns: {
        ...this.state.sourceFiles.columns,
        'column-1': {
          id: this.state.sourceFiles.columns["column-1"].id,
          title: this.state.sourceFiles.columns["column-1"].title,
          docIds: newColumnOneDocIds
        }
      },
      columnOrder: Array.from(this.state.sourceFiles.columnOrder)
    },
  };

  this.setState(newState);
}

function updatePriorityOptions(event) {
  if (event.target.id === "orderType") {
    var options = [ONE_DAY, TWO_DAYS];
    var priority = this.state.priority;

    if (event.target.value === Manual) {
      options.push(THREE_DAYS);
      options.push(FOUR_DAYS);
    }
    else if (this.state.priority === THREE_DAYS || this.state.priority === FOUR_DAYS) {
      priority = ONE_DAY;
    }

    var newState = {
      ...this.state,
      orderType: event.target.value,
      priority: priority,
      priorityOptions: options
    }

    this.setState(newState)
  }
}

function ReturnJobPath(jobNumber, inputOrOutput = "input") {
  let mainFolder = "vxttest01";
  let region = "region=us_east_1";
  let path = `aws://${mainFolder}/${jobNumber}?region=${region}`;
  
  return path;
}

function handleSubmit(event) {
  let currentId = uuidv4();
  event.preventDefault();
  let payloadCreator = new APIPayloadCreator({
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
    fileOrder: this.state.sourceFiles.columns["column-1"].docIds
  });

  let apiCaller = new APICaller(payloadCreator.formattedAPIPayload, currentId);
  
  this.props.addArticle(
    {
      id: currentId,
      title: this.state.title,
      jobNumber: this.state.jobNumber,
      sourceFiles: this.state.sourceFiles,
      orderType: this.state.orderType,
      priority: this.state.priority,
      notes: this.state.notes,
      payloadCreator: payloadCreator,
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

function onDragStart() {
  //this.style.color = 'orange';
  //this.style.transition = 'background-color 0.2s ease'
};

function onDragUpdate(update) {
  //const { destination } = update;
  //const opacity = destination
  //  ? destination.index / Object.keys(this.state.sourceFiles.docs).length
  //  : 0;
  //this.style.backgroundColor = 'rgba(153, 141, 217, ${opacity})';

}

function onDragEnd(result) {
  //this.style.color = 'black';
  //this.style.backgroundColor = 'beige';
  const { destination, source, draggableId } = result;

  if (
    destination &&
    destination.droppabbleId &&
    destination.droppableId === source.droppableId &&
    destination.Index === source.index
  ) {
    return;
  }

  const column = this.state.sourceFiles.columns[source.droppableId]
  let newDocs = this.state.sourceFiles.docs;
  const newDocIds = Array.from(column.docIds);
  newDocIds.splice(source.index, 1);
  if (destination) { //this if statement allows us to delete items if they
                     // are dropped outside of a droppable item
    
    newDocIds.splice(destination.index, 0, draggableId);
  }
  else {
    delete newDocs[draggableId];
  }

  const newColumn = {
    ...column,
    docIds: newDocIds,
  };

  const newState = {
    ...this.state,
    sourceFiles: {
      docs: newDocs,
      columns: {
        ...this.state.sourceFiles.columns,
        [newColumn.id]: newColumn,
      },
      columnOrder: Array.from(this.state.sourceFiles.columnOrder)
    },
  };

  this.setState(newState);
}

function getConstructorState() {
  return {
    id: "",
    title: "",
    jobNumber: "",
    sourceFiles: initialData,
    orderType: QuickSync,
    priorityOptions: [ONE_DAY, TWO_DAYS],
    priority: ONE_DAY,
    notes: "",
    user: new User(),
    deposition: new Deposition() 
  }
}
export {
  mapDispatchToProps,
  handleClickBrowse,
  updatePriorityOptions,
  handleChange,
  handleSubmit,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  getConstructorState
}