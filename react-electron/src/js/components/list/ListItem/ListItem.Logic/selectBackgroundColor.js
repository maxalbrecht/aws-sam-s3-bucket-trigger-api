import { SUCCESS, ERROR } from '../../../../constants/list_item_statuses'
import { COLOR_SUCCESS, COLOR_ERROR } from '../../../../constants/list_item_colors'

function selectBackgroundColor() {
  let status = this.ListItemObject.apiCaller.APICallStatus

  switch (status) {
    case SUCCESS:
      return COLOR_SUCCESS;
    case ERROR:
      return COLOR_ERROR;
    default:
      return 'none';
  }
}

export default selectBackgroundColor;