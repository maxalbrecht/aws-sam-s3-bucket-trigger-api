import { action } from './../../../../utils/action'
import { REMOVE_DOC } from './../../../../constants/action-types'

const CONTEXT_MENU = 'contextmenu'

function handleClickSourceFile(event, draggableId) {
  if (event.type === CONTEXT_MENU) {
    console.log('contextmenu of a source file')

    let payload = {
      type: REMOVE_DOC,
      draggableId: draggableId
    }

    window.store.dispatch(action(REMOVE_DOC, payload))
  }
  else {
    console.log("clicked on a source file...")  
  }
}

export default handleClickSourceFile;