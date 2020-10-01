import { COLUMN, TASK } from './../../../constants/reactBeautifulDndTypes'
const COLUMN_INFIX = 'column-'
const TASK_INFIX = 'task-'

function getDroppableClass(droppableId) {
  if(droppableId.startsWith(COLUMN_INFIX)) {
    return COLUMN
  }

  if(droppableId.startsWith(TASK_INFIX)) {
    return TASK
  }
}

export default getDroppableClass