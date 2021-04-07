import { PROCESSING, UPLOADING, QUEUED, SUCCESS, ERROR, FAIL } from '../../constants/list_item_statuses'
import AxiosHelper from '../../utils/api-caller'
import Logging from '../../utils/logging'


class AxiosHelperCreateTeleStreamJobs extends AxiosHelper {
  async CallAPI(apiUrl, payload, method, headers, parentObject) {
    this.parentObject = parentObject
    await super.CallAPI(apiUrl, payload, method, headers)

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
    if(result.data.status.toLowerCase() === QUEUED.toLowerCase()) {
      newAPICallStatus = QUEUED
    }
    else if(result.data.status.toLowerCase() === PROCESSING.toLowerCase()) {
      newAPICallStatus =  PROCESSING
    }
    else if(result.data.status.toLowerCase() === SUCCESS.toLowerCase()) {
      newAPICallStatus = SUCCESS
    }
    else if(result.data.status.toLowerCase() === UPLOADING.toLowerCase()) {
      newAPICallStatus = UPLOADING 
    }
    else if (result.data.status.toLowerCase() === FAIL.toLowerCase()) {
      newAPICallStatus = ERROR
      this.parentObject.continuePollingForUpdates = false

      Logging.LogSectionStart("Mpeg1Converter.axiosHelperCreateTeleStreamJob.SuccessDetermineAPICallStatus. ERROR")
      Logging.log("result.data.status === fail", "result:", result)
      Logging.LogSectionEnd()
      
      errorMsgList.push( { ...result.data, errorMsg: result.data.error_message } )
    }
    else {
      newAPICallStatus = ERROR

      Logging.LogSectionStart("Mpeg1Converter.axiosHelperCreateTeleStreamJob.SuccessDetermineAPICallStatus. ERROR")
      Logging.log("result.data.status did not match known positive statuses", "result:", result)
      Logging.LogSectionEnd()

      errorMsgList.push( { ...result.data, errorMsg: result.data.error_message } )
    }

    this.errorMsgList = errorMsgList

    return newAPICallStatus
  }

  AxiosThenFailure(reason) {
    Logging.LogError("AxiosHelperCreateTeleStreamJobs.AxiosThenFailure. reason:", reason)

    this.SaveValuesToAnotherObject(this.parentObject)
  }

  SaveValuesToAnotherObject(otherObject) {
    otherObject.APICallResult_teleStreamJobCreation = JSON.parse(JSON.stringify(this.result))
    otherObject.APICallStatus_teleStreamJobCreation = this.APICallStatus
    otherObject.fileConversionStatus = this.APICallStatus
    otherObject.axiosSuccessResult_teleStreamJobCreation = { ...this.axiosSuccessResult }
    otherObject.axiosFailureReason_teleStreamJobCreation = { ...this.axiosFailureReason }
    otherObject.errorMsgList = [...this.errorMsgList]
  }
}

export default AxiosHelperCreateTeleStreamJobs