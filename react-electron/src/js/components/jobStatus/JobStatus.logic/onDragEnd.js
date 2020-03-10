import { COLUMN, TASK } from './../../../constants/reactBeautifulDndTypes'
import getDroppableClass from './getDroppableClass'
import moveTask from './moveTask'

function onDragEnd(result) {
  console.log("Inside JobStatus.logic.onDragEnd")
  console.log("result:")
  console.log(result)
  const { destination, source, draggableId } = result
  const typeOfItemBeingDragged = result.type

  if(!destination) {
    console.log("item's destination is null...")
    return
  }

  if (
    destination.droppableId === source.droppableId
    && destination.index === source.index
  ) {
    console.log("item dropped in same position...")
    return
  }

  // DRAGGING A COLUMN
  if(typeOfItemBeingDragged === COLUMN) {
    console.log(">>>typeOfItemBeingDragged === COLUMN. this.state:")
    console.log(this.state)
    // THE ORIGINAL FIRST COLUMN SHOULD REMAIN IN PLACE
    if(destination.index === 0){
      return
    }

    let columnBeingDragged = this.state.columns[source.index]
    let newColumns = Array.from(this.state.columns);
    newColumns.splice(source.index, 1)
    newColumns.splice(destination.index, 0, columnBeingDragged)

    const newState = {
      ...this.state,
      columns: newColumns
    }
    console.log("newState:")
    console.log(newState)

    this.setState(newState)
    return
  }
  // DRAGGING A TASK
  else if(typeOfItemBeingDragged === TASK) {
    console.log(">>>typeOfItemBeingDragged === TASK")
    let sourceClass = getDroppableClass(source.droppableId)
    console.log("sourceClass:")
    console.log(sourceClass)
    //let destinationClass = getDroppableClass(destination.droppableId)

    // TASK IS BEING TAKEN FROM INSIDE ANOTHER TASK
    if(sourceClass === TASK) {
      console.log("sourceClass === TASK")
      
      const newState = {
        ...this.state,
        columns: moveTask(this.state, result)
      }
      
      this.setState(newState)

      return
    }
    // TASK IS TAKEN FROM A COLUMN
    else if(sourceClass === COLUMN) {
      console.log("sourceClass ===COLUMN")
      // REMOVE TASK FROM THE SOURCE COLUMN
      let startColumn = {}
      let startColumnIndex = -1
      this.state.columns.map((column, index) => {
        if(column.id === source.droppableId) {
          startColumn = column
          startColumnIndex = index
        }
      })

      //[source.droppableId]
      let taskBeingMoved = startColumn.tasks[source.index]
      let startTasks = startColumn.tasks
      startTasks.splice(source.index, 1)
      const newStartColumn = {
        ...startColumn,
        tasks: startTasks
      }

      //////////////////////////////////////////////////////
      //TASK MUST BE DROPPED INTO A COLUMN
      let finishColumn = {}
      let finishColumnIndex = -1
      this.state.columns.map((column, index) => {
        if(column.id === destination.droppableId) {
          finishColumn = column
          finishColumnIndex = index
        }
      })

      let finishTasks = Array.from(finishColumn.tasks)
      finishTasks.splice(destination.index, 0, taskBeingMoved)
      const newFinishColumn = {
        ...finishColumn,
        tasks: finishTasks
      }

      let newColumns = Array.from(this.state.columns)
      newColumns[startColumnIndex] = newStartColumn
      newColumns[finishColumnIndex] = newFinishColumn

      const newState = {
        ...this.state,
        columns: newColumns
      }

      this.setState(newState)

      return
    }
  }
}

export default onDragEnd