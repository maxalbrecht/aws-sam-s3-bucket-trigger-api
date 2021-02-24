import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { logicConstructor } from './doc.logic'
import './doc.scss'

class Doc extends React.Component {
  constructor(props) {
    super(props);
    logicConstructor.bind(this)(props);
  }
  render() {
    console.log("Doc.this.props:");
    console.log(this.props);
    return (
      <Draggable
        draggableId={this.props.doc.id}
        index={this.props.index}
      >
        {(provided, snapshot) => {
          let draggingOrNotDragging = 'NOT_DRAGGING'
          if(snapshot.isDragging) {
            draggingOrNotDragging = 'DRAGGING'
          }
          return (
            <div
              className={`Doc-Container ${draggingOrNotDragging}`}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
              onContextMenu={
                event => { this.handleClickSourceFile(event, this.props.doc.id, this.props.parentViewName) }
              }
              onClick={
                event => { this.handleClickSourceFile(event, this.props.doc.id, this.props.parentViewName) }
              }
              onDoubleClick={this.handleDoubleClickSourceFile}
              onKeyPress={
                event => { this.handleSourceFileDelete(event, this.props.doc.id, this.props.parentViewName) }
              }
              onKeyDown={
                event => { this.handleSourceFileDelete(event, this.props.doc.id, this.props.parentViewName) }
              }
            >
              {this.props.doc.content}
            </div>
        )}}
      </Draggable>
    );
  }
}

//const Doc = connect(mapStateToProps)(ConnectedDoc);

export default Doc;