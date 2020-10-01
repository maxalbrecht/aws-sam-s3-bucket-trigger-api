import React from 'react'
import { Droppable as AbleToBeDroppedInto, Draggable } from 'react-beautiful-dnd'
import { Col } from 'react-bootstrap'
import { TASK } from './../../../constants/reactBeautifulDndTypes'
import './Task.scss'

class Task extends React.Component {
  render() {
    let columnClassName = 'Task-Div'
    let titleClassName = 'Task-Title'
    let titleBeginning = 'Task:'
    let listClassName = 'TaskList'

    if(this.props.displayAsAJob) {
      columnClassName = 'Job-Container'
      titleClassName = 'Job-Title'
      titleBeginning = 'Job # '
    }

    return (
      <Draggable
        draggableId={this.props.task.id}
        index={this.props.index}
      >
        {(provided, snapshot) => {
          let draggingOrNotDragging = 'NOT_DRAGGING'
          if(snapshot.isDragging) {
            draggingOrNotDragging = 'DRAGGING'
            //window.store.dispatch(action(DRAGGING_JOB))
          }
          return (
            <Col
              className={`${columnClassName} ${draggingOrNotDragging}`}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <h2
                className={titleClassName}
                {...provided.dragHandleProps}
              >
                {`${titleBeginning} ${this.props.task.taskTitle}`}
              </h2>
              <AbleToBeDroppedInto 
                droppableId={this.props.task.id} 
                type={TASK}
                isDropDisabled={true}
              >
                {(provided, snapshot) => {
                  return (
                    <div
                      className={listClassName}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {this.props.task.tasks.map((task, index) =>
                        <Task key={task.id} task={task} index={index} displayAsAJob={false}>{task.taskTitle}</Task>
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

export default Task