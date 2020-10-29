import FormErrors from './formErrors'
import JobNumber from './jobNumber'
import StitchFileButton from './stitchFileButton'
import DestinationFields from './destinationFields'

function fieldBind() {
  console.log("inside file stitching fieldBind()...")
  this.JobNumber = JobNumber.bind(this)
  this.StitchFileButton = StitchFileButton.bind(this)
  this.DestinationFields = DestinationFields.bind(this)

  this.FormErrors = FormErrors.bind(this)
}

export default fieldBind
