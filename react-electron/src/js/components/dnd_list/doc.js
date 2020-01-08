import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
background-color: ${props => (props.isDragging ? '#383838' : 'inherit')};
  font-size: 14px;
`;

export default class Doc extends React.Component {
  render() {
    return (
      <Draggable draggableId = {this.props.doc.id} index={this.props.index}>
        {(provided, snapshot) => ( 
          <Container
            {...provided.draggableProps} 
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            {this.props.doc.content}
          </Container>
        )}
      </Draggable>
    );
  }
}