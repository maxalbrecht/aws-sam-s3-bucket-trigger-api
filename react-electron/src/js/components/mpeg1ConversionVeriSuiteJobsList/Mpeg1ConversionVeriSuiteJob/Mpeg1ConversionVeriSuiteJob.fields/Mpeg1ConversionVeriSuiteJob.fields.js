import SourceFile from './sourceFile'
import JobDetails from './jobDetails'

function fieldBind() {
  this.SourceFile = SourceFile.bind(this)
  this.JobDetails = JobDetails.bind(this)
}

export default fieldBind