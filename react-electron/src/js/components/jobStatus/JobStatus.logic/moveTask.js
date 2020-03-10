function deleteChildTaskFromParentTask(parentTask, targetTaskID) {
  let results = {
    targetTask: undefined,
    updatedChildrenList: []
  }
  
  // BASE CASE 1: the parentTask does not have children tasks
  if(parentTask.tasks === []) {
    return results
  }

  let newTasks = Array.from(parentTask.tasks)
  
  for(let i = 0; i < parentTask.tasks.length; i++) {
    let currentTask = parentTask.tasks[i]
    
    // BASE CASE 2: The parentTask's child is the targetTask
    if(currentTask.id === targetTaskID) {
      results.targetTask = currentTask
      newTasks.splice(i, 1)
      break
    }

    // RECURSIVE CASE: The parentTask's child is not the targetTask
    let currentTaskResult = deleteChildTaskFromParentTask(currentTask, targetTaskID)
    if(currentTaskResult.targetTask !== undefined) {
      results.targetTask = currentTaskResult.targetTask
      newTasks[i].tasks = currentTaskResult.updatedChildrenList
      break
    }
  }

  results.updatedChildrenList = newTasks

  return results
}

function deleteTaskFromColumn(column, targetTaskID) {
  let results = {
    targetTask: undefined,
    updatedChildrenList: []
  }

    // BASE CASE 1: the column does not have children tasks
  if(column.tasks === []) {
    return results
  }

  let newTasks = Array.from(column.tasks)

  for(let i = 0; i < column.tasks.length; i++) {
    let currentTask = column.tasks[i]
    
    // BASE CASE 2: The column's child is the targetTask
    if(currentTask.id === targetTaskID) {
      results.targetTask = currentTask
      newTasks.splice(i, 1)
      break
    }
    // The column's child is not the targetTask
    let resultsChild  = deleteChildTaskFromParentTask(currentTask, targetTaskID)
    if(resultsChild.targetTask !== undefined) {
      results.targetTask = resultsChild.targetTask
      newTasks[i].tasks = resultsChild.updatedChildrenList
      break
    }
  }

  results.updatedChildrenList = newTasks

  return results
}

function moveTask(state, dndResult) {
  let newColumns = Array.from(state.columns)
  let targetTask = undefined
  for(let i = 0; i < state.columns.length; i++) {
    let resultsChild = deleteTaskFromColumn(state.columns[i], dndResult.draggableId)
    if(resultsChild.targetTask !== undefined) {
      targetTask = resultsChild.targetTask
      newColumns[i].tasks = resultsChild.updatedChildrenList
      break
    }
  }

  console.log("---SUMMARY of moveTask()---") 
  console.log("dndResult.draggableId (i.e. targetTaskID):")
  console.log(dndResult.draggableId)
  console.log("moveTask targetTask:")
  console.log(targetTask)
  console.log("moveTask newColumns:")
  console.log(newColumns)
  console.log("---END OF SUMMARY of moveTask()---") 

  return newColumns
}

export default moveTask