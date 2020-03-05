import React from 'react'
import { Col } from 'react-bootstrap'
import { Droppable as AbleToBeDroppedInto, Draggable } from 'react-beautiful-dnd'
import Job from '../job/Job'
import Task from './../task/Task'
import './TaskAssignmentCol.scss'
import { JOB, TASK } from './../../../constants/reactBeautifulDndTypes'


class TaskAssignmentCol extends React.Component {
  getIsDragDisabled(){
    if(this.props.index === 0) {
      return true
    }
    else {
      return false
    }
  }
  getType(){
    if(this.props.index === 0) {
      return JOB
    }
    else {
      return TASK
    }
  }
  render() {
    return (
      <Draggable 
        draggableId={this.props.column.id}
        index={this.props.index}
        isDragDisabled = {this.getIsDragDisabled()}
      >
        {(provided, snapshotParent) => {
          let parentDraggingNotDragging = 'PARENT_NOT_DRAGGING'
          if(snapshotParent.isDragging) {
            parentDraggingNotDragging = 'PARENT_DRAGGING'
          }
          return (
          <Col 
            className={`Container ${parentDraggingNotDragging}`}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <h3 className="Title"
              {...provided.dragHandleProps}
            >
              {this.props.column.title}
            </h3>
            <AbleToBeDroppedInto droppableId={this.props.column.id} type={this.getType()}>
              {(provided, snapshot) => {
                let draggingOrNotDragging = 'COL_NOT_DRAGGING'
                if(snapshot.isDraggingOver) {
                  draggingOrNotDragging = 'COL_DRAGGING'
                }

                return (
                  <div 
                    className={`JobList ${draggingOrNotDragging}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {this.props.jobs.map((job, index) => 
                      <Job key={job.id} job={job} index={index} />
                    )}
                    
                    {this.props.column.tasks.map((task, index) => {
                      return (
                        <Task key={task.id} task={task} index={index}>{task.taskTitle}</Task>
                      )
                    })
                    }

                    {provided.placeholder}
                  </div>
                )
              }}
            </AbleToBeDroppedInto>
          </Col>
        )}}
      </Draggable>
    )
  }
}

export default TaskAssignmentCol