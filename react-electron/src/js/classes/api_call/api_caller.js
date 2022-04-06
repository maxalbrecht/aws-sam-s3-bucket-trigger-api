import axios from 'axios';
import APIPayloadCreator from "./../../classes/api_call/api_payload_creator"
import { API_CALL_FINISHED } from './../../constants/action-types.js';
import { action } from './../../utils/action';
import { STARTING_JOB, SUCCESS, ERROR, ERROR_API_NOT_RESOLVED } from './../../constants/list_item_statuses'
import DateUtils from './../../utils/date-utils'
import File from './../../utils/file'
import Logging from './../../utils/logging'
import FILE_SYNCING_CONSTANTS from './../../constants/file-syncing'
var store = window.store;

class APICaller {
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
    this.CallAPI = this.CallAPI.bind(this)
    this.apiUrl = ""

    this.APIPayloadCreator = new APIPayloadCreator({
      externalJobNumber: externalJobNumber,
      deponentFirstName: deponentFirstName,
      deponentLastName: deponentLastName,
      depositionDate: depositionDate,
      caseName: caseName,
      caseNumber: caseNumber,
      jobInputPath: jobInputPath,
      jobOutputPath: jobOutputPath,
      orderType: orderType,
      fileList_raw: fileList_raw,
      priority: priority,
      assignedUserEmail: assignedUserEmail,
      imageType: imageType,
      imageBranding: imageBranding,
      createImage: createImage,
      contactName: contactName,
      contactEmail: contactEmail,
      contactPhone: contactPhone,
      allowedConfidenceLevelPercent: allowedConfidenceLevelPercent,
      fileOrder: fileOrder,
      notes: notes
    })

    this.json = this.APIPayloadCreator.formattedAPIPayload
    this.dateDisplay = FILE_SYNCING_CONSTANTS.DATE_DISPLAY_DEFAULT
    this.APICallStatus = STARTING_JOB
    this.errorMsgList = []
    this.dateDisplay = DateUtils.GetDateDisplay()
    Logging.log(`File Syncing Submission Time: ${this.dateDisplay}`)

    try{
      this.clientAccessKey = File.getContent(FILE_SYNCING_CONSTANTS.CLIENT_ACCESS_KEY_FILE)
      ///this.clientAccessKey = File.getContent(FILE_SYNCING_CONSTANTS.CLIENT_ACCESS_KEY_QA_FILE)
      this.apiUrl = `${FILE_SYNCING_CONSTANTS.API.URL_BASE}${this.clientAccessKey}`
      this.result = this.CallAPI(this.apiUrl, this.json)
    }
    catch(e) {
      Logging.logAndThrowError("Error in API Caller. Error:", e)
    }
  }

  CallAPI(apiUrl, payload) {
    // This is our redux action creator for the API_CALL_FINISHED action
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      Logging.log(`axios request interceptor config:\n${JSON.stringify(config)}`)
      return config;
    }, function (error) {
      Logging.log(`axios request interceptor error:`, error)
      Logging.log(`axios request interceptor error, stringified:`, JSON.stringify(error))
      // Do something with request error
      return Promise.reject(error)
    });
      
    Logging.log(`axios API post payload:`, payload, "posting with axios...");
    try {
      return axios({
        method: FILE_SYNCING_CONSTANTS.API.METHOD,
        url: apiUrl,
        headers: FILE_SYNCING_CONSTANTS.API.HEADERS,
        //headers: { 'content-type': 'application/json' },
        data: payload
      }).then(res => {
        let errorMsgList = res.data.data.result.errorMsgList
        Logging.log("api call response errorMsgList:", errorMsgList)
        
        let newAPICallStatus = ""

        if(errorMsgList === undefined || errorMsgList === null) {
          newAPICallStatus = ERROR_API_NOT_RESOLVED;
        }
        else if (errorMsgList.length === 0) {
          newAPICallStatus = SUCCESS
        } else {
          newAPICallStatus = ERROR
        }

        this.APICallStatus = newAPICallStatus
        this.errorMsgList = errorMsgList

        store.dispatch(action(API_CALL_FINISHED, newAPICallStatus))
      })
    }
    catch (e) {
      Logging.logError(`Error calling api. Error:`, e)
      alert("Error calling API. Please check that all fields have been filled in correctly. If the issue persists, please contact application support.")
    }
  }
}

export default APICaller;