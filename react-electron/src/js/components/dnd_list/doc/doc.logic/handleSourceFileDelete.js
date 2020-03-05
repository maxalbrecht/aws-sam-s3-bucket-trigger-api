import { action } from './../../../../utils/action'
import { REMOVE_DOC } from "../../../../constants/action-types";

const BACKSPACE = 'Backspace'
const DELETE_BACKSPACE = 'delete'
const DELETE = 'Delete'
const D_LOWER_CASE = 'd'
const D_UPPER_CASE = 'D'

function handleSourceFileDelete(event, draggableId) {
  let payload = {
    type: REMOVE_DOC,
    draggableId: draggableId
  }

  if (
    event.key === BACKSPACE 
    || event.key === DELETE_BACKSPACE 
    || event.key === DELETE
    || event.key === D_LOWER_CASE
    || event.key === D_UPPER_CASE
  ) {
    console.log('delete');
    window.store.dispatch(action(REMOVE_DOC, payload));
  }
} 

export default handleSourceFileDelete;