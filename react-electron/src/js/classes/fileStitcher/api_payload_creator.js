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
    contactPhone,
    templateId
  ){
    try {
      this.FileUrlBase = "s3://vxtprod/"
      this.subfolders = this.getSubfolders(fileList_raw)

      this.state = {
        ExternalJobNumber: externalJobNumber,
        inputs: this.formatInputsObject(fileList_raw, fileOrder, this.FileUrlBase, externalJobNumber, this.subfolders),
        FileOrder: fileOrder,
        DestinationFileName: destinationFileName,
        //path_format: this.FileUrlBase + externalJobNumber + "/" + destinationFileName,
        path_format: externalJobNumber + "/" + this.subfolders + destinationFileName,
        //path_format: destinationFileName,
        AssignedUserEmail: assignedUserEmail,
        ContactName: contactName,
        ContactEmail: contactEmail,
        ContactPhone: contactPhone,
        fileStatus: "Starting",
        template_id: templateId
      }

      this.formattedAPIPayload = this.ReplaceJSONPlaceHolders(api_payload_template, this.state)
    } catch (error) {
      console.log(`Error instanciating APIPayloadCreator. Error ${error}`)
    }
  }

  getSubfolders(fileList_raw){
    let subfolders = ""

    if( fileList_raw.docs !== undefined && Object.keys(fileList_raw.docs).length > 0){
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
        let doc = this.ReplaceJSONPlaceHolders(inputs_item_template, params)

        inputs["input" + videoOrdinalPosition.toString()] = JSON.parse(doc)
      })
    }

    return inputs
  }

  ReplaceJSONPlaceHolders(jsonTemplate, ...args){
    //      This function should take a json template and a number of parameters.
    //      Each of the parameters is expected to be an object with one key-value pair.
    //      For each of the parameters, it should scan the json template and replace
    //      any instances of the the parameter's placeholder with the
    //      parameter values, as well as any necessary formatting, such as quotation marks.
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
    let fs = window.require('fs');
    try { 
      fs.writeFileSync(filePath, fileContent, 'utf-8'); 
    } 
    catch(e) { alert('Failed to save the payload file!');
      return console.log(e);
    }
  }
}

export default APIPayloadCreator