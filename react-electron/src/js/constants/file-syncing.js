import STRING_CONSTANTS from './string'

const OUTPUT = 'Output'

const FILE_SYNCING_CONSTANTS = {
  MAIN_FOLDER: "vxtprod",
  REGION: "region=us_east_1",
  INPUT_OR_OUTPUT: {
    INPUT: "input",
    OUTPUT: "output"
  },
  IMAGE_TYPE: 3,
  IMAGE_BRANDING: "Veritext",
  CREATE_IMAGE: 1,
  ALLOWED_CONFIDENCE_LEVEL_PERCENT: 70,
  ORDER_TYPES: {
    QUICK_SYNC: "QuickSync",
    MANUAL_SYNC: "ManualSync"
  },
  DATE_DISPLAY_DEFAULT: "<<Date & Time>>",
  JOB_STATUS_DEFAULT: "Starting",
  FILE_TYPES:{
    TRANSCRIPT: "Transcript",
    VIDEO: "Video"
  },
  OUTPUT_FOLDER: `./${OUTPUT}/`,
  PAYLOAD_FILE_NAME_ENDING: "_payload.json",
  //CLIENT_ACCESS_KEY_FILE: "./private/CLIENT_ACCESS_KEY.txt",
  CLIENT_ACCESS_KEY_FILE: `${STRING_CONSTANTS.USER_DATA_FOLDER}\\private\\CLIENT_ACCESS_KEY.txt`,
  CLIENT_ACCESS_KEY_QA_FILE: `${STRING_CONSTANTS.USER_DATA_FOLDER}\\private\\CLIENT_ACCESS_KEY_QA.txt`,
  API: {
    URL_BASE: "https://legal.yeslaw.net/api/AutoJobManager/AddJobToQueue?clientAccessKey=",
    METHOD: 'post',
    HEADERS: { 'content-type': 'application/json' }
  },
  VIDEO_FILE_EXTENSIONS: [".mp3", ".mp4", ".mpg"]
}

export default FILE_SYNCING_CONSTANTS

