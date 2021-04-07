import FormErrors from './../../fileStitching/fileStitching.fields/formErrors'
import JobNumber from './../../fileStitching/fileStitching.fields/jobNumber'
import Mpeg1ConversionButton from './mpeg1ConversionButton'
import SourceFields from './../../fileStitching/fileStitching.fields/sourceFields'
import SourceFiles from './../../app/fields/sourceFiles'

function fieldBind() {
  console.log("inside mpeg1Conversion.fields.fieldBind()...")
  this.JobNumber = JobNumber.bind(this)
  this.Mpeg1ConversionButton = Mpeg1ConversionButton.bind(this)
  this.SourceFields = SourceFields.bind(this)
  this.SourceFiles = SourceFiles.bind(this)

  this.FormErrors = FormErrors.bind(this)
}

export default fieldBind