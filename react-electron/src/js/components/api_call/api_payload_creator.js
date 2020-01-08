import PropTypes from 'prop-types';
import emailPropType from 'email-prop-type';

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
    createImage,
    contactName,
    contactEmail,
    contactPhone,
    allowedConfidenceLevelPercent,
    fileOrder
  }) {
    this.state = {
      ExternalJobNumber: externalJobNumber,
      DeponentFirstName: deponentFirstName,
      DeponentLastName: deponentLastName,
      DepositionDate: depositionDate,
      CaseName: caseName,
      CaseNumber: caseNumber,
      JobInputPath: jobInputPath,
      OrderType: orderType,
      FileList: this.formatFileList(fileList_raw, fileOrder),
      Priority: priority,
      AssignedUserEmail: assignedUserEmail,
      ImageType: imageType,
      CreateImage: createImage,
      ContactName: contactName,
      ContactEmail: contactEmail,
      ContactPhone: contactPhone,
      AllowedConfidenceLevelPercent: allowedConfidenceLevelPercent,
      jobStatus: "Starting",
      fileOrder: fileOrder
    }
    let api_payload_template = this.getFileContent("./src/js/components/api_call/api_payload_template.json");
    let formattedAPIPayload = this.ReplaceJSONPlaceHolders(api_payload_template, this.state)

    this.SaveToFile(formattedAPIPayload, "./Output/" + externalJobNumber + "_payload.json");
  }

  SaveToFile(fileContent, filePath){
    var fs = window.require('fs');
    try { 
      fs.writeFileSync(filePath, fileContent, 'utf-8'); 
    } 
    catch(e) { alert('Failed to save the payload file!');
      return console.log(e);
    }
  }
  ReplaceJSONPlaceHolders(jsonTemplate, ...args){
    //      This function should take a json template and a number of parameters.
    //      Each of the parameter is expected to be an object with one key-value pair.
    //      For each of the parameters, it should scan the json template and replace
    //      and any instances of the the parameter's placeholder with the
    //      parameter values, as well as any necessary formatting such as quotation marks.
    let finishedTemplate = jsonTemplate;
    for (let arg of args) {
      for (let key in arg){
        if(arg.hasOwnProperty(key)){
          let argKey = key;
          let argValue = arg[argKey];
          finishedTemplate = 
            finishedTemplate
              .replace("\""+argKey+"_val\"", "\""+argValue+"\"" )
              .replace("\""+argKey+"_val_date\"", "\""+argValue+"\"" )
              .replace("\""+argKey+"_val_array\"", argValue)
              .replace("\""+argKey+"_val_int\"", argValue)
        }
      }
    }

    return finishedTemplate;
  }

  getFileContent(filePath){
    let fileContent = "";
    let fs = window.require('fs');
    fileContent = fs.readFileSync(filePath, 'utf8')

    return fileContent;
  }
  
  getFileSize(filePath){
    let fs = window.require("fs"); //Load the filesystem module
    try{
    let stats = fs.statSync(filePath);let fileSizeInBytes = stats["size"]
    let fileSizeInKilobytes = fileSizeInBytes / 1000.0

    return fileSizeInKilobytes + " KB";
    }
    catch(err) {
      console.log("Error getting file size. Error: " + err);
      alert("Error getting file size. Please check that the file exists.");
    }
  }

  formatFileList(fileList_raw, fileOrder) {
    let file_list_item_template = this.getFileContent("./src/js/components/api_call/file_list_item_template.json");
    let fileList = [];
    console.log("files in order:")
    fileOrder.forEach((file) => {
      console.log(file);
      console.log("fileList_raw.docs");
      console.log(fileList_raw.docs);
      console.log("fileList_raw.docs[file]");
      console.log(fileList_raw.docs[file]);
      let value = fileList_raw.docs[file];

      let docValue = value.content;
      let docValueSplit = docValue.split('\\');
      let FileName = docValueSplit[docValueSplit.length - 1];
      let FileType = "Transcript";
      let FileSize = this.getFileSize(docValue);
      let FilePath = docValue;
      let params = {
        FileType: FileType,
        FileName: FileName,
        FileSize: FileSize,
        FilePath: FilePath
      }
      let doc = this.ReplaceJSONPlaceHolders(file_list_item_template, params);

      fileList.push(doc);
    });

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
  OrderType: PropTypes.oneOf(["QuickSync", "Normal"]).isRequired,
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