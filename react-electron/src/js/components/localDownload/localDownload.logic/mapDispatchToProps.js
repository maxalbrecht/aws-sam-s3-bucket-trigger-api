import { addLocalDownloadJob } from "../../../actions";

function mapDispatchToProps(dispatch) {
  return {
    addLocalDownloadJob: localDownloadJob => dispatch(addLocalDownloadJob(localDownloadJob))
  }
}

export default mapDispatchToProps