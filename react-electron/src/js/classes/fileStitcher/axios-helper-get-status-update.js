import Logging from './../../utils/logging'
import FILE_STITCHING_CONSTANTS from './../../constants/file-stitching'
import { SUCCESS, ERROR, QUEUED, UPLOADING, PROCESSING, PREPARING } from './../../constants/list_item_statuses'
import ApiCaller from './../../utils/api-caller'
import { GET_STITCHING_JOB_STATUS_UPDATE } from './../../constants/action-types.js'
import { action } from './../../utils/action'
var store = window.store

class ApiCallerGetStatusUpdate extends ApiCaller {
  async CallAPI(apiUrl, payload, method, headers, parentObject) {
    this.parentObject = parentObject
    await super.CallAPI(apiUrl, payload, method, headers)
  }

  AxiosThenSuccess(result) {
    super.AxiosThenSuccess(result)

    let newAPICallStatus = this.SuccessDetermineAPICallStatus(result)
    this.APICallStatus = newAPICallStatus

    this.SaveValuesToAnotherObject(this.parentObject)
    store.dispatch(action(GET_STITCHING_JOB_STATUS_UPDATE, newAPICallStatus))
  }

  SuccessDetermineAPICallStatus(result) {
    let newAPICallStatus = ""
    let errorMsgList = []
    Logging.LogSectionStart()
    Logging.log("AxiosHelperGetStatusUpdate.SuccessDetermineAPICallStatus.result:", result)
    Logging.LogSectionEnd()

    if (result.data.status.toLowerCase() === QUEUED.toLowerCase()) {
      newAPICallStatus = QUEUED
      this.parentObject.failedAttemptsToGetUpdate = 0
      errorMsgList = []
    }
    else if (result.data.status.toLowerCase() === PROCESSING.toLowerCase()) {
      newAPICallStatus = PROCESSING
      this.parentObject.failedAttemptsToGetUpdate = 0
      errorMsgList = []
    }
    else if (result.data.status.toLowerCase() === PREPARING.toLowerCase()) {
      newAPICallStatus = PREPARING
      this.parentObject.failedAttemptsToGetUpdate = 0
      errorMsgList = []
    }
    else if (result.data.status.toLowerCase() === UPLOADING.toLowerCase()) {
      newAPICallStatus = UPLOADING
      this.parentObject.failedAttemptsToGetUpdate = 0
      errorMsgList = []
    }
    else if (result.data.status.toLowerCase() === SUCCESS.toLowerCase()) {
      newAPICallStatus = SUCCESS
      this.parentObject.continuePollingForUpdates = false
      errorMsgList = []
    }
    else {
      newAPICallStatus = ERROR
      this.parentObject.continuePollingForUpdates = false

      Logging.LogSectionStart("fileStitcher.axiosHelperCreateTeleStreamJob.SuccessDetermineAPICallStatus. ERROR")
      Logging.log("result.data.status did not match known positive statuses", "result:", result)
      Logging.LogSectionEnd()

      errorMsgList.push( { ...result.data, errorMsg: result.data.error_message } )
    }

    this.errorMsgList = errorMsgList

    return newAPICallStatus
  }

  AxiosThenFailure(reason) {
    Logging.LogSectionStart()
    Logging.log("AxiosHelperGetStatusUpdate.AxiosDetermineAPICallStatus.reason:", reason)
    Logging.LogSectionEnd()

    let newAPICallStatus = super.AxiosThenFailure(reason) 


    this.parentObject.failedAttemptsToGetUpdate++
    Logging.logError(FILE_STITCHING_CONSTANTS.ERRORS.AXIOS_FAILURE_REASON, reason)

    this.SaveValuesToAnotherObject(this.parentObject)
    store.dispatch(action(GET_STITCHING_JOB_STATUS_UPDATE, newAPICallStatus))
  }

  SaveValuesToAnotherObject(otherObject){
    Logging.LogSectionStart()
    Logging.log("AxiosHelperGetStatusUpdate.SaveValuesToAnotherObject")

    otherObject.jobStatusUpdate = this.result
    otherObject.fileStitchingStatus = this.APICallStatus
    otherObject.axiosSuccessResult = this.axiosSuccessResult
    otherObject.axiosFailureReason = this.axiosFailureReason
    otherObject.errorMsgList = this.errorMsgList

    Logging.log("this.result: ", this.result)
    Logging.log("otherObject:", otherObject)
    Logging.LogSectionEnd()
  }
}

export default ApiCallerGetStatusUpdate 