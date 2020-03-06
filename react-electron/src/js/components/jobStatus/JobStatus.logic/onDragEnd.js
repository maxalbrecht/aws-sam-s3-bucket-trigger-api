import { COLUMN, JOB, TASK } from './../../../constants/reactBeautifulDndTypes'

const JOB_INFIX = 'job-'
const COLUMN_INFIX = 'column-'
const TASK_INFIX = 'task-'

function getDroppableClass(droppableId) {
  if(droppableId.startsWith(COLUMN_INFIX)) {
    return COLUMN
  }

  if(droppableId.startsWith(JOB_INFIX)) {
    let numberOfDashesInId = (droppableId.split("-").length - 1) 
    if(numberOfDashesInId <= 1) {
      return JOB
    } else {
      return TASK
    }
  }
}

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
    console.log(">>>typeOfItemBeingDragged === COLUMN")
    // THE ORIGINAL FIRST COLUMN SHOULD REMAIN IN PLACE
    if(destination.index === 0){
      return
    }

    const newColumnOrder = Array.from(this.state.columnOrder);
    newColumnOrder.splice(source.index, 1)
    newColumnOrder.splice(destination.index, 0, draggableId)

    const newState = {
      ...this.state,
      columnOrder: newColumnOrder
    }

    this.setState(newState)
    return
  }
  // DRAGGING A JOB
  else if(typeOfItemBeingDragged === JOB) {
    const start = this.state.columns[source.droppableId]
    const finish = this.state.columns[destination.droppableId]

    console.log(">>>typeOfItemBeingDragged === JOB")
    // ITEM IS DRAGGED WITHIN THE SAME CONTAINER
    if(start === finish) {
      const newJobIds = Array.from(start.jobIds)
      newJobIds.splice(source.index, 1)
      newJobIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        jobIds: newJobIds
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      }

      this.setState(newState)
      return
    }
    // ITEM IS DRAGGED FROM ONE CONTAINER TO ANOTHER 
    else {
      const startJobIds = Array.from(start.jobIds)
      startJobIds.splice(source.index, 1);
      const newStart = {
        ...start,
        jobIds: startJobIds
      }

      const finishJobIds = Array.from(finish.jobIds)
      finishJobIds.splice(destination.index, 0, draggableId)
      const newFinish = {
        ...finish,
        jobIds: finishJobIds
      }

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      }
      this.setState(newState)
      return
    }
  }
  // DRAGGING A TASK
  else if(typeOfItemBeingDragged === TASK) {
    console.log(">>>typeOfItemBeingDragged === TASK")
    let sourceClass = getDroppableClass(source.droppableId)
    let destinationClass = getDroppableClass(destination.droppableId)

    // RETURN IF TASK IS DROPPED INTO A JOB
    if(destinationClass === JOB) {
      console.log("task destination was a job, which is not allowed. Reverting changes.")
      return
    }

    // TASK IS TAKEN FROM A JOB
    if(sourceClass === JOB) {
      if(destinationClass === TASK) {
        return
      }
      console.log("sourceClass === JOB")
      // REMOVE TASK FROM THE SOURCE JOB
      let startJob = this.state.jobs[source.droppableId]
      let taskBeingMoved = startJob.tasks[source.index]
      console.log("taskkBeingMoved:")
      console.log(taskBeingMoved)
      let startTasks = Array.from(startJob.tasks)
      console.log("startTasks:")
      console.log(startTasks)
      startTasks.splice(source.index, 1)
      const newStartJob = {
        ...startJob,
        tasks: startTasks
      }

      const newJobs = {
        ...this.state.jobs,
        [newStartJob.id]: newStartJob
      }

      // TASK MUST BE DROPPED INTO A COLUMN
      let finishColumn = this.state.columns[destination.droppableId]
      let finishTasks = Array.from(finishColumn.tasks)
      finishTasks.splice(destination.index, 0, taskBeingMoved)
      const newFinishColumn = {
        ...finishColumn,
        tasks: finishTasks
      }

      const newColumns = {
        ...this.state.columns,
        [newFinishColumn.id]: newFinishColumn
      }

      const newState = {
        ...this.state,
        jobs: newJobs,
        columns: newColumns
      }

      this.setState(newState)

      return
    }
    // TASK IS BEING TAKEN FROM INSIDE ANOTHER TASK
    else if(sourceClass === TASK) {
      console.log("sourceClass === TASK")
      // CASE #1: The task is still within its parent job
      //let currentParent = getTopParent()

    }
    // TASK IS TAKEN FROM A COLUMN
    else if(sourceClass === COLUMN) {
      console.log("sourceClass ===COLUMN")
      // REMOVE TASK FROM THE SOURCE COLUMN
      let startColumn = this.state.columns[source.droppableId]
      let taskBeingMoved = startColumn.tasks[source.index]
      console.log("taskBeingMoved:")
      console.log(taskBeingMoved)
      let startTasks = startColumn.tasks
      console.log("startTasks:")
      console.log(startTasks)
      startTasks.splice(source.index, 1)
      const newStartColumn = {
        ...startColumn,
        tasks: startTasks
      }

      //TASK MUST BE DROPPED INTO A COLUMN
      let finishColumn = this.state.columns[destination.droppableId]
      let finishTasks = Array.from(finishColumn.tasks)
      finishTasks.splice(destination.index, 0, taskBeingMoved)
      const newFinishColumn = {
        ...finishColumn,
        tasks: finishTasks
      }

      const newColumns = {
        ...this.state.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn
      }

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