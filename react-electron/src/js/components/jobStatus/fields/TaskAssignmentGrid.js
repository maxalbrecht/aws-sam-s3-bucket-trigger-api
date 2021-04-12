import React from 'react'
import { Container } from 'react-bootstrap'
import TaskAssignmentCol  from './../taskAssignmentCol/TaskAssignmentCol'
import { DragDropContext, Droppable as AbleToBeDroppedInto } from 'react-beautiful-dnd'
import { COLUMN } from './../../../constants/reactBeautifulDndTypes'

function TaskAssignmentGrid() {
  //^^//console.log("JobStatus.TaskAssignmentGrid.this:")
  //^^//console.log(this)
  return(
    <DragDropContext
      onDragEnd={this.onDragEnd}
    >
    <AbleToBeDroppedInto
      droppableId="all-columns"
      direction="horizontal"
      type={COLUMN}
    >
      {provided => (
        <Container fluid
          id='TaskAssignmentGrid'
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {
            this.state.columns.map((column, index) => {

              return  <TaskAssignmentCol 
                        key={column.id}
                        column={column}
                        index={index}
                      />
            })
          }
          {provided.placeholder}
        </Container>
      )}
    </AbleToBeDroppedInto>
    </DragDropContext>
  )
}

export default TaskAssignmentGrid