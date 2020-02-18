import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux'
import { logicConstructor } from './doc.logic'

var Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDragging ? '#202020' : 'inherit')};
  font-size: 14px;
  transition: border-color 0s ease;
`;

class Doc extends React.Component {
  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
  }
  render() {
    console.log("rendering a doc...+++++++++++++++++++++++++++++++++++++++++++++");
    console.log("this");
    console.log(this);

    var content = this.props.doc.content

    return (
      <Draggable
        draggableId={this.props.doc.id}
        index={this.props.index}
      >
        {(provided, snapshot) => {
          console.log("provided:");
          console.log(provided);

          return (
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
              onContextMenu={
                event => { this.handleClickSourceFile(event, this.props.doc.id) }
              }
              onClick={
                event => { this.handleClickSourceFile(event, this.props.doc.id) }
              }
              onDoubleClick={this.handleDoubleClickSourceFile}
              onKeyPress={
                event => { this.handleSourceFileDelete(event, this.props.doc.id) }
              }
              onKeyDown={
                event => { this.handleSourceFileDelete(event, this.props.doc.id) }
              }
            >
              {this.props.doc.content}
            </Container>
        )}}
      </Draggable>
    );
  }
}

//const Doc = connect(mapStateToProps)(ConnectedDoc);

export default Doc;