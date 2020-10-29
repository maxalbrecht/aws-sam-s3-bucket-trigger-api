import { checkIfDirectoryExists } from './../../../utils/directoryFunctions'
import { DISALLOW_OPEN_DIALOG, ALLOW_OPEN_DIALOG } from './../../../constants/action-types'
import { action } from './../../../utils/action'
var electron = window.require("electron")
var remote = electron.remote
var dialog = remote.dialog
var store = window.store

////////////////////////////////////////////////////////////////////////////////////////////
// Methods for selecting source files

// returns the location that should be opened when the user clicks on the
// Browse button for selecting source files, based on the 

async function handleClickBrowse() {
  console.log("window.store.getState():")
  console.log(window.store.getState())
  //let defaultPath = await setDefaultPath(this.state.jobNumb)
}

export default handleClickBrowse