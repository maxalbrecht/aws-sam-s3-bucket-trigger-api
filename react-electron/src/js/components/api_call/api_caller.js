import axios from 'axios';

class APICaller {
  constructor(json) {
    try{
      console.log(`apicaller json:${json}`);
      this.clientAccessKey = this.getFileContent("./private/CLIENT_ACCESS_KEY.txt")
      this.apiUrl = `https://legal.yeslaw.net/api/AutoJobManager/AddJobToQueue?clientAccessKey=${this.clientAccessKey}`;
      this.result = this.CallAPI(this.apiUrl, this.json);
    }
    catch(e) {
      console.log(`Error in API Caller. Error: ${e}`);
      throw e;
    }
  }
  CallAPI(apiUrl, payload) { 
    let result = "";
    let resultData = "";
    try {
      axios.post(apiUrl, payload).then(res => {
        result = JSON.stringify(res);
        resultData = JSON.stringify(res.data);
        console.log(`api call response: ${result}`);
        console.log(`api call response data: ${resultData}`);
        alert(`api call response data: ${resultData}`);
      });
    }
    catch (e) {
      console.log(`Error calling api. Error: ${e}`);
      alert("Error calling API. Please check that all fields have been filled in correctly. If the issue persists, please contact application support.")
    }

    return result;
  }

  getFileContent(filePath){
    let fileContent = "";
    try {
      let fs = window.require('fs');
      fileContent = fs.readFileSync(filePath, 'utf8')
    }
    catch (e) {
      console.log(`Error trying to get File Content. Error: ${e}`);
      throw e;
    }

    return fileContent;
  }
}

export default APICaller;