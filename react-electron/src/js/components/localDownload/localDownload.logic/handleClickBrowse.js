import { checkIfDirectoryExists } from './../../../utils/directoryFunctions'
import { DISALLOW_OPEN_DIALOG, ALLOW_OPEN_DIALOG } from './../../../constants/action-types'
import { action } from './../../../utils/action'
import defined from './../../../utils/defined'
import Logging from './../../../utils/logging'

var electron = window.require("electron")
var dialog = electron.remote.dialog
var store = window.store

function allowOpenDialog() {
  let allow = true

  if(!defined(store.getState().allowOpenDialog)) {
    allow = store.getState().allowOpenDialog
  }
  else {
    Logging.log("allowOpenDialog was undefined or null in the store")
  }

  Logging.log("allowOpenDialog() allow():", allow)

  return allow
}

function setDefaultPath() {
  let defaultPath = ""
  let prodPath = "V:"
  let testPath = "E:"
  let devPath = "C:"

  try {
    if(checkIfDirectoryExists(prodPath)) {
      defaultPath = prodPath
    } else if(checkIfDirectoryExists(testPath)) {
      defaultPath = testPath
    } else if(checkIfDirectoryExists(devPath)) {
      let devTempPath = `${devPath}\\Users\\devops2\\Documents\\GitHub\\aws-sam-s3-bucket-trigger-api\\react-electron\\private\\test_jobs`;

      if (checkIfDirectoryExists(devTempPath)) {
        defaultPath = devTempPath;
      }
    }
  }
  catch (error) {
    Logging.logError("error setting defaultPath", error)
  }

  return defaultPath
}

async function handleClickBrowse() {
  let defaultPath = setDefaultPath()
  let selectedFile = ""

  if(allowOpenDialog()) {
    store.dispatch(action(DISALLOW_OPEN_DIALOG))

    try {
      let browseButtonResponse =
        await dialog.showOpenDialog({
          properties: ['openFile'],
          defaultPath: defaultPath
        })

      let selectedFiles = await browseButtonResponse.filePaths

      store.dispatch(action(ALLOW_OPEN_DIALOG))
      
      if(selectedFiles.length > 0) {
        selectedFile = browseButtonResponse.filePaths[0]

        let newState = {
          ...(this.state),
          sourceFile: selectedFile
        }

        this.setState(newState)

        Logging.info("Local Download. handleClickBrowse final this.state:", this.state)
      }
    }
    catch(error) {
      store.dispatch(action(ALLOW_OPEN_DIALOG))
      Logging.logError("Error in localDownload.logic.handleClickBrowse():", error)
    }
  }
  else {
    Logging.info("Browse window already open")
  }

}

export default handleClickBrowse