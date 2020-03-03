import JobNumber from './jobNumber'
import SourceFiles from './sourceFiles'
import OrderType from './orderType'
import Priority from './priority'
import Notes from './notes'
import SubmitJobButton from './submitJobButton'

function fieldBind() {
  this.JobNumber = JobNumber.bind(this);
  this.SourceFiles = SourceFiles.bind(this);
  this.OrderType = OrderType.bind(this);
  this.Priority = Priority.bind(this);
  this.Notes = Notes.bind(this);
  this.SubmitJobButton = SubmitJobButton.bind(this);
}

export default fieldBind;