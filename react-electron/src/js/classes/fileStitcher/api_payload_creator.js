import api_payload_template from './api_payload_template'
import inputs_item_template from './inputs_item_template'

class APIPayloadCreator {
  constructor(
    externalJobNumber,
    fileList_raw,
    fileOrder,
    destinationFileName,
    assignedUserEmail,
    contactName,
    contactEmail,
    contactPhone
  ){
    console.log("debug1")
    this.state = {
      ExternalJobNumber: externalJobNumber,
      inputs: this.formatInputsObject(fileList_raw, fileOrder),
      FileOrder: fileOrder,
      DestinationFileName: destinationFileName,
      path_format: destinationFileName,
      AssignedUserEmail: assignedUserEmail,
      ContactName: contactName,
      ContactEmail: contactEmail,
      ContactPhone: contactPhone,
      fileStatus: "Starting",
    }
    console.log("debug2")
    this.formattedAPIPayload = this.ReplaceJSONPlaceHolders(api_payload_template, this.state)
  }

  formatInputsObject(fileList_raw, fileOrder){
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
          url: FileName
        }

        videoOrdinalPosition++
        let doc = this.ReplaceJSONPlaceHolders(inputs_item_template, params)

        inputs["input" + videoOrdinalPosition.toString()] = JSON.parse(doc)
      })
    }

    return inputs
  }

  ReplaceJSONPlaceHolders(jsonTemplate, ...args){
    //      This function should take a json template and a number of parameters.
    //      Each of the parameter is expected to be an object with one key-value pair.
    //      For each of the parameters, it should scan the json template and replace
    //      and any instances of the the parameter's placeholder with the
    //      parameter values, as well as any necessary formatting such as quotation marks.
    console.log("debug3")
    let finishedTemplate = JSON.stringify(jsonTemplate);
    console.log("finishedTemplate:")
    console.log(finishedTemplate)
    console.log("debug4")
    for (let arg of args) {
      for (let key in arg){
        if(arg.hasOwnProperty(key)){
          let argKey = key;
          let argValue = arg[argKey];

          console.log("argKey:")
          console.log(argKey)
          console.log("argValue:")
          console.log(argValue)

          if(argValue != null){
            finishedTemplate = 
              finishedTemplate
                .replace("\""+argKey+"_val\"", "\""+argValue+"\"" )
                .replace("\""+argKey+"_val_date\"", "\""+argValue+"\"" )
                .replace("\""+argKey+"_val_array\"", argValue)
                .replace("\""+argKey+"_val_int\"", argValue)
                .replace(
                  "\""+argKey+"_val_object\"",
                  JSON.stringify(argValue)
                    .replace("\\\"", "\"")
                    .replace("\"{", "{")
                    .replace("}\"", "}")
                )
                .replace("\"null\"", "null")
          }
        }
      }
    }
    console.log("debug5")

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

   SaveToFile(fileContent, filePath) {
    var fs = window.require('fs');
    try { 
      fs.writeFileSync(filePath, fileContent, 'utf-8'); 
    } 
    catch(e) { alert('Failed to save the payload file!');
      return console.log(e);
    }
  }
}

export default APIPayloadCreator