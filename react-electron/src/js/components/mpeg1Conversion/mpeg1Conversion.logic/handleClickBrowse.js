import { checkIfDirectoryExists } from './../../../utils/directoryFunctions'
import { DISALLOW_OPEN_DIALOG, ALLOW_OPEN_DIALOG } from './../../../constants/action-types'
import { action } from './../../../utils/action'
import defined from './../../../utils/defined'
import Logging from './../../../utils/logging'

var electron = window.require("electron")
var remote = electron.remote
var dialog = remote.dialog
var store = window.store

async function setDefaultPath(jobNumber) {
  let defaultPath = ""
  let prodPath = "V:"
  let testPath = "E:"
  let devPath = "C:"

  try {
    if (checkIfDirectoryExists(prodPath)) {
      defaultPath = prodPath
    }
    else if (checkIfDirectoryExists(testPath)) {
      defaultPath = testPath
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

  return defaultPath
}

function allowOpenDialog() {
//TODO: Implement
let allow = true; 

// If allowOpenDialog is not undefined or null in the store, use that value,
// otherwise use the default of true
if (!defined(store.getState().allowOpenDialog)) {
 allow = store.getState().allowOpenDialog
 console.log("allowOpenDialog was defined")
}
else {
  Logging.log("allowOpenDialog was undefined or null in the store")
}

Logging.log("allowOpenDialog() allow:", allow)

return allow;
}

async function handleClickBrowse() {
  Logging.log("window.store.getState():", window.store.getState())
  let defaultPath = await setDefaultPath(this.state.jobNumber)

  if(allowOpenDialog()) {
    store.dispatch(action(DISALLOW_OPEN_DIALOG))

    try {
      var browseButtonResponse =
        await dialog.showOpenDialog(
          {
            properties: ['openFile', 'multiSelections'],
            defaultPath: defaultPath
          }
        )
      var selectedFiles = await browseButtonResponse.filePaths
      Logging.log("selectedFiles:", selectedFiles)

      store.dispatch(action(ALLOW_OPEN_DIALOG))

      var maxDocId = 0
      Object.keys(this.state.sourceFiles.docs).forEach( (key, index) => {
        var currentId = key.split('-')[1]
        if (currentId > maxDocId) {
          maxDocId = currentId
        }
      })

      var newDocs = {...this.state.sourceFiles.docs}
      var newColumnOneDocIds = []

      if (this.state.sourceFiles.columns["column-1"].docIds && this.state.sourceFiles.columns["column-1"].docIds.length) {   
        // not empty
        newColumnOneDocIds = [...this.state.sourceFiles.columns["column-1"].docIds];
      } else {
        // empty
        Logging.log("FileStitching.logic.js this.state.sourceFiles.columns[column-1].docIds is currently empty.");
      }

      Object.values(selectedFiles).forEach( (value) => {
        maxDocId++
        var newKey = "doc-" + (maxDocId)

        newDocs[newKey] = { id: newKey, content: value }
        newColumnOneDocIds.push(newKey)
      })

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
        }
      }

      Logging.log("Mpeg1Stitching.logic.js handleClickBrowse() newState:", newState)

      this.setState(newState)

      Logging.log("Mpeg1Stitching.logic.js this.state:", this.state)
    }
    catch(err) {
      store.dispatch(action(ALLOW_OPEN_DIALOG))
      Logging.LogError("Error in mpeg1Conversion.logic.handleClickBrowse():", err)
    }
  }
  else {
    Logging.log("Browse window already open")
  }
}

export default handleClickBrowse