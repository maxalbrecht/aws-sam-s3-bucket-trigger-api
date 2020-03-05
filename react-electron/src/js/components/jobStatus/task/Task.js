import React from 'react'
import { Droppable as AbleToBeDroppedInto, Draggable } from 'react-beautiful-dnd'
import { Col } from 'react-bootstrap'
import { TASK } from './../../../constants/reactBeautifulDndTypes'
import './Task.scss'
class Task extends React.Component {
  render() {
    console.log("Inside Task.render")
    console.log("this.props.task:")
    console.log(this.props.task)
    console.log("this.props.task.id:")
    console.log(this.props.task.id)
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
              

            </Col>
          )
        }}
      </Draggable>
      
    )
  }
}

export default Task