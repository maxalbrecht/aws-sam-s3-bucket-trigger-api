import { addStitchedFile } from "./../../../actions/index"

function mapDispatchToProps(dispatch){
  return{
    addStitchedFile: stitchedFile => dispatch(addStitchedFile(stitchedFile))
  }
}

export default mapDispatchToProps