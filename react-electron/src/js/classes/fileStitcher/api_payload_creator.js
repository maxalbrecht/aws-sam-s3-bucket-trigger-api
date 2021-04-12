import api_payload_template from './api_payload_template'
import inputs_item_template from './inputs_item_template'
import FILE_STITCHING_CONSTANTS from './../../constants/file-stitching'
import Regex from './../../utils/regex'
import Logging from './../../utils/logging'
import defined from './../../utils/defined'

class APIPayloadCreator {
  constructor(
    externalJobNumber,
    fileList_raw,
    fileOrder,
    destinationFileName,
    assignedUserEmail,
    contactName,
    contactEmail,
    contactPhone,
    templateId
  ){
    try {
      this.FileUrlBase = FILE_STITCHING_CONSTANTS.FILE_URL_BASE
      this.subfolders = this.getSubfolders(fileList_raw)

      this.state = {
        ExternalJobNumber: externalJobNumber,
        inputs: this.formatInputsObject(fileList_raw, fileOrder, this.FileUrlBase, externalJobNumber, this.subfolders),
        FileOrder: fileOrder,
        DestinationFileName: destinationFileName,
        path_format: externalJobNumber + "/" + this.subfolders + destinationFileName,
        AssignedUserEmail: assignedUserEmail,
        ContactName: contactName,
        ContactEmail: contactEmail,
        ContactPhone: contactPhone,
        fileStatus: FILE_STITCHING_CONSTANTS.FILE_STATUS_DEFAULT,
        template_id: templateId
      }

      this.formattedAPIPayload = Regex.ReplaceJSONPlaceHolders(api_payload_template, this.state)
    } catch (error) {
      Logging.logError("Error instanciating APIPayloadCreator. Error :", error)
    }
  }

  getSubfolders(fileList_raw){
    let subfolders = ""

    if(defined(fileList_raw.docs) && Object.keys(fileList_raw.docs).length > 0){
      let value = fileList_raw.docs[Object.keys(fileList_raw.docs)[0]]
      let docValue = value.content
      let docValueSplit = docValue.split('\\');

      for (let i = 2; i < docValueSplit.length - 1; i++) {
        subfolders += docValueSplit[i] + "/"
      }
    }

    return subfolders
  }

  formatInputsObject(fileList_raw, fileOrder, fileUrlBase, externalJobNumber, subfolders){
    let inputs = {}
    let videoOrdinalPosition = 0

    if(fileOrder && fileOrder.length){
      fileOrder.forEach((file) => {
        let value = fileList_raw.docs[file]

        let docValue = value.content
        let docValueSplit = docValue.split('\\');
        let FileName = docValueSplit[docValueSplit.length - 1]

        let params = {
          FileName: FileName,
          FilePath: null,
          Position: null,
          url: fileUrlBase + externalJobNumber + "/" + subfolders + FileName
        }

        videoOrdinalPosition++
        let doc = Regex.ReplaceJSONPlaceHolders(inputs_item_template, params)

        inputs[ FILE_STITCHING_CONSTANTS.INPUT + videoOrdinalPosition.toString()] = JSON.parse(doc)
      })
    }

    return inputs
  }
}

export default APIPayloadCreator