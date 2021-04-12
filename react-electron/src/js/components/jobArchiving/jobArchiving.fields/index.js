import FormErrors from './formErrors'
import JobNumber from './jobNumber'
import ArchiveJobButton from './archiveJobButton.js'
import DestinationFields from './destinationFields'
import Year from './year'
import Month from './month'

function fieldBind() {
  //^^//console.log("inside job Archiving fieldBind()...")
  this.JobNumber = JobNumber.bind(this)
  this.ArchiveJobButton = ArchiveJobButton.bind(this)
  this.DestinationFields = DestinationFields.bind(this)
  this.Year = Year.bind(this)
  this.Month = Month.bind(this)

  this.FormErrors = FormErrors.bind(this)
}

export default fieldBind;