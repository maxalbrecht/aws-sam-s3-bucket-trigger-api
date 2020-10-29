import { AddStitchedFile } from "./../../../actions/index"

function mapDispatchToProps(dispatch){
  return{
    AddStitchedFile: stitchedFile => dispatch(AddStitchedFile(stitchedFile))
  }
}

export default mapDispatchToProps