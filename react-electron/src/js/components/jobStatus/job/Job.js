import React from 'react'
import { Droppable as AbleToBeDroppedInto, Draggable } from 'react-beautiful-dnd'
import { Col } from 'react-bootstrap'
import Task from './../task/Task'
import './Job.scss'
import { TASK } from './../../../constants/reactBeautifulDndTypes'
class Job extends React.Component {
  render() {
    return (
      <Draggable
        draggableId={this.props.job.id}
        index={this.props.index}
      >
        {(provided, snapshot) => {
          let draggingOrNotDragging = 'NOT_DRAGGING'
          if(snapshot.isDragging) {
            draggingOrNotDragging = 'DRAGGING'
          }
          return (
            <Col 
              className={`Job-Container  ${draggingOrNotDragging}`}
              {...provided.draggableProps}
              ref={provided.innerRef}
              //style={{flexDirection:'column', padding:0, zIndex:300}}
            >
              <h5
                className={`Job-Title  ${draggingOrNotDragging}`}
                {...provided.dragHandleProps}
              >
                {"Job #" + this.props.job.jobTitle}
              </h5>
              <AbleToBeDroppedInto droppableId={this.props.job.id} type={TASK}>
                {(provided, snapshot) => {
                  return (
                    <div
                      className={"TaskList"}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {this.props.job.tasks.map((task, index) =>
                        <Task key={task.id} task={task} index={index}>{task.taskTitle}</Task>
                      )}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </AbleToBeDroppedInto>
            </Col>
          )
        }}
      </Draggable>
    )
  }
}

export default Job