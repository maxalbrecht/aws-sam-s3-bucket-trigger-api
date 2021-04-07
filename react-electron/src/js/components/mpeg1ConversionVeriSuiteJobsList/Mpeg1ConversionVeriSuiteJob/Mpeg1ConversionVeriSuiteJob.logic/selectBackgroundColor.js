import { SUCCESS, ERROR } from './../../../../constants/job_archiving_statuses'
import { COLOR_SUCCESS, COLOR_ERROR } from './../../../../constants/list_item_colors'

function selectBackgroundColor(){
  let status = this.Mpeg1ConversionVeriSuiteJobObject.mpeg1Converter.mpeg1ConversionStatus 

  switch(status){
    case SUCCESS:
      if(this.props.fileOrdinalNumber%2 === 1){
        return COLOR_SUCCESS
      }
      else {
        return '#002f4b'
      }
    case ERROR:
      if(this.props.fileOrdinalNumber%2 === 1){
        return COLOR_ERROR
      }
      else {
        return '#800000'
      }
    default:
      return 'none'
  }
}

export default selectBackgroundColor
