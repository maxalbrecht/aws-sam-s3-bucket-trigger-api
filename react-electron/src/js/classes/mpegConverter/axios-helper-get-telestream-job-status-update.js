import ApiCaller from '../../utils/api-caller'
import { SUCCESS, ERROR, FAIL, QUEUED, UPLOADING, PROCESSING, PREPARING, DOWNLOADING } from './../../constants/list_item_statuses'
import Logging from './../../utils/logging'
import API_CALLER_CONSTANTS from './../../constants/api-caller'

class ApiCallerGetTeleStreamJobStatusUpdate extends ApiCaller {
  async CallAPI(apiUrl, payload, method, headers, parentObject, 
    utilityToCallAPIWith = API_CALLER_CONSTANTS.OPTIONS_FOR_UTILITIES_WITH_WHICH_TO_CALL_API.FETCH,
    referer = API_CALLER_CONSTANTS.REFERER.DO_NOT_SEND_HEADER
  ) {
    this.parentObject = parentObject
    await super.CallAPI(apiUrl, payload, method, headers, utilityToCallAPIWith, referer)

    return this.parentObject
  }

  AxiosThenSuccess(result) {
    super.AxiosThenSuccess(result)

    let newAPICallStatus = this.SuccessDetermineAPICallStatus(result)
    this.APICallStatus = newAPICallStatus

    this.SaveValuesToAnotherObject(this.parentObject)
  }

  SuccessDetermineAPICallStatus(result) {
    let newAPICallStatus = ""
    let errorMsgList = []
    Logging.LogSectionStart("display AxiosHelperGetStatusUpdate.SuccessDetermineAPICallStatus.result:")
    Logging.log("AxiosHelperGetStatusUpdate.SuccessDetermineAPICallStatus.result:", result)
    Logging.LogSectionEnd()

    //let data = result.bodyAsJson.encodings[0]
    let data = result.bodyAsJson

    if (data.status.toLowerCase() === QUEUED.toLowerCase()) {
      newAPICallStatus = QUEUED
      this.parentObject.failedAttemptsToGetUpdate = 0
      errorMsgList = []
    }
    else if (data.status.toLowerCase() === DOWNLOADING.toLowerCase()) {
      newAPICallStatus = DOWNLOADING
      this.parentObject.failedAttemptsToGetUpdate = 0
      errorMsgList = []
    }
    else if (data.status.toLowerCase() === PREPARING.toLowerCase()) {
      newAPICallStatus = PREPARING
      this.parentObject.failedAttemptsToGetUpdate = 0
      errorMsgList = []
    }
    else if (data.status.toLowerCase() === PROCESSING.toLowerCase()) {
      newAPICallStatus = PROCESSING
      this.parentObject.failedAttemptsToGetUpdate = 0
      errorMsgList = []
    }
    else if (data.status.toLowerCase() === UPLOADING.toLowerCase()) {
      newAPICallStatus = UPLOADING
      this.parentObject.failedAttemptsToGetUpdate = 0
      errorMsgList = []
    }
    else if (data.status.toLowerCase() === SUCCESS.toLowerCase()) {
      newAPICallStatus = SUCCESS
      this.parentObject.continuePollingForUpdates = false
      errorMsgList = []
    }
    else if (data.status.toLowerCase() === FAIL.toLowerCase()) {
      newAPICallStatus = ERROR
      this.parentObject.continuePollingForUpdates = false

      Logging.LogSectionStart("MpegConverter.axiosHelperGetTeleStreamJobStatusUpdate.SuccessDetermineAPICallStatus. ERROR")
      Logging.log("result.data.status === fail", "result:", result)
      Logging.LogSectionEnd()
      
      errorMsgList.push( { ...data, errorMsg: data.error_message } )
    }
    else {
      newAPICallStatus = ERROR
      this.parentObject.continuePollingForUpdates = false

      Logging.LogSectionStart("MpegConverter.axiosHelperGetTeleStreamJobStatusUpdate.SuccessDetermineAPICallStatus. ERROR")
      Logging.log("data.status did not match known positive statuses", "result:", result)
      Logging.LogSectionEnd()
      
      errorMsgList.push( { ...data, errorMsg: data.error_message } )
    }

    this.errorMsgList = errorMsgList

    return newAPICallStatus
  }

  AxiosThenFailure(reason) {
    Logging.LogSectionStart("AXIOS HELPER GET TELESTREAM JOB STATUS UPDATE. AxiosThenFailure()")
    Logging.log("AxiosHelperCreateTeleStreamJobs.AxiosThenFailure. reason:", reason)

    super.AxiosThenFailure(reason) 


    this.parentObject.failedAttemptsToGetUpdate++
    this.SaveValuesToAnotherObject(this.parentObject)
    Logging.LogSectionEnd()
  }

SaveValuesToAnotherObject(otherObject) {
    otherObject.APICallResult_teleStreamGetJobStatusUpdate = this.result
    otherObject.APICallStatus_teleStreamGetJobStatusUpdate = this.APICallStatus
    otherObject.fileConversionStatus = this.APICallStatus
    otherObject.axiosSuccessResult_teleStreamGetJobStatusUpdate = this.axiosSuccessResult
    otherObject.axiosFailureReason_teleStreamGetJobStatusUpdate = this.axiosFailureReason
    otherObject.errorMsgList = this.errorMsgList

    Logging.LogSectionStart("AXIOS HELPER GET TELESTREAM JOB STATUS UPDATE. SAVED VALUES TO OTHER OBJECT.")
    Logging.log("otherObject:", otherObject)
    Logging.LogSectionEnd()
  }
}

export default ApiCallerGetTeleStreamJobStatusUpdate