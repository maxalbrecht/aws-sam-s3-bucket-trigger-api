function insertTaskIntoColumn(
  column,
  destinationID,
  destinationIndex,
  targetTask
) {
  console.log("START OF insertTaskIntoColumn()")
  console.log("column:")
  console.log(column)
  console.log("destinationID:")
  console.log(destinationID)
  console.log("destinationIndex:")
  console.log(destinationIndex)
  console.log("targetTask:")
  console.log(targetTask)

  let results = {
    targetTaskInserted: false,
    updatedChildrenList: []
  }

  let newTasks = Array.from(column.tasks)

  if(column.id === destinationID) {
    console.log(column.droppableID === destinationID)
    newTasks.splice(destinationIndex, 0, targetTask)
    results.targetTaskInserted = true
  }

  results.updatedChildrenList = newTasks

  console.log("END OF insertTaskIntoColumn()")

  return results
}

export default insertTaskIntoColumn