import JOB_ARCHIVING_CONSTANTS from './../../../constants/job-archiving'

const { DEFAULT_SOURCE_BUCKET } = JOB_ARCHIVING_CONSTANTS

function getConstructorState() {
  return {
    sourceBucket: DEFAULT_SOURCE_BUCKET,
    jobNumber: "",
    year: "",
    month: "",
    errors: {}
  }
}

export default getConstructorState;