import Logging from './../../utils/logging'
import FILE_STITCHING_CONSTANTS from './../../constants/file-stitching'
import { SUCCESS, ERROR, QUEUED, UPLOADING, PROCESSING } from './../../constants/list_item_statuses'
import AxiosHelper from './../../utils/axios-helper'
import { GET_STITCHING_JOB_STATUS_UPDATE } from './../../constants/action-types.js'
import { action } from './../../utils/action'
var store = window.store

class AxiosHelperGetStatusUpdate extends AxiosHelper {
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
    Logging.LogEach("AxiosHelperGetStatusUpdate.SuccessDetermineAPICallStatus.result:", result)
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
      errorMsgList.push( { ...result.data, errorMsg: result.data.error_message } )
    }

    this.errorMsgList = errorMsgList

    return newAPICallStatus
  }

  AxiosThenFailure(reason) {
    Logging.LogSectionStart()
    Logging.LogEach("AxiosHelperGetStatusUpdate.AxiosDetermineAPICallStatus.reason:", reason)
    Logging.LogSectionEnd()

    let newAPICallStatus = super.AxiosThenFailure(reason) 


    this.parentObject.failedAttemptsToGetUpdate++
    Logging.LogError(FILE_STITCHING_CONSTANTS.ERRORS.AXIOS_FAILURE_REASON, reason)

    this.SaveValuesToAnotherObject(this.parentObject)
    store.dispatch(action(GET_STITCHING_JOB_STATUS_UPDATE, newAPICallStatus))
  }

  SaveValuesToAnotherObject(otherObject){
    Logging.LogSectionStart()
    Logging.Log("AxiosHelperGetStatusUpdate.SaveValuesToAnotherObject")

    otherObject.jobStatusUpdate = this.result
    otherObject.fileStitchingStatus = this.APICallStatus
    otherObject.axiosSuccessResult = this.axiosSuccessResult
    otherObject.axiosFailureReason = this.axiosFailureReason
    otherObject.errorMsgList = this.errorMsgList

    Logging.LogEach("this.result: ", this.result)
    Logging.LogEach("otherObject:", otherObject)
    Logging.LogSectionEnd()
  }
}

export default AxiosHelperGetStatusUpdate