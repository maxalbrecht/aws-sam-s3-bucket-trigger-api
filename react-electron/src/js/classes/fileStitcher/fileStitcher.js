import AxiosHelperCreateJob from './axios-helper-create-job'
import AxiosHelperGetStatusUpdate from './axios-helper-get-status-update'
import Logging from './../../utils/logging'
import File from './../../utils/file'
import DateUtils from './../../utils/date-utils'
import { STARTING_JOB } from './../../constants/list_item_statuses'
import ApiPayloadCreator from './api_payload_creator'
import FILE_STITCHING_CONSTANTS from './../../constants/file-stitching'

class FileStitcher {
  constructor(
    externalJobNumber,
    fileList_raw,
    fileOrder,
    audioAdjustment,
    destinationFileName,
    assignedUserEmail,
    contactName,
    contactEmail,
    contactPhone,
    fileId,
    ...props
  ) {
    SaveParameters(this)
    Initialize(this)

    AxiosHelperCallAPIAndStartPolling(this)

    async function AxiosHelperCallAPIAndStartPolling(that){
      await that.AxiosHelper.CallAPI(
        that.apiUrl,
        that.ApiPayloadCreator.formattedAPIPayload,
        FILE_STITCHING_CONSTANTS.API.METHOD,
        { [FILE_STITCHING_CONSTANTS.API.HEADER_NAMES.X_API_KEY]: that.APIKey },
        that
      )
      that.jobId = that.result.data.id

      that.PrintConstructorResults()

      that.PollForJobStatusUpdates()
    }

    function SaveParameters(that){
      Logging.LogSpacerLine()
      Logging.log(externalJobNumber)
      that.externalJobNumber = externalJobNumber 
      that.fileList_raw = fileList_raw 
      that.fileOrder = fileOrder
      that.audioAdjustment = audioAdjustment
      that.destinationFileName = destinationFileName 
      that.assignedUserEmail = assignedUserEmail 
      that.contactName = contactName 
      that.contactEmail = contactEmail 
      that.contactPhone = contactPhone 
      that.fileId = fileId
  
      that.PrintInitialConstructorParameters();
    }

    function Initialize(that){
      that.AxiosHelper = new AxiosHelperCreateJob()
      that.factoryId = FILE_STITCHING_CONSTANTS.FACTORY_ID
      that.apiUrl = FILE_STITCHING_CONSTANTS.API.URL
      that.templateId = that.DetermineTemplateID(that.audioAdjustment)
      that.APIKey = that.GetAPIKey()
  
      that.ApiPayloadCreator = new ApiPayloadCreator(
        externalJobNumber,
        fileList_raw,
        fileOrder,
        `${destinationFileName}.mp4`,
        assignedUserEmail,
        contactName,
        contactEmail,
        contactPhone,
        that.templateId        
      )

      that.continuePollingForUpdates = true
      that.failedAttemptsToGetUpdate = 0
      that.dateDisplay = FILE_STITCHING_CONSTANTS.DATE_DISPLAY_DEFAULT
      that.fileStitchingStatus = STARTING_JOB
      that.axiosSuccessResult = {}
      that.axiosFailureReason = {}
      that.errorMsgList = []
      that.dateDisplay = DateUtils.GetDateDisplay()
      Logging.log(`File Stitching Submission Time: ${that.dateDisplay}`)
    }
  }

  async GetJobStatusUpdate(){ 
    if(this.updateApiUrl === undefined){
      this.updateApiUrl = `${this.apiUrl}/${this.jobId}` 

      //if (this.externalJobNumber === FILE_STITCHING_CONSTANTS.MOCK_JOB.EXTERNAL_JOB_NUMBER) {
      //  this.updateApiUrl = `${this.apiUrl}/${FILE_STITCHING_CONSTANTS.MOCK_JOB.ID}` 
      //}  
    }
    if(this.AxiosHelperForUpdates === undefined){
      this.AxiosHelperForUpdates = new AxiosHelperGetStatusUpdate() //this.GetAxiosHelperForUpdates()
    }

    await this.AxiosHelperForUpdates.CallAPI(
      this.updateApiUrl,
      {},
      FILE_STITCHING_CONSTANTS.API_JOB_STATUS.METHOD,
      { [FILE_STITCHING_CONSTANTS.API.HEADER_NAMES.X_API_KEY]: this.APIKey },
      this
    )
    
    this.ShouldWeContinuePollingForUpdates()

    Logging.log("***&&&***Latest jobStatusUpdate:", this.jobStatusUpdate)
  }

  ShouldWeContinuePollingForUpdates(){
    Logging.LogSectionStart()
    Logging.log("this.IdOfTimerToPollForJobStatusUpdates:", this.IdOfTimerToPollForJobStatusUpdates)
    Logging.log("this.failedAttemptsToGetUpdate: ", this.failedAttemptsToGetUpdate)
    Logging.log("continuePollingForUpdates: ", this.continuePollingForUpdates)

    if(this.failedAttemptsToGetUpdate >= FILE_STITCHING_CONSTANTS.API_JOB_STATUS.MAX_FAILED_ATTEMPTS){
      this.continuePollingForUpdates = false
    }

    if (!this.continuePollingForUpdates) {
      clearInterval(this.IdOfTimerToPollForJobStatusUpdates)
      Logging.log(">>>clearing interval that checks for updates")
    }

    Logging.LogSectionEnd()
  }

  PollForJobStatusUpdates(){
    let timeoutTimeInMilliseconds = FILE_STITCHING_CONSTANTS.POLLING.TIMEOUT_IN_SECONDS * 1000

    this.IdOfTimerToPollForJobStatusUpdates = setInterval(
      ( () => { this.GetJobStatusUpdate() } ),
      timeoutTimeInMilliseconds
    )
  }

  GetAPIKey(){
    let APIKey

    try {
      APIKey = File.getContent(FILE_STITCHING_CONSTANTS.SF_API_KEY_FILE)
    } catch (error) {
      Logging.LogError(FILE_STITCHING_CONSTANTS.ERRORS.ERROR_GETTING_API_KEY, error)
    }

    return APIKey
  }

  DetermineTemplateID(audioAdjustment) {
    const TEMPLATES = FILE_STITCHING_CONSTANTS.TEMPLATES
    const ADJUSTMENTS = FILE_STITCHING_CONSTANTS.AUDIO_ADJUSTMENTS

    let templateId = TEMPLATES.DEFAULT

    if (audioAdjustment === ADJUSTMENTS.PLUS_3) {
      templateId = TEMPLATES.BOOST_3DB
    } else if (audioAdjustment === ADJUSTMENTS.PLUS_6) {
      templateId = TEMPLATES.BOOST_6DB
    }

    return templateId
  }

  PrintConstructorResults(){
    Logging.log("files Stitcher CallAPI result:", JSON.stringify(this.result))
  }

  PrintInitialConstructorParameters(){
    Logging.log(`FileStitcher.constructor.audioAdjustment:`, this.audioAdjustment)
    Logging.log(`FileStitcher.constructor.destinationFileName:`, this.destinationFileName)
    Logging.log(`this.fileList_raw:`, this.fileList_raw)
  }
}

export default FileStitcher