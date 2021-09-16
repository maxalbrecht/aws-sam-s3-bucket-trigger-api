import STRING_CONSTANTS from './string'

const SOURCE_BUCKETS = {
  vxtprod: "vxtprod",
  videoin01: "videoin01",
  vxtzoom001: "vxtzoom001"
}
const DESTINATION_BUCKETS = {
  vxtarc: "vxtarc",
  archive_originals: "archive_originals"
}

const sourceToTargetBucketMappings = {
  [SOURCE_BUCKETS.vxtprod]: DESTINATION_BUCKETS.vxtarc,
  [SOURCE_BUCKETS.videoin01]: DESTINATION_BUCKETS.archive_originals,
  [SOURCE_BUCKETS.vxtzoom001]: DESTINATION_BUCKETS.archive_originals
}

function getDestinationFields(sourceBucket, yearField, MonthField) {
  if(sourceBucket === SOURCE_BUCKETS.vxtprod) {
  }
  else if(sourceBucket === SOURCE_BUCKETS.videoin01) {
  }
  else {
  }
}

function getDestinationParentDirectory(sourceBucket, year, month) {
  let result = ""

  if(sourceBucket === SOURCE_BUCKETS.vxtprod) {
    result = `${year}/${month}/`
  }
  else if(sourceBucket === SOURCE_BUCKETS.videoin01) {
    result = `zoom/`
  }
  else if(sourceBucket === SOURCE_BUCKETS.vxtzoom001) {
    result = ``
  }
  else {
    throw Error('ERROR: getDestinationParentDirectory(): invalid sourceBucket value')
  }

  return result
}
const JOB_ARCHIVING_CONSTANTS = {
  CONFIG_FILE: `${STRING_CONSTANTS.USER_DATA_FOLDER}\\private\\MPEG1_CONVERSION_CONFIG.json`,
  SOURCE_BUCKETS,
  DEFAULT_SOURCE_BUCKET: SOURCE_BUCKETS.vxtprod,
  //SOURCE_BUCKET: "vxtprod",
  //TARGET_BUCKET: "vxtarc",
  sourceToTargetBucketMappings,
  getDestinationFields,
  getDestinationParentDirectory,
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