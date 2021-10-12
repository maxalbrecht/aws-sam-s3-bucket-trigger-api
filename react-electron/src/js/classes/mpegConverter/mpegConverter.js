import AxiosHelperCreateTeleStreamJob from './axios-helper-create-telestream-job'
import AxiosHelperGetTeleStreamJobStatusUpdate from './axios-helper-get-telestream-job-status-update'
import { MPEG_CONVERSION_THIRD_PARTY_JOB_CREATED, RECEIVED_MPEG_CONVERSION_JOB_UPDATE } from '../../constants/action-types';
import Logging from './../../utils/logging'
import File from './../../utils/file'
import DateUtils from './../../utils/date-utils'
import { STARTING_JOB } from './../../constants/list_item_statuses'
import  MPEG_CONVERSION_CONSTANTS from './../../constants/mpeg-conversion'
import APIPayloadCreator from './api-payload-creator';
import defined from '../../utils/defined';
import { action } from './../../utils/action'
import { PROCESSING, SUCCESS, ERROR } from '../../constants/list_item_statuses'
//import { FAILURE, SUCCESS } from '../../constants/cssClassNames';
var store = window.store
const AWS = require("aws-sdk");

var config
try {
  config = JSON.parse(File.getContent(MPEG_CONVERSION_CONSTANTS.CONFIG_FILE))
}
catch(error){
  Logging.logError("Error trying to initialize mpegConverter's config. Error:", error)
}

class MpegConverter {
  constructor(
    veriSuiteJobNumber,
    fileList_raw,
    fileOrder,
    assignedUserEmail,
    contactName,
    contactEmail,
    contactPhone,
    veriSuiteJobId,
    ...props
  ) {
    SaveParameters(this)
    Initialize(this)

    CallJobCreationAPIAndStartPolling(this)

    async function CallJobCreationAPIAndStartPolling(thisMpegConverter) {
      let mpegConversionStatus = PROCESSING
      let allSuccess = true
      let anyError = false

      for (let i = 0; i < thisMpegConverter.fileList.length; i++) {
        let currentFileObject = thisMpegConverter.fileList[i];
        let source_url = await thisMpegConverter.GenerateSignedUrlForS3Object(thisMpegConverter.veriSuiteJobNumber, currentFileObject.fileName, thisMpegConverter.subfolders)
        Logging.log("#################################################################", "#################################################################", "#################################################################", "source_url:", source_url)
        let path_format = `${thisMpegConverter.veriSuiteJobNumber}/${thisMpegConverter.subfolders}${File.removeFileExtension(currentFileObject.fileName)}`
        let formattedAPIPayload = thisMpegConverter.APIPayloadCreator.GetFormattedAPIPayload(source_url, path_format)
        Logging.log("#################################################################", "formattedAPIPayload:", formattedAPIPayload)
        
        currentFileObject = await thisMpegConverter.AxiosHelper_createTeleStreamJobs.CallAPI(
          MPEG_CONVERSION_CONSTANTS.CREATE_TELESTREAM_JOB_API.URL,
          formattedAPIPayload,
          MPEG_CONVERSION_CONSTANTS.CREATE_TELESTREAM_JOB_API.METHOD,
          { 
            [MPEG_CONVERSION_CONSTANTS.CREATE_TELESTREAM_JOB_API.HEADER_NAMES.X_API_KEY]: thisMpegConverter.APIKey,
            'Content-Type': 'application/json'
           },
          currentFileObject
        )

        thisMpegConverter.fileList[i] = currentFileObject

        store.dispatch(action(MPEG_CONVERSION_THIRD_PARTY_JOB_CREATED, thisMpegConverter))

        if(currentFileObject.fileConversionStatus !== SUCCESS) {
          allSuccess = false
        }
        if(currentFileObject.fileConversionStatus === ERROR) {
          anyError = true
        }
      }

      if(allSuccess) {
        mpegConversionStatus = SUCCESS
      }
      if(anyError) {
        mpegConversionStatus = ERROR
      }

      if(defined(thisMpegConverter.mpegConversionStatus) && thisMpegConverter.mpegConversionStatus !== mpegConversionStatus) {
        thisMpegConverter.mpegConversionStatus = mpegConversionStatus 
        store.dispatch(action(MPEG_CONVERSION_THIRD_PARTY_JOB_CREATED, thisMpegConverter))
      }

      Logging.log("MpegConverter: TeleStream Jobs Created. MpegConverter.fileList:", thisMpegConverter.fileList)

      thisMpegConverter.PollForJobStatusUpdates()
    }

    function SaveParameters(thisMpegConverter) {
      Logging.LogSpacerLine()
      Logging.log(veriSuiteJobNumber)
      thisMpegConverter.veriSuiteJobNumber = veriSuiteJobNumber
      thisMpegConverter.fileList_raw = fileList_raw
      thisMpegConverter.fileOrder = fileOrder
      thisMpegConverter.assignedUserEmail = assignedUserEmail
      thisMpegConverter.contactName = contactName
      thisMpegConverter.contactEmail = contactEmail
      thisMpegConverter.contactPhone = contactPhone
      thisMpegConverter.veriSuiteJobId = veriSuiteJobId

      thisMpegConverter.PrintInitialConstructorParameters()
    }

    function Initialize(thisMpegConverter) {
      thisMpegConverter.AxiosHelper_createTeleStreamJobs = new AxiosHelperCreateTeleStreamJob()
      thisMpegConverter.APIKey = thisMpegConverter.GetAPIKey()
      thisMpegConverter.fileList = thisMpegConverter.FormatFileList(thisMpegConverter.fileList_raw, thisMpegConverter.fileOrder)
      thisMpegConverter.subfolders = thisMpegConverter.GetSubfolders(fileList_raw)

      thisMpegConverter.APIPayloadCreator = new APIPayloadCreator(veriSuiteJobNumber)

      thisMpegConverter.dateDisplay = MPEG_CONVERSION_CONSTANTS.DATE_DISPLAY_DEFAULT
      thisMpegConverter.mpegConversionStatus = STARTING_JOB
      thisMpegConverter.errorMsgList = []
      thisMpegConverter.dateDisplay = DateUtils.GetDateDisplay()
      Logging.log(`File Stitching Submission Time: ${thisMpegConverter.dateDisplay}`)
    }
  }
 
  UpdateMpegConversionStatus() {
    let mpegConversionStatus = PROCESSING
    let allSuccess = true
    let anyError = false

    for (let i = 0; i < this.fileList.length; i++) {
      let currentFileObject = this.fileList[i]
      if(currentFileObject.fileConversionStatus !== SUCCESS) {
        allSuccess = false
      }
      if(currentFileObject.fileConversionStatus === ERROR) {
        anyError = true
      }
    }

    if(allSuccess) {
      mpegConversionStatus = SUCCESS
    }
    if(anyError) {
      mpegConversionStatus = ERROR
    }

    this.mpegConversionStatus = mpegConversionStatus
  }

  FormatFileList(fileList_raw, fileOrder) {
    let fileList = []

    if(defined(fileOrder) && defined(fileOrder.length)) {
      fileOrder.forEach((file) => {
        let currentDocObject = fileList_raw.docs[file]
        let newFileObject = {}
        newFileObject.id = currentDocObject.id
        newFileObject.fileName = File.getNameFromPath(currentDocObject.content)

        fileList.push(newFileObject)
      })
    }

    return fileList
  }

  async GetJobStatusUpdates() {
    let mpegConversionStatus = PROCESSING
    let allSuccess = true
    let anyError = false

    if(!defined(this.AxiosHelper_getTeleStreamJobStatusUpdate)) {
      this.AxiosHelper_getTeleStreamJobStatusUpdate = new AxiosHelperGetTeleStreamJobStatusUpdate()
    }
    
    for (let i = 0; i < this.fileList.length; i++) {
      let currentFileObject = this.fileList[i]

      if(currentFileObject.continuePollingForUpdates) {
        currentFileObject = await this.AxiosHelper_getTeleStreamJobStatusUpdate.CallAPI(
          `${MPEG_CONVERSION_CONSTANTS.GET_TELESTREAM_JOB_STATUS_UPDATE_API.URL_BASE}${currentFileObject.APICallResult_teleStreamJobCreation.data.id}`,
          {},
          MPEG_CONVERSION_CONSTANTS.GET_TELESTREAM_JOB_STATUS_UPDATE_API.METHOD,
          { 
            [MPEG_CONVERSION_CONSTANTS.GET_TELESTREAM_JOB_STATUS_UPDATE_API.HEADER_NAMES.X_API_KEY]: this.APIKey,
            'Content-Type': 'application/json',
          },
          currentFileObject
        )

        this.fileList[i] = currentFileObject
      
        store.dispatch(action(RECEIVED_MPEG_CONVERSION_JOB_UPDATE, this)) //"this" here is the mpegConverter instance we are currently in
        
        if(currentFileObject.fileConversionStatus !== SUCCESS) {
          allSuccess = false
        }
        if(currentFileObject.fileConversionStatus === ERROR) {
          anyError = true
        }
      }
    }

    if(allSuccess) {
      mpegConversionStatus = SUCCESS
    }
    if(anyError) {
      mpegConversionStatus = ERROR
    }

    if(defined(this.mpegConversionStatus) && this.mpegConversionStatus !== mpegConversionStatus) {
      this.mpegConversionStatus = mpegConversionStatus 
      store.dispatch(action(RECEIVED_MPEG_CONVERSION_JOB_UPDATE, this)) //"this" here is the mpegConverter instance we are currently in
    }

    Logging.LogSectionStart("mpegConverter just got job status updates.")
    Logging.log("this.fileList:", this.fileList)

    this.ShouldWeContinuePolingForUpdates()
  }


  ShouldWeContinuePolingForUpdates() {
    let continuePollingForUpdates = false

    for (let i = 0; i < this.fileList.length; i++) {
      if(this.fileList[i].failedAttemptsToGetUpdate >= MPEG_CONVERSION_CONSTANTS.GET_TELESTREAM_JOB_STATUS_UPDATE_API.MAX_FAILED_ATTEMPTS) {
        this.fileList[i].continuePollingForUpdates = false
      }
    }

    this.fileList.forEach(currentFileObject => {
      if(currentFileObject.continuePollingForUpdates) {
        continuePollingForUpdates = true
      }
    });

    if(!continuePollingForUpdates) {
      clearInterval(this.IdOfTimerToPollForJobStatusUpdates)
    }

  }

  InitializePollingForEachFile() {
    for (let i = 0; i < this.fileList.length; i++) {
      let currentFileObject = this.fileList[i]

      currentFileObject.continuePollingForUpdates = true
      currentFileObject.failedAttemptsToGetUpdate = 0

      this.fileList[i] = currentFileObject
    }
  }

  PollForJobStatusUpdates() {
    this.InitializePollingForEachFile()

    let timeoutTimeInMilliseconds = MPEG_CONVERSION_CONSTANTS.POLLING.TIMEOUT_IN_MILLISECONDS

    this.IdOfTimerToPollForJobStatusUpdates = setInterval(
      ( () => { this.GetJobStatusUpdates() } ),
      timeoutTimeInMilliseconds
    )
  }

  GetAPIKey() {
    let APIKey

    try {
      APIKey = File.getContent(MPEG_CONVERSION_CONSTANTS.SF_API_KEY_FILE)
    } catch (error) {
      Logging.logError("Error Getting API Key for Mpeg Converter", error)
    }

    return APIKey
  }

  PrintInitialConstructorParameters() {
    Logging.log("mpegConverter.constructor.veriSuiteJobNumber:", this.veriSuiteJobNumber)
    Logging.log("mpegConverter.constructor.fileList_raw:", this.fileList_raw)
  }

  GetSubfolders(fileList_raw){
    let subfolders = ""

    if(defined(fileList_raw.docs) && Object.keys(fileList_raw.docs).length > 0){
      let value = fileList_raw.docs[Object.keys(fileList_raw.docs)[0]]
      let docValue = value.content
      let docValueSplit = docValue.split('\\');

      for (let i = 2; i < docValueSplit.length - 1; i++) {
        subfolders += docValueSplit[i] + "/"
      }
    }

    return subfolders
  }

  async GenerateSignedUrlForS3Object(veriSuiteJobNumber, fileName, subfolders) {
    try{
      const s3 = new AWS.S3({
        endpoint: `s3.${config.region}.amazonaws.com`,
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        Bucket: 'vxtprod',
        signatureVersion: 'v4',
        region: config.region
      }); 

      let params = {
        Bucket: 'vxtprod',
        Key: `${veriSuiteJobNumber}/${subfolders}${fileName}`,
        Expires: 60 * 60
      }

      Logging.log("###MpegConverter.GenerateSignedUrlForS3Object.params.Key:", params.Key)

      return s3.getSignedUrl('getObject', params)
    }
    catch(error){
      Logging.logError("ERROR inside MpegConverter.GenerateSignedUrlForS3Object():", error)
    }
  }
}

export default MpegConverter