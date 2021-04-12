import { action } from './../../../../utils/action'
import { REMOVE_DOC } from "../../../../constants/action-types";

const BACKSPACE = 'Backspace'
const DELETE_BACKSPACE = 'delete'
const DELETE = 'Delete'
const D_LOWER_CASE = 'd'
const D_UPPER_CASE = 'D'

function handleSourceFileDelete(event, draggableId, parentViewName) {
  //^^//console.log("###>>>^^src.js.components.dnd_list.doc.logic.handleSourceFileDelete.event:")
  //^^//console.log(event)
  //^^//console.log("this:")
  //^^//console.log(this)

  let payload = {
    type: REMOVE_DOC,
    draggableId: draggableId,
    parentViewName
  }

  if (
    event.key === BACKSPACE 
    || event.key === DELETE_BACKSPACE 
    || event.key === DELETE
    || event.key === D_LOWER_CASE
    || event.key === D_UPPER_CASE
  ) {
    //^^//console.log('delete');
    window.store.dispatch(action(REMOVE_DOC, payload));
  }
} 

export default handleSourceFileDelete;