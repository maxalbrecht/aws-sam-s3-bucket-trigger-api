import JOB_ARCHIVING_CONSTANTS from "../../../constants/job-archiving";
import firstEqualsOneOfTheOthers from "../../../utils/first-equals-one-of-the-others";

const { SOURCE_BUCKETS } = JOB_ARCHIVING_CONSTANTS 

function Clean(field) {
  if (
    field === undefined
    || field === null
  ) {
    return "";
  } else {
    return field.replace(/\s+/g, '');
  }
}

function CheckForEmptyFields() {
  let areThereEmptyFields = true;
  const { sourceBucket, jobNumber, year, month } = this.state;

  if(
    (
      sourceBucket === SOURCE_BUCKETS.vxtprodOrVxttest003
      && Clean(jobNumber) !== ''
      && Clean(year) !== ''
      && Clean(month) !== ''
    )
    || (
      firstEqualsOneOfTheOthers(sourceBucket, SOURCE_BUCKETS.videoin01, SOURCE_BUCKETS.vxtzoom01)
      && Clean(jobNumber) !== ''
    )
  ) {
    areThereEmptyFields = false;
  }

  return areThereEmptyFields;
}

export default CheckForEmptyFields;