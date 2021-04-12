import FormErrors from './../../fileStitching/fileStitching.fields/formErrors'
import JobNumber from './../../fileStitching/fileStitching.fields/jobNumber'
import MpegConversionButton from './mpegConversionButton'
import SourceFields from './../../fileStitching/fileStitching.fields/sourceFields'
import SourceFiles from './../../app/fields/sourceFiles'

function fieldBind() {
  //^^//console.log("inside mpegConversion.fields.fieldBind()...")
  this.JobNumber = JobNumber.bind(this)
  this.MpegConversionButton = MpegConversionButton.bind(this)
  this.SourceFields = SourceFields.bind(this)
  this.SourceFiles = SourceFiles.bind(this)

  this.FormErrors = FormErrors.bind(this)
}

export default fieldBind