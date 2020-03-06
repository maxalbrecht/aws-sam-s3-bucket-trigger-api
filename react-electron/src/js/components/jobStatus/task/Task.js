import React from 'react'
import { Droppable as AbleToBeDroppedInto, Draggable } from 'react-beautiful-dnd'
import { Col } from 'react-bootstrap'
import { TASK } from './../../../constants/reactBeautifulDndTypes'
import './Task.scss'
class Task extends React.Component {
  render() {
    return (
      <Draggable
        draggableId={this.props.task.id}
        index={this.props.index}
      >
        {(provided, snapshot) => {
          return (
            <Col
              className='Task-Div'
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <h2
                className={`Task-Title`}
                {...provided.dragHandleProps}
              >
                {`Task: ${this.props.task.taskTitle}`}
              </h2>
              <AbleToBeDroppedInto 
                droppableId={this.props.task.id} 
                type={TASK}
                isDropDisabled={true}
              >
                {(provided, snapshot) => {
                  return (
                    <div
                      className={"TaskList"}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {this.props.task.tasks.map((task, index) =>
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

export default Task