import axios from 'axios'
import { API_CALL_FINISHED } from './../../constants/action-types.js'
import { action } from './../../utils/action'
import { STARTING_JOB, SUCCESS, ERROR, ERROR_API_NOT_RESOLVED } from './../../constants/list_item_statuses'
import ApiPayloadCreator from './api_payload_creator'
var store = window.store

class FileStitcher {
  constructor(
    externalJobNumber,
    fileList_raw,
    fileOrder,
    destinationFileName,
    assignedUserEmail,
    contactName,
    contactEmail,
    contactPhone,
    fileId,
    ...props
  ) {
    this.externalJobNumber = externalJobNumber 
    this.fileList_raw = fileList_raw 
    this.fileOrder = fileOrder
    this.destinationFileName = destinationFileName 
    this.assignedUserEmail = assignedUserEmail 
    this.contactName = contactName 
    this.contactEmail = contactEmail 
    this.contactPhone = contactPhone 
    this.fileId = fileId 
    
    console.log("FileStitcher.constructor.destinationFileName:")
    console.log(destinationFileName)
    this.CallAPI = this.CallAPI.bind(this)
    this.factoryId = "e725b4c22c6d5fc48085514fc114b23c"
    this.apiUrl = `https://api.cloud.telestream.net/starfish/v1.0/factories/${this.factoryId}/jobs`
    
    try {
      this.APIKey = this.getFileContent(".//private/SF_API_KEY.txt")
    } catch (error) {
      console.log("Error getting API key.")
    }

    try {
      this.ApiPayloadCreator = new ApiPayloadCreator(
        externalJobNumber,
        fileList_raw,
        fileOrder,
        destinationFileName,
        assignedUserEmail,
        contactName,
        contactEmail,
        contactPhone
      )
    } catch (error) {
      console.log(`Error instanciating APIPayloadCreator. Error ${error}`)
    }

    try {
      this.dateDisplay = "<<Date & Time>>"
      this.APICallStatus = STARTING_JOB
      this.axiosSuccessResult = {}
      this.axiosFailureReason = {}
      this.errorMsgList = []

      let date_ob = new Date()
      this.milliseconds = date_ob.getTime()
      let date = this.IntTwoChars(date_ob.getDate())
      let month = this.IntTwoChars(date_ob.getMonth() + 1)
      let year = date_ob.getFullYear()
      let hours = this.IntTwoChars(date_ob.getHours())
      let minutes = this.IntTwoChars(date_ob.getMinutes())
      let seconds = this.IntTwoChars(date_ob.getSeconds())
      let dateDisplay = `${hours}:${minutes}:${seconds} ${month}/${date}/${year}`
      console.log(`File Stitching Submission Time: ${dateDisplay}`)
      this.dateDisplay = dateDisplay
    } catch (error) {
      console.log(`Error setting date display. Error ${error}`)
    }

    try {
      this.result = this.CallAPI(
        this.apiUrl,
        this.ApiPayloadCreator.formattedAPIPayload,
        this.APIKey
      )

      console.log("files Stitcher CallAPI result:")
      console.log(JSON.stringify(this.result))
    }
    catch(e) {
      console.log(`Error in FileStitcher. Error: ${e}`)
      throw e
    }
  }

  IntTwoChars(i){
    return (`0${i}`).slice(-2)
  }

  getFileContent(filePath) {
    let fileContent = ""
    try {
      let fs = window.require('fs')
      fileContent = fs.readFileSync(filePath, 'utf8')
    }
    catch(e){
      console.log(`Error trying to get File Content. Error: ${e}`)
      throw e
    }

    return fileContent
  }

  AxiosThenSuccess(result) {
    console.log("############################################################")
    console.log("fileStitcher.CallApi.axiosResult:")
    console.log(result)

    let newAPICallStatus = ""
    this.axiosSuccessResult = result

    if(this.axiosSuccessResult.status === 200){
      newAPICallStatus = SUCCESS
    } else {
      newAPICallStatus = ERROR
    }








    this.APICallStatus = newAPICallStatus
    this.errorMsgList = {} //errorMsgList

    store.dispatch(action(API_CALL_FINISHED, newAPICallStatus))
  }

  AxiosThenFailure(reason) {
    console.log("fileStitcher.CallApi.axiosFailureReason:")
    console.log(reason)

    this.axiosFailureReason = reason
    this.APICallStatus = ERROR

    store.dispatch(action(API_CALL_FINISHED, this.APICallStatus))
  }

  CallAPI(apiUrl, payload, APIKey) {
    // This is our redux action creator for API_CALL_FINISHED action
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      console.log(`axios request interceptor config:\n${JSON.stringify(config)}`)
      return config
    }, function (error) {
      console.log(`axios request interceptor error:\n${error}`)
      console.log(`axios request interceptor error, stringified:\n${JSON.stringify(error)}`)
      // Do something with request error
      return Promise.reject(error)
    })

    console.log(`axios API post payload:\n${payload}`)
    console.log("posting with axios...")

    try {
      return axios({
        method: 'post',
        url: apiUrl,
        headers: { 
          //'content-type': 'application/json',
          'X-Api-Key': APIKey
        },
        data: payload
      }).then(
        (result) => { this.AxiosThenSuccess(result) },
        (reason) => { this.AxiosThenFailure(reason) }
      )
    }
    catch (e) {
      console.log(`Error calling api. Error:\n${e}`)
      alert("error calling API. Please check that all fields have been filled in correctly. If the issue persists, please contact application support")
    }
  }
}

export default FileStitcher