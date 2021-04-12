import Logging from './../../utils/logging'
import FILE_STITCHING_CONSTANTS from './../../constants/file-stitching'
import { SUCCESS, ERROR, QUEUED, UPLOADING, PROCESSING, PREPARING } from './../../constants/list_item_statuses'
import AxiosHelper from './../../utils/api-caller'
import { FILE_STITCHING_QUEUED } from './../../constants/action-types.js'
import { action } from './../../utils/action'
var store = window.store

class AxiosHelperCreateJob extends AxiosHelper {
  async CallAPI(apiUrl, payload, method, headers, parentObject) {
    this.parentObject = parentObject
    await super.CallAPI(apiUrl, payload, method, headers)
  }

  AxiosThenSuccess(result) {
    super.AxiosThenSuccess(result)

    let newAPICallStatus = this.SuccessDetermineAPICallStatus(result)
    this.APICallStatus = newAPICallStatus

    this.SaveValuesToAnotherObject(this.parentObject)
    store.dispatch(action(FILE_STITCHING_QUEUED, newAPICallStatus))
  }

  SuccessDetermineAPICallStatus(result) {
    let newAPICallStatus = ""
    let errorMsgList = []

    if(result.data.status.toLowerCase() === QUEUED.toLowerCase()){
      newAPICallStatus = QUEUED
    }
    else if (result.data.status.toLowerCase() === PROCESSING.toLowerCase()) {
      newAPICallStatus = PROCESSING
      errorMsgList = []
    }
    else if (result.data.status.toLowerCase() === PREPARING.toLowerCase()) {
      newAPICallStatus = PREPARING
      this.parentObject.failedAttemptsToGetUpdate = 0
      errorMsgList = []
    }
    else if (result.data.status.toLowerCase() === UPLOADING.toLowerCase()) {
      newAPICallStatus = UPLOADING
      errorMsgList = []
    }
    else if (result.data.status.toLowerCase() === SUCCESS.toLowerCase()) {
      newAPICallStatus = SUCCESS
      errorMsgList = []
    }
    else {
      newAPICallStatus = ERROR

      Logging.LogSectionStart("fileStitcher.axiosHelperCreateTeleStreamJob.SuccessDetermineAPICallStatus. ERROR")
      Logging.log("result.data.status did not match known positive statuses", "result:", result)
      Logging.LogSectionEnd()

      errorMsgList.push( { ...result.data, errorMsg: result.data.error_message } )
    }
    /*
    else if (1===2) {
      newAPICallStatus = SUCCESS
    }
    */

    this.errorMsgList = errorMsgList

    return newAPICallStatus
  }

  AxiosThenFailure(reason) {
    let newAPICallStatus = super.AxiosThenFailure(reason) 

    Logging.logError(FILE_STITCHING_CONSTANTS.ERRORS.AXIOS_FAILURE_REASON, reason)

    this.SaveValuesToAnotherObject(this.parentObject)
    store.dispatch(action(FILE_STITCHING_QUEUED, newAPICallStatus))
  }
  
  SaveValuesToAnotherObject(otherObject){
    otherObject.result = this.result
    otherObject.fileStitchingStatus = this.APICallStatus
    otherObject.axiosSuccessResult = this.axiosSuccessResult
    otherObject.axiosFailureReason = this.axiosFailureReason
    otherObject.errorMsgList = this.errorMsgList
  }
}

export default AxiosHelperCreateJob