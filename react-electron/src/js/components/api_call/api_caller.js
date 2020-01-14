import axios from 'axios';

class APICaller {
  constructor(json) {
    try{
      console.log(`apicaller json:${json}`);
      this.clientAccessKey = this.getFileContent("./private/CLIENT_ACCESS_KEY.txt")
      this.apiUrl = `https://legal.yeslaw.net/api/AutoJobManager/AddJobToQueue?clientAccessKey=${this.clientAccessKey}`;
      this.result = this.CallAPI(this.apiUrl, json);
    }
    catch(e) {
      console.log(`Error in API Caller. Error: ${e}`);
      throw e;
    }
  }
  CallAPI(apiUrl, payload) { 
    let result = "";
    let resultData = "";
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        console.log(`axios request interceptor config:\n${JSON.stringify(config)}`);
        return config;
      }, function (error) {
        console.log(`axios request interceptor error:\n${error}`);
        console.log(`axios request interceptor error, stringified:\n${JSON.stringify(error)}`);
        // Do something with request error
        return Promise.reject(error);
      });
      
    console.log(`axios post payload:\n${payload}`);
    console.log("posting with axios...");
    try {
      axios({
        method: 'post',
        url: apiUrl,
        headers: { 'content-type': 'application/json' },
        data: payload
      }).then(res => {
        result = JSON.stringify(res);
        resultData = JSON.stringify(res.data);
        console.log(`api call response: ${result}`);
        console.log(`api call response data: ${resultData}`);
      });
      /*
      axios.post(
        apiUrl,
        payload
        { headers: { 'content-type': 'application/json' } }

      ).then(res => {
        result = JSON.stringify(res);
        resultData = JSON.stringify(res.data);
        console.log(`api call response:\n${result}`);
        console.log(`api call response data:\n${resultData}`);
      });
      */
    }
    catch (e) {
      console.log(`Error calling api. Error:\n${e}`);
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