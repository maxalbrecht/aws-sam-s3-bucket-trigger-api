import Logging from './logging'
import FILE_STITCHING_CONSTANTS from './../constants/file-stitching'
import { SUCCESS, ERROR } from './../constants/list_item_statuses'
import API_CALLER_CONSTANTS from './../constants/api-caller'
import AXIOS_CONSTANTS from './../constants/axios-constants'
import axios from 'axios'
import defined from './defined'

class ApiCaller {
  async CallAPI(apiUrl, payload, method, headers,
    utilityToCallAPIWith = API_CALLER_CONSTANTS.OPTIONS_FOR_UTILITIES_WITH_WHICH_TO_CALL_API.AXIOS,
    referer = API_CALLER_CONSTANTS.REFERER.USE_DEFAULT
  ) {
    if(utilityToCallAPIWith  === API_CALLER_CONSTANTS.OPTIONS_FOR_UTILITIES_WITH_WHICH_TO_CALL_API.FETCH) {
      try {
        return await this.ReturnFetch(apiUrl, payload, method, headers, referer)
      } catch(error) {
        Logging.logAndThrowError("AxiosHelper.CallAPI() utilityToCallAPIWith === FETCH. ERROR", error)
      }
    }
    else {
      try {
        await this.SetReduxActionCreatorAndAddRequestInterceptor()
        Logging.log(`axios API post payload:`, payload, "posting with axios...")

        return await this.ReturnAxios(apiUrl, payload, method, headers)
      }
      catch(e) {
        Logging.logAndThrowError(FILE_STITCHING_CONSTANTS.ERRORS.ERROR_IN_FILE_STITCHER, e)
      } 
    }
  }

  SetReduxActionCreatorAndAddRequestInterceptor(){
    // This is our redux action creator for API_CALL_FINISHED action
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      Logging.log("axios request interceptor config:", config)

      return config
    }, function (error) {
      Logging.logError(AXIOS_CONSTANTS.ERRORS.ERROR_CALL_API_METHOD, error)
      Logging.logError(`${AXIOS_CONSTANTS.ERRORS.ERROR_CALL_API_METHOD} stringified:`, JSON.stringify(error))
      // Do something with request error
      return Promise.reject(error)
    })
  }

  async ReturnFetch(apiUrl, payload, method, headers, referer) {
    try {
      let options = {
        method: method,
        headers: headers
      }

      if(defined(payload) && method !== 'get') {
        options.body = payload
      }

      if(!defined(referer) || referer === API_CALLER_CONSTANTS.REFERER.DO_NOT_SEND_HEADER || referer === "") {
        options.referrer = ""
      }
      else if(referer !== API_CALLER_CONSTANTS.REFERER.USE_DEFAULT) {
        options.referrer = referer
      }

      await fetch(apiUrl, options)
        .then(async (response) => {
          response.bodyAsJson = await response.json()
          this.result = response

          if(response.ok) {
            this.AxiosThenSuccess(response)
          }
          else {
            this.AxiosThenFailure(response)
          }
        }) 
        .catch(async (reason) => {
          //reason.bodyAsJson = await reason.json()
          this.result = reason

          this.AxiosThenFailure(reason)
        })

      return {
        result: this.result,
        newAPICallStatus: this.APICallStatus,
        axiosSuccessResult: this.axiosSuccessResult,
        axiosFailureReason: this.axiosFailureReason,
        errorMsgList: this.errorMsgList
      }
    }
    catch (e) {
      Logging.logError(AXIOS_CONSTANTS.ERRORS.ERROR_RETURN_AXIOS_METHOD, e)
      alert(AXIOS_CONSTANTS.ALERTS.ERROR_CALLING_API)
    }
  }

  async ReturnAxios(apiUrl, payload, method, headers){
    try {
      let finalResult
      let axiosConfig = {
        method: method,
        url: apiUrl,
        headers: headers,
        data: payload
      }

      Logging.log("axios config:", axiosConfig)

      await axios(axiosConfig).then(
        (result) => { finalResult = result; this.AxiosThenSuccess(result) },
        (reason) => { finalResult = reason; this.AxiosThenFailure(reason) }
      )

      Logging.log("axios-helper ReturnAxios finalResult:", finalResult)

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
      Logging.logError(AXIOS_CONSTANTS.ERRORS.ERROR_RETURN_AXIOS_METHOD, e)
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

export default ApiCaller