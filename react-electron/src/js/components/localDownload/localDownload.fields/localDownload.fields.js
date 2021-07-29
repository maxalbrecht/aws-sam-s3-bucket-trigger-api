import FormErrors from './../../fileStitching/fileStitching.fields/formErrors'
import SourceFile from  './sourceFile'
import SourceFields from './sourceFields'
import LocalDownloadButton from './localDownloadButton'
import BrowseButton from '../../app/fields/browseButton'

function fieldBind() {
  this.SourceFields = SourceFields.bind(this)
  this.SourceFile = SourceFile.bind(this)
  this.BrowseButton = BrowseButton.bind(this)
  this.LocalDownloadButton = LocalDownloadButton.bind(this)

  this.FormErrors = FormErrors.bind(this)
}

export default fieldBind