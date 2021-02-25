import PropTypes from 'prop-types';
import emailPropType from 'email-prop-type';
import FILE_SYNCING_CONSTANTS from './../../constants/file-syncing'
import File from './../../utils/file'
import Regex from './../../utils/regex'
import api_payload_template from './api_payload_template'
import file_list_item_template from './file_list_item_template' 
import file_list_item_template_no_position from './file_list_item_template_no_position'

class APIPayloadCreator {
  constructor({
    externalJobNumber,
    deponentFirstName,
    deponentLastName,
    depositionDate,
    caseName,
    caseNumber,
    jobInputPath,
    jobOutputPath,
    orderType,
    fileList_raw,
    priority,
    assignedUserEmail,
    imageType,
    imageBranding,
    createImage,
    contactName,
    contactEmail,
    contactPhone,
    allowedConfidenceLevelPercent,
    fileOrder,
    notes
  }) {
    this.state = {
      ExternalJobNumber: externalJobNumber,
      DeponentFirstName: deponentFirstName,
      DeponentLastName: deponentLastName,
      DepositionDate: depositionDate,
      CaseName: caseName,
      CaseNumber: caseNumber,
      JobInputPath: jobInputPath,
      JobOutputPath: jobOutputPath,
      OrderType: orderType,
      FileList: this.formatFileList(fileList_raw, fileOrder),
      Priority: priority,
      AssignedUserEmail: assignedUserEmail,
      ImageType: imageType,
      ImageBranding: imageBranding,
      CreateImage: createImage,
      ContactName: contactName,
      ContactEmail: contactEmail,
      ContactPhone: contactPhone,
      AllowedConfidenceLevelPercent: allowedConfidenceLevelPercent,
      jobStatus: FILE_SYNCING_CONSTANTS.JOB_STATUS_DEFAULT,
      fileOrder: fileOrder,
      Notes: notes
    }
    this.formattedAPIPayload = Regex.ReplaceJSONPlaceHolders(api_payload_template, this.state)

    File.makeDirIfItDoesNotExist(FILE_SYNCING_CONSTANTS.OUTPUT_FOLDER)
    
    File.saveTo(
      this.formattedAPIPayload, 
      FILE_SYNCING_CONSTANTS.OUTPUT_FOLDER + externalJobNumber + FILE_SYNCING_CONSTANTS.PAYLOAD_FILE_NAME_ENDING
    )
  }

  formatFileList(fileList_raw, fileOrder) {
    let fileList = [];
    let videoOrdinalPosition = 0;

    if (fileOrder && fileOrder.length) {
      fileOrder.forEach((file) => {
        let value = fileList_raw.docs[file];

        let docValue = value.content;
        let docValueSplit = docValue.split('\\');
        let FileName = docValueSplit[docValueSplit.length - 1];
        let FileType = FILE_SYNCING_CONSTANTS.FILE_TYPES.TRANSCRIPT
        
        let FileSize = File.getSize(docValue);
      
        let params = {
          FileType: FileType,
          FileName: FileName,
          FileSize: FileSize,
          FilePath: null
        }
        
        let template = file_list_item_template_no_position;

        if ( Regex.endsWithOneOf(FileName, FILE_SYNCING_CONSTANTS.VIDEO_FILE_EXTENSIONS) ) {
        //if (FileName.endsWith(".mp3") || FileName.endsWith(".mp4") || FileName.endsWith(".mpg")) {
          template = file_list_item_template;
          params = {
            ...params, 
            Position: null
          }
          FileType = FILE_SYNCING_CONSTANTS.FILE_TYPES.VIDEO
          videoOrdinalPosition++;
          params.FileType = FileType;
          params.Position = videoOrdinalPosition;
        }

        let doc = Regex.ReplaceJSONPlaceHolders(template, params);

        fileList.push(doc);
      });
    }

    return fileList;
  }
}

// Prop types checking
APIPayloadCreator.propTypes = {
  ExternalJobNumber: PropTypes.string.isRequired,
  DeponentFirstName: PropTypes.string,
  DeponentLastName: PropTypes.string,
  DepositionDate: PropTypes.instanceOf(Date),
  CaseName: PropTypes.string,
  CaseNumber: PropTypes.string,
  JobInputPath: PropTypes.string.isRequired,
  JobOutputPath: PropTypes.string.isRequired,
  OrderType: PropTypes.oneOf([
    FILE_SYNCING_CONSTANTS.ORDER_TYPES.QUICK_SYNC,
    FILE_SYNCING_CONSTANTS.ORDER_TYPES.MANUAL_SYNC
  ]).isRequired,
  FileList: PropTypes.object.isRequired,
  Priority: PropTypes.oneOf([1, 2, 3, 4]).isRequired,
  AssignedUserEmail: emailPropType.isRequired,
  ImageType: PropTypes.oneOf([1, 2, 3]),
  CreateImage: PropTypes.bool,
  ContactName: PropTypes.string,
  ContactEmail: PropTypes.string,
  ContactPhone: PropTypes.string,
  AllowedConfidenceLevelPercent: PropTypes.oneOf([7])
}

export default APIPayloadCreator;