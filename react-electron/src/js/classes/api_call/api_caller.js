import axios from 'axios';
import { API_CALL_FINISHED } from './../../constants/action-types.js';
import { action } from './../../utils/action';
import { STARTING_JOB, SUCCESS, ERROR, ERROR_API_NOT_RESOLVED } from './../../constants/list_item_statuses'
let store = window.store;

class APICaller {
  constructor(json, articleId, ...props) {
    this.CallAPI = this.CallAPI.bind(this);
    this.apiUrl = "";
    this.json = json;
    this.dateDisplay = "<<Date & Time>>";
    this.APICallStatus = STARTING_JOB;
    this.errorMsgList = [];
    try {
      let date_ob = new Date();
      let date = this.IntTwoChars(date_ob.getDate());
      let month = this.IntTwoChars(date_ob.getMonth() + 1);
      let year = date_ob.getFullYear();
      let hours = this.IntTwoChars(date_ob.getHours());
      let minutes = this.IntTwoChars(date_ob.getMinutes());
      let seconds = this.IntTwoChars(date_ob.getSeconds());
      let dateDisplay = `${hours}:${minutes}:${seconds} ${month}/${date}/${year}`;
      console.log(`Job submission time: ${dateDisplay}`);
      this.dateDisplay = dateDisplay;
    } catch (error) {
      console.log(`Error setting date display. Error: ${error}`);
    }

    try{
      this.clientAccessKey = this.getFileContent("./private/CLIENT_ACCESS_KEY.txt")
      this.apiUrl = `https://legal.yeslaw.net/api/AutoJobManager/AddJobToQueue?clientAccessKey=${this.clientAccessKey}`;
      this.result = this.CallAPI(this.apiUrl, this.json);
    }
    catch(e) {
      console.log(`Error in API Caller. Error: ${e}`);
      throw e;
    }
  }

  IntTwoChars(i) {
    return (`0${i}`).slice(-2);
  }

  CallAPI(apiUrl, payload) {
    // This is our redux action creator for the API_CALL_FINISHED action
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
      
    console.log(`axios API post payload:\n${payload}`);
    console.log("posting with axios...");
    try {
      return axios({
        method: 'post',
        url: apiUrl,
        headers: { 'content-type': 'application/json' },
        data: payload
      }).then(res => {
        let errorMsgList = res.data.data.result.errorMsgList;
        console.log("api call response errorMsgList:");
        console.log(errorMsgList);
        
        let newAPICallStatus = ""

        if(errorMsgList === undefined || errorMsgList === null) {
          newAPICallStatus = ERROR_API_NOT_RESOLVED;
        }
        else if (errorMsgList.length === 0) {
          newAPICallStatus = SUCCESS;
        } else {
          newAPICallStatus = ERROR;
        }

        this.APICallStatus = newAPICallStatus;
        this.errorMsgList = errorMsgList; 

        store.dispatch(action(API_CALL_FINISHED, newAPICallStatus));
      });
    }
    catch (e) {
      console.log(`Error calling api. Error:\n${e}`);
      alert("Error calling API. Please check that all fields have been filled in correctly. If the issue persists, please contact application support.")
    }
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