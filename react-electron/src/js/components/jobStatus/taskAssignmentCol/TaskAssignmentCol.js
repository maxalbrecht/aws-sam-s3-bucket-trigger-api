import React from 'react'
import { Col } from 'react-bootstrap'
import { Droppable as AbleToBeDroppedInto, Draggable } from 'react-beautiful-dnd'
import Task from './../task/Task'
import './TaskAssignmentCol.scss'
import { TASK } from './../../../constants/reactBeautifulDndTypes'
import defined from './../../../utils/defined'


class TaskAssignmentCol extends React.Component {
  getIsDragDisabled(){
    if(this.props.index === 0) {
      return true
    }
    else {
      return false
    }
  }

  getIsDropDisabled() {
    if(this.props.index === 0) {
      //return true
      return false
    }
    else {
      return false
    }
  }
  getType(){
    if(this.props.index === 0) {
      //return JOB
      return TASK
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
              {this.props.column.columnTitle}
            </h3>
            <AbleToBeDroppedInto
              droppableId={this.props.column.id}
              type={TASK}
              isDropDisabled={this.getIsDropDisabled()}
            >
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
                    {this.props.column.tasks.map((task, index) => {
                      let displayAsAJob = false
                      if(defined(task.taskType) && task.taskType === 'job') {
                        displayAsAJob = true
                      }

                      return (
                        <Task
                          key={task.id}
                          task={task}
                          index={index}
                          displayAsAJob={displayAsAJob}
                        >
                          {task.taskTitle}
                        </Task>
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