import {SUCCESS, ERROR} from './../../../../constants/job_archiving_statuses'
import {COLOR_DEFAULT, COLOR_SUCCESS, COLOR_ERROR} from './../../../../constants/list_item_colors'

function selectStatusColor(){
  let status = this.ArchivedObject.jobArchiver.jobArchivingStatus

  switch(status){
    case SUCCESS:
      return COLOR_SUCCESS;
    case ERROR:
      return COLOR_ERROR;
    default:
      return COLOR_DEFAULT
  }
}

export default selectStatusColor