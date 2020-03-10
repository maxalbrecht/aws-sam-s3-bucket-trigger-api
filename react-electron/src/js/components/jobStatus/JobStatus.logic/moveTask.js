import deleteTaskFromColumn from './deleteTaskFromColumn'
import insertTaskIntoColumn from './insertTaskIntoColumn'

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

  let newColumnsInsert = Array.from(newColumns)
  let destinationID = dndResult.destination.droppableId
  let destinationIndex = dndResult.destination.index
  for(let i = 0; i < state.columns.length; i++) {
    let resultsChild = insertTaskIntoColumn(
      state.columns[i],
      destinationID,
      destinationIndex,
      targetTask
    )
    if(resultsChild.targetTaskInserted === true) {
      console.log("targetTask inserted into columns")
      newColumnsInsert[i].tasks = resultsChild.updatedChildrenList
      break
    }
  }

  console.log("---SUMMARY of moveTask()---") 
  console.log("dndResult:")
  console.log(dndResult)
  console.log("dndResult.draggableId (i.e. targetTaskID):")
  console.log(dndResult.draggableId)
  console.log("moveTask targetTask:")
  console.log(targetTask)
  console.log("moveTask newColumns:")
  console.log(newColumns)
  console.log("moveTask newColumnsInsert")
  console.log(newColumnsInsert)
  console.log("---END OF SUMMARY of moveTask()---") 

  return newColumnsInsert
}

export default moveTask