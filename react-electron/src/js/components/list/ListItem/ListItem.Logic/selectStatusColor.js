import { SUCCESS, ERROR, ERROR_API_NOT_RESOLVED } from '../../../../constants/list_item_statuses'
import { COLOR_DEFAULT, COLOR_SUCCESS, COLOR_ERROR } from '../../../../constants/list_item_colors'

function selectStatusColor() {
  let status = this.ListItemObject.apiCaller.APICallStatus;

  switch (status) {
    case SUCCESS:
      return COLOR_SUCCESS;
    case ERROR:
    case ERROR_API_NOT_RESOLVED:
      return COLOR_ERROR;
    default:
      return COLOR_DEFAULT;
  }
}

export default selectStatusColor