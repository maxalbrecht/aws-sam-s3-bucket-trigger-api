import FormErrors from './formErrors'
import JobNumber from './jobNumber'
import StitchFileButton from './stitchFileButton'
import SourceFields from './sourceFields'
import SourceFiles from './../../app/fields/sourceFiles'
import DestinationFields from './destinationFields'
import AudioAdjustment from './audioAdjustment'
import DestinationFileName from './destinationFileName'

function fieldBind() {
  console.log("inside file stitching fieldBind()...")
  this.JobNumber = JobNumber.bind(this)
  this.StitchFileButton = StitchFileButton.bind(this)
  this.SourceFields = SourceFields.bind(this)
  this.SourceFiles = SourceFiles.bind(this)
  this.DestinationFields = DestinationFields.bind(this)
  this.AudioAdjustment = AudioAdjustment.bind(this)
  this.DestinationFileName = DestinationFileName.bind(this)

  this.FormErrors = FormErrors.bind(this)
}

export default fieldBind
