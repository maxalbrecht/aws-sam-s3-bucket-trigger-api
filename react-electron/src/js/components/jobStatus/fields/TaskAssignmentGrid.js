import React from 'react'
import { Container } from 'react-bootstrap'
import TaskAssignmentCol  from './../taskAssignmentCol/TaskAssignmentCol'
import { DragDropContext, Droppable as AbleToBeDroppedInto } from 'react-beautiful-dnd'
import { COLUMN } from './../../../constants/reactBeautifulDndTypes'

function TaskAssignmentGrid() {
  let that = this;
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
            this.state.columnOrder.map((columnId, index) => {
              const column = that.state.columns[columnId]
              const jobs = column.jobIds.map(jobId => that.state.jobs[jobId])

              return  <TaskAssignmentCol 
                        key={column.id}
                        column={column}
                        jobs={jobs}
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