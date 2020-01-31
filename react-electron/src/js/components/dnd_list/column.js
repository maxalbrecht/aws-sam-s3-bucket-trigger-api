import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Doc from './doc';

const Container = styled.div`
  margin: inherit;
  border: 1px solid lightgrey;
  border-radius: 2px;
  background-color: inherit;
`;


const Title = styled.h3`
  padding: 8px;
`;


const DocList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  /*background-color: ${props => (props.isDraggingOver ? 'blue' : 'inherit')};*/
`;
export default class Column extends React.Component {
  render() {
    console.log("column.js this.props:");
    console.log(this.props);

    return (
      <Container>
        <Droppable droppableId={this.props.column.id}>
          {provided => { 
            console.log("this.props.docs:");
            console.log(this.props.docs);
            return (
            <div>
            <DocList
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {this.props.docs.map((doc, index) => (
                <Doc key={doc.id} doc={doc} index={index} />
              ))}
              {provided.placeholder}
            </DocList>
            </div>
            )
          }}
        </Droppable>
      </Container>
    );
  }
}