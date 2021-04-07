import AxiosHelperCreateTeleStreamJob from './axios-helper-create-telestream-job'
import AxiosHelperGetTeleStreamJobStatusUpdate from './axios-helper-get-telestream-job-status-update'
import { MPEG1_CONVERSION_FINISHED, MPEG1_CONVERSION_THIRD_PARTY_JOB_CREATED, RECEIVED_MPEG1_CONVERSION_JOB_UPDATE } from '../../constants/action-types';
import Logging from './../../utils/logging'
import File from './../../utils/file'
import DateUtils from './../../utils/date-utils'
import { STARTING_JOB } from './../../constants/list_item_statuses'
import  MPEG1_CONVERSION_CONSTANTS from './../../constants/mpeg1-conversion'
import APIPayloadCreator from './api-payload-creator';
import defined from '../../utils/defined';
import { action } from './../../utils/action'
import { PROCESSING, UPLOADING, QUEUED, SUCCESS, ERROR, FAIL } from '../../constants/list_item_statuses'
//import { FAILURE, SUCCESS } from '../../constants/cssClassNames';
var store = window.store
const AWS = require("aws-sdk");
var config = JSON.parse(File.getContent(MPEG1_CONVERSION_CONSTANTS.CONFIG_FILE))

class Mpeg1Converter {
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

    async function CallJobCreationAPIAndStartPolling(thisMpeg1Converter) {
      let mpeg1ConversionStatus = PROCESSING
      let allSuccess = true
      let anyError = false

      for (let i = 0; i < thisMpeg1Converter.fileList.length; i++) {
        let currentFileObject = thisMpeg1Converter.fileList[i];
        let source_url = await thisMpeg1Converter.GenerateSignedUrlForS3Object(thisMpeg1Converter.veriSuiteJobNumber, currentFileObject.fileName, thisMpeg1Converter.subfolders)
        let path_format = `${thisMpeg1Converter.veriSuiteJobNumber}/${thisMpeg1Converter.subfolders}${File.removeFileExtension(currentFileObject.fileName)}`
        let formattedAPIPayload = thisMpeg1Converter.APIPayloadCreator.GetFormattedAPIPayload(source_url, path_format)
        
        currentFileObject = await thisMpeg1Converter.AxiosHelper_createTeleStreamJobs.CallAPI(
          MPEG1_CONVERSION_CONSTANTS.CREATE_TELESTREAM_JOB_API.URL,
          formattedAPIPayload,
          MPEG1_CONVERSION_CONSTANTS.CREATE_TELESTREAM_JOB_API.METHOD,
          { 
            [MPEG1_CONVERSION_CONSTANTS.CREATE_TELESTREAM_JOB_API.HEADER_NAMES.X_API_KEY]: thisMpeg1Converter.APIKey,
            'Content-Type': 'application/json'
           },
          currentFileObject
        )

        thisMpeg1Converter.fileList[i] = currentFileObject

        store.dispatch(action(MPEG1_CONVERSION_THIRD_PARTY_JOB_CREATED, thisMpeg1Converter))

        if(currentFileObject.fileConversionStatus !== SUCCESS) {
          allSuccess = false
        }
        if(currentFileObject.fileConversionStatus === ERROR) {
          anyError = true
        }
      }

      if(allSuccess) {
        mpeg1ConversionStatus = SUCCESS
      }
      if(anyError) {
        mpeg1ConversionStatus = ERROR
      }

      if(defined(thisMpeg1Converter.mpeg1ConversionStatus) && thisMpeg1Converter.mpeg1ConversionStatus !== mpeg1ConversionStatus) {
        thisMpeg1Converter.mpeg1ConversionStatus = mpeg1ConversionStatus 
        store.dispatch(action(MPEG1_CONVERSION_THIRD_PARTY_JOB_CREATED, thisMpeg1Converter))
      }

      Logging.log("Mpeg1Converter: TeleStream Jobs Created. Mpeg1Converter.fileList:", thisMpeg1Converter.fileList)

      thisMpeg1Converter.PollForJobStatusUpdates()
    }

    function SaveParameters(thisMpeg1Converter) {
      Logging.LogSpacerLine()
      Logging.log(veriSuiteJobNumber)
      thisMpeg1Converter.veriSuiteJobNumber = veriSuiteJobNumber
      thisMpeg1Converter.fileList_raw = fileList_raw
      thisMpeg1Converter.fileOrder = fileOrder
      thisMpeg1Converter.assignedUserEmail = assignedUserEmail
      thisMpeg1Converter.contactName = contactName
      thisMpeg1Converter.contactEmail = contactEmail
      thisMpeg1Converter.contactPhone = contactPhone
      thisMpeg1Converter.veriSuiteJobId = veriSuiteJobId

      thisMpeg1Converter.PrintInitialConstructorParameters()
    }

    function Initialize(thisMpeg1Converter) {
      thisMpeg1Converter.AxiosHelper_createTeleStreamJobs = new AxiosHelperCreateTeleStreamJob()
      thisMpeg1Converter.APIKey = thisMpeg1Converter.GetAPIKey()
      thisMpeg1Converter.fileList = thisMpeg1Converter.FormatFileList(thisMpeg1Converter.fileList_raw, thisMpeg1Converter.fileOrder)
      thisMpeg1Converter.subfolders = thisMpeg1Converter.GetSubfolders(fileList_raw)

      thisMpeg1Converter.APIPayloadCreator = new APIPayloadCreator(veriSuiteJobNumber)

      thisMpeg1Converter.dateDisplay = MPEG1_CONVERSION_CONSTANTS.DATE_DISPLAY_DEFAULT
      thisMpeg1Converter.mpeg1ConversionStatus = STARTING_JOB
      thisMpeg1Converter.errorMsgList = []
      thisMpeg1Converter.dateDisplay = DateUtils.GetDateDisplay()
      Logging.log(`File Stitching Submission Time: ${thisMpeg1Converter.dateDisplay}`)
    }
  }
 
  UpdateMpeg1ConversionStatus() {
    let mpeg1ConversionStatus = PROCESSING
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
      mpeg1ConversionStatus = SUCCESS
    }
    if(anyError) {
      mpeg1ConversionStatus = ERROR
    }

    this.mpeg1ConversionStatus = mpeg1ConversionStatus
  }

  FormatFileList(fileList_raw, fileOrder) {
    let fileList = []

    if(defined(fileOrder) && defined(fileOrder.length)) {
      fileOrder.forEach((file) => {
        let currentDocObject = fileList_raw.docs[file]
        let newFileObject = {}
        newFileObject.id = currentDocObject.id
        //newFileObject.fileName = this.GetFileNameFromFilePath(currentDocObject.content)
        newFileObject.fileName = File.getNameFromPath(currentDocObject.content)

        fileList.push(newFileObject)
      })
    }

    return fileList
  }

  async GetJobStatusUpdates() {
    let mpeg1ConversionStatus = PROCESSING
    let allSuccess = true
    let anyError = false

    if(!defined(this.AxiosHelper_getTeleStreamJobStatusUpdate)) {
      this.AxiosHelper_getTeleStreamJobStatusUpdate = new AxiosHelperGetTeleStreamJobStatusUpdate()
    }
    
    for (let i = 0; i < this.fileList.length; i++) {
      let currentFileObject = this.fileList[i]

      if(currentFileObject.continuePollingForUpdates) {
        currentFileObject = await this.AxiosHelper_getTeleStreamJobStatusUpdate.CallAPI(
          `${MPEG1_CONVERSION_CONSTANTS.GET_TELESTREAM_JOB_STATUS_UPDATE_API.URL_BASE}${currentFileObject.APICallResult_teleStreamJobCreation.data.id}`,
          {},
          MPEG1_CONVERSION_CONSTANTS.GET_TELESTREAM_JOB_STATUS_UPDATE_API.METHOD,
          { 
            [MPEG1_CONVERSION_CONSTANTS.GET_TELESTREAM_JOB_STATUS_UPDATE_API.HEADER_NAMES.X_API_KEY]: this.APIKey,
            'Content-Type': 'application/json',
          },
          currentFileObject
        )

        this.fileList[i] = currentFileObject
      
        store.dispatch(action(RECEIVED_MPEG1_CONVERSION_JOB_UPDATE, this)) //"this" here is the mpeg1Converter instance we are currently in
        
        if(currentFileObject.fileConversionStatus !== SUCCESS) {
          allSuccess = false
        }
        if(currentFileObject.fileConversionStatus === ERROR) {
          anyError = true
        }
      }
    }

    if(allSuccess) {
      mpeg1ConversionStatus = SUCCESS
    }
    if(anyError) {
      mpeg1ConversionStatus = ERROR
    }

    if(defined(this.mpeg1ConversionStatus) && this.mpeg1ConversionStatus !== mpeg1ConversionStatus) {
      this.mpeg1ConversionStatus = mpeg1ConversionStatus 
      store.dispatch(action(RECEIVED_MPEG1_CONVERSION_JOB_UPDATE, this)) //"this" here is the mpeg1Converter instance we are currently in
    }

    Logging.LogSectionStart("mpeg1Converter just got job status updates.")
    Logging.log("this.fileList:", this.fileList)

    this.ShouldWeContinuePolingForUpdates()
  }


  ShouldWeContinuePolingForUpdates() {
    let continuePollingForUpdates = false

    for (let i = 0; i < this.fileList.length; i++) {
      if(this.fileList[i].failedAttemptsToGetUpdate >= MPEG1_CONVERSION_CONSTANTS.GET_TELESTREAM_JOB_STATUS_UPDATE_API.MAX_FAILED_ATTEMPTS) {
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

    let timeoutTimeInMilliseconds = MPEG1_CONVERSION_CONSTANTS.POLLING.TIMEOUT_IN_MILLISECONDS

    this.IdOfTimerToPollForJobStatusUpdates = setInterval(
      ( () => { this.GetJobStatusUpdates() } ),
      timeoutTimeInMilliseconds
    )
  }

  GetAPIKey() {
    let APIKey

    try {
      APIKey = File.getContent(MPEG1_CONVERSION_CONSTANTS.SF_API_KEY_FILE)
    } catch (error) {
      Logging.LogError("Error Getting API Key for Mpeg1 Converter", error)
    }

    return APIKey
  }

  PrintInitialConstructorParameters() {
    Logging.log("mpeg1Converter.constructor.veriSuiteJobNumber:", this.veriSuiteJobNumber)
    Logging.log("mpeg1Converter.constructor.fileList_raw:", this.fileList_raw)
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

    return s3.getSignedUrl('getObject', params)
  }
}

export default Mpeg1Converter