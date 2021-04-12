import { ODD, EVEN, FAILURE } from './../../../../constants/cssClassNames'
import firstEqualsOneOfTheOthers from './../../../../utils/first-equals-one-of-the-others'
import { SUCCESS, ERROR } from './../../../../constants/list_item_statuses'

function getClassNamesForColorCoding(status, ordinalNumber) {
  let classNamesForColorCoding = '' 
  let successOrFailure = ''
  let oddOrEven = ODD

  if(ordinalNumber % 2 === 0) {
    oddOrEven = EVEN
  }

  if(status === SUCCESS) {
    successOrFailure = SUCCESS
  }
  else if(firstEqualsOneOfTheOthers(status, FAILURE, ERROR)) {
    successOrFailure = FAILURE
  }

  if(successOrFailure !== '') {
    classNamesForColorCoding = successOrFailure + '_' + oddOrEven
  }

  return classNamesForColorCoding
}

export default getClassNamesForColorCoding