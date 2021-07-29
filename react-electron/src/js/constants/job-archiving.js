import STRING_CONSTANTS from './string'

const JOB_ARCHIVING_CONSTANTS = {
  CONFIG_FILE: `${STRING_CONSTANTS.USER_DATA_FOLDER}\\private\\MPEG1_CONVERSION_CONFIG.json`,
  //SOURCE_BUCKET: "vxtprod",
  //TARGET_BUCKET: "vxtarc",
  ENVS: {
    TEST_ENV: "TEST_ENV",
    PROD_ENV: "PROD_ENV"
  },
  TEST_ENV: {
    SOURCE_BUCKET: "vxttest003",
    TARGET_BUCKET: "vxttest004"
  },
  PROD_ENV: {
    SOURCE_BUCKET: "vxtprod",
    TARGET_BUCKET: "vxtarc"
  }
}

export default JOB_ARCHIVING_CONSTANTS