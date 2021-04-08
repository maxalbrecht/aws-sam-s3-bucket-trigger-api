import { ODD, EVEN, FAILURE } from './../../../../constants/cssClassNames'
import { STITCHING_FILE, QUEUED, SUCCESS, ERROR } from './../../../../constants/list_item_statuses'
import firstEqualsOneOfTheOthers from './../../../../utils/first-equals-one-of-the-others'

function getClassNamesForColorCoding(status_stitching, status_conversion, ordinalNumber) {
    let classNamesForColorCoding = '' 
    let successOrFailure_stitching = ''
    let successOrFailure_conversion = ''
    let successOrFailure_overall = ''
    let oddOrEven = (ordinalNumber % 2 === 0 ? EVEN : ODD) 

    // STITCHING SUCCESS OR FAILURE
    if(firstEqualsOneOfTheOthers(status_stitching, STITCHING_FILE, QUEUED)){
      successOrFailure_stitching = ''
    }
    else if(status_stitching === SUCCESS){
      successOrFailure_stitching = SUCCESS
    }
    else if(status_stitching === ERROR){
      successOrFailure_stitching = FAILURE
    }

    // CONVERSION SUCCESS OR FAILURE
    if(successOrFailure_stitching === SUCCESS) {
      //let status = Regex.defaultIfNotDefined('', this.StitchedFileObject.fileStitcher, "mpeg1Converter.mpeg1ConversionStatus")

      if(status_conversion === SUCCESS) {
        successOrFailure_conversion = SUCCESS
      }
      else if(firstEqualsOneOfTheOthers(status_conversion, FAILURE, ERROR)) {
        successOrFailure_conversion = FAILURE
      }
    }

    // OVERALL SUCCESS OR FAILURE
    if(successOrFailure_stitching === SUCCESS && successOrFailure_conversion === SUCCESS) {
      successOrFailure_overall = SUCCESS
    }
    else if(successOrFailure_stitching === FAILURE || successOrFailure_conversion === FAILURE) {
      successOrFailure_overall = FAILURE
    }

    // GET FINAL RESULT
    if(successOrFailure_overall !== ''){
      classNamesForColorCoding = successOrFailure_overall + '_' + oddOrEven
    }

    return classNamesForColorCoding
}

export default getClassNamesForColorCoding