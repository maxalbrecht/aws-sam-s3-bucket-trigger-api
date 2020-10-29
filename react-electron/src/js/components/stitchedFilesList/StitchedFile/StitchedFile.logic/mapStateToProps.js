import UpdateComponent from './updateComponent'
import defined from './../../../../utils/defined'
import { FILE_STITCHING_FINISHED } from './../../../../constants/action-types'
const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps){
  console.log("Inside StitchedFile Logic mapStateToProps...")
  console.log("state.stitchedFiles:")
  console.log(state.stitchedFiles)

  let update = {}

  state.stitchedFiles.forEach(file => {
    if(file.id === ownProps.StitchedFileObject.id){
      if(defined(state.stitchedFile)){
        console.log("state.action")
        console.log(state.action)
      }

      if(
        defined(state.action)
        && (state.action.type === FILE_STITCHING_FINISHED)
        && (file.id === state.action.payload.StitchedFileObject.id)
      ){
        UpdateComponent(state)

        update.TriggerRender = uuidv4()
      }
      else {
        update.fileStitchingStatus = file.fileStitcher.fileStitchingStatus
      }
    }
  })

  return update
}

export default mapStateToProps
