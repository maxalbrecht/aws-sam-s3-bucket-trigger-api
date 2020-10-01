import JobStatus from './JobStatus'
import TaskAssignmentGrid from './TaskAssignmentGrid'

function fieldBind() {
  this.JobStatus = JobStatus.bind(this)
  this.TaskAssignmentGrid = TaskAssignmentGrid.bind(this)
}

export default fieldBind