import Logging from './logging'
import FILE_STITCHING_CONSTANTS from './../constants/file-stitching'
import { SUCCESS, ERROR } from './../constants/list_item_statuses'
import AXIOS_CONSTANTS from './../constants/axios-constants'
import axios from 'axios'

class AxiosHelper {
  async CallAPI(apiUrl, payload, method, headers) {
    try {
      await this.SetReduxActionCreatorAndAddRequestInterceptor()
      Logging.LogEach(`axios API post payload:`, payload, "posting with axios...")

      return await this.ReturnAxios(apiUrl, payload, method, headers)
    }
    catch(e) {
      Logging.LogAndThrowError(FILE_STITCHING_CONSTANTS.ERRORS.ERROR_IN_FILE_STITCHER, e)
    }
  }

  SetReduxActionCreatorAndAddRequestInterceptor(){
    // This is our redux action creator for API_CALL_FINISHED action
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      Logging.LogEach(`axios request interceptor config:`, JSON.stringify(config))
      return config
    }, function (error) {
      Logging.LogError(AXIOS_CONSTANTS.ERRORS.ERROR_CALL_API_METHOD, error)
      Logging.LogError(`${AXIOS_CONSTANTS.ERRORS.ERROR_CALL_API_METHOD} stringified:`, JSON.stringify(error))
      // Do something with request error
      return Promise.reject(error)
    })
  }

  async ReturnAxios(apiUrl, payload, method, headers){
    try {
      let finalResult

      await axios({
        method: method,
        url: apiUrl,
        headers: headers,
        data: payload
      }).then(
        (result) => { finalResult = result; this.AxiosThenSuccess(result) },
        (reason) => { finalResult = reason; this.AxiosThenFailure(reason) }
      )

      Logging.LogEach("axios-helper ReturnAxios finalResult:", finalResult)

      this.result = finalResult

      return {
        result: this.result,
        newAPICallStatus: this.APICallStatus,
        axiosSuccessResult: this.axiosSuccessResult,
        axiosFailureReason: this.axiosFailureReason,
        errorMsgList: this.errorMsgList
      }
    }
    catch (e) {
      Logging.LogError(AXIOS_CONSTANTS.ERRORS.ERROR_RETURN_AXIOS_METHOD, e)
      alert(AXIOS_CONSTANTS.ALERTS.ERROR_CALLING_API)
    }
  }

  AxiosThenSuccess(result) {
    let newAPICallStatus = SUCCESS
    this.result = result
    this.axiosSuccessResult = result
    this.APICallStatus = newAPICallStatus
    this.errorMsgList = [] //errorMsgList
  }

  AxiosThenFailure(reason) {
    let newAPICallStatus = ERROR

    this.axiosFailureReason = reason
    this.result = reason
    this.APICallStatus = newAPICallStatus 
  }


}

export default AxiosHelper