import { checkIfDirectoryExists } from '../../../utils/directoryFunctions'
import { DISALLOW_OPEN_DIALOG, ALLOW_OPEN_DIALOG } from './../../../constants/action-types'
import { action } from './../../../utils/action'

var electron = window.require("electron");
var remote = electron.remote;
var dialog = remote.dialog;
var store = window.store;

//////////////////////////////////////////////////////////////////////////////////
// Methods for selecting source files

// Returns the location that should be opened when the user clicks on the
// Browse button for selecting source files, based on the Job Number typed
// in by the user (and whether the environment is dev, demo or prod)
async function setDefaultPath(jobNumber) {
  let defaultPath = "";
  let prodPath = "V:";
  let testPath = "E:";
  let devPath = "C:";

  try {
    if (checkIfDirectoryExists(prodPath)) {
      defaultPath = prodPath;
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

function allowOpenDialog() {
//TODO: Implement
let allow = true; 

// If allowOpenDialog is not undefined or null in the store, use that value,
// otherwise use the default of true
if (store.getState().allowOpenDialog !== undefined && store.getState().allowOpenDialog !== null) {
 allow = store.getState().allowOpenDialog;
 console.log("allowOpenDialog was defined");
}
else {
  console.log("allowOpenDialog was undefined or null in the store");
}

console.log("allowOpenDialog() allow:")
console.log(allow);

return allow;
}

// Open a window when the user clicks the Browse button for selecting source files
async function handleClickBrowse() {
  console.log("window.store.getState():")
  console.log(window.store.getState())
  let defaultPath = await setDefaultPath(this.state.jobNumber);
  

  if(allowOpenDialog()){
    store.dispatch(action(DISALLOW_OPEN_DIALOG));

    try{
      var browseButtonResponse = 
        await dialog.showOpenDialog(
          {
            properties: ['openFile', 'multiSelections'],
            defaultPath: defaultPath
          }
        );
      var selectedFiles = await browseButtonResponse.filePaths;
      console.log("selectedFiles:");
      console.log(selectedFiles);

      store.dispatch(action(ALLOW_OPEN_DIALOG));
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
      var newColumnOneDocIds = []; //= [...this.state.sourceFiles.columns["column-1"].docIds]

      if (this.state.sourceFiles.columns["column-1"].docIds && this.state.sourceFiles.columns["column-1"].docIds.length) {   
        // not empty 
        newColumnOneDocIds = [...this.state.sourceFiles.columns["column-1"].docIds];
      } else {
        // empty
        console.log("FileStitching.logic.js this.state.sourceFiles.columns[column-1].docIds is currently empty.");
      }

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

      console.log("FileStitching.logic.js handleClickBrowse() newState:");
      console.log(newState);

      this.setState(newState);

      console.log("FileStitching.logic.js this.state")
      console.log(this.state);
    }
    catch(err) {
      store.dispatch(action(ALLOW_OPEN_DIALOG));
      console.log("Error in handleClickBrowse()");
    }
  }
  else {
    console.log("Browse window already open");
  }
}

  export default handleClickBrowse;