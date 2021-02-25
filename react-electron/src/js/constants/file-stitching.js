import STRING_CONSTANTS from './string'

const API_URL_BASE = "https://api.cloud.telestream.net/starfish/v1.0/factories/"   
const  FACTORY_ID = "e725b4c22c6d5fc48085514fc114b23c"

const FILE_STITCHING_CONSTANTS = {
  FACTORY_ID: FACTORY_ID,
  DATE_DISPLAY_DEFAULT: "<<Date & Time>>",
  //SF_API_KEY_FILE:  ".//private/SF_API_KEY.txt",
  SF_API_KEY_FILE:`${STRING_CONSTANTS.USER_DATA_FOLDER}\\private\\SF_API_KEY.txt`,
  TEMPLATES: {
    DEFAULT: 'e4813aa1d80eb4432ed14c5ae0db5b04',
    BOOST_3DB: '61a37e542d0a5d257d78842638af60fb',
    BOOST_6DB: '8d7085437c10be54d3f782b376a7a8b4' 
  },
  AUDIO_ADJUSTMENTS: {
    _0: "0",
    PLUS_3: "+3",
    PLUS_6: "+6"
  },
  API: {
    URL: `${API_URL_BASE}${FACTORY_ID}/jobs`,
    METHOD: 'post',
    HEADER_NAMES: {
      X_API_KEY: 'X-Api-Key'
    }
  },
  API_JOB_STATUS: {
    METHOD: 'get',
    MAX_FAILED_ATTEMPTS: 3
  },
  POLLING: {
    TIMEOUT_IN_SECONDS: 10
  },
  FILE_URL_BASE: "s3://vxtprod/",
  FILE_STATUS_DEFAULT: "Starting",
  INPUT: "input",
  ERRORS: {
    ERROR_GETTING_API_KEY: "Error Getting API Key.",
    ERROR_SETTING_DATA_DISPLAY: "Error Setting Date Display.",
    AXIOS_FAILURE_REASON: "fileStitcher.CallApi.axiosFailureReason:",
    ERROR_IN_FILE_STITCHER: "Error in FileStitcher."
  },
  MOCK_JOB: {
    EXTERNAL_JOB_NUMBER: "MockJob",
    ID: "c243134c980433a5936f6e2e18ce8fbc"
  }
}

export default FILE_STITCHING_CONSTANTS