import React from 'react';
import styled from 'styled-components';
import { Droppable as AbleToBeDroppedInto } from 'react-beautiful-dnd';
import Doc from './doc/doc';
import { Scrollbars } from 'react-custom-scrollbars'

const DocList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
`;

export default class Column extends React.Component {
  render() {
    console.log("column.js this.props:");
    console.log(this.props);

    return (
      <div style={{width:'auto', height:'100%', marginLeft:'0', marginRight:'0'}}>
      <Scrollbars 
        className="scrollBars" 
        autoHeightMin={400}
        style={{
          top:40,
          position:'absolute',
          height:'calc(100% - 40px)',
          margin:'inherit',
          border:'1px solid darkgrey',
          borderColor:'darkgrey',
          borderRadius:'2px',
          backgroundColor:'inherit',
          width:'calc(100% - 10px)',
        }}
      >
        <AbleToBeDroppedInto droppableId={this.props.column.id}>
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
        </AbleToBeDroppedInto>
      </Scrollbars>
      </div>
    );
  }
}