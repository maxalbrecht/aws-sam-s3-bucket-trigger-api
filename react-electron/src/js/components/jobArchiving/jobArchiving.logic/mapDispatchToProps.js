import { AddArchivedJob } from "../../../actions/index"

function mapDispatchToProps(dispatch){
  return {
    AddArchivedJob: archivedJob => dispatch(AddArchivedJob(archivedJob))
  }
}

export default mapDispatchToProps