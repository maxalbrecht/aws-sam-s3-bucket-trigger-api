import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from  './../../dnd_list/column';
import BrowseButton from './browseButton';

function SourceFiles() {
  this.BrowseButton = BrowseButton.bind(this);

    return (
      <Form.Group as={Col} 
        className="textFieldLabel sourceFilesFormGroup" 
        style={{width:'200px', display:'inline-block', 
          height:'fit-content', marginBottom:'10px'
        }}
      >
        <Form.Row>
          <Col>
            <Form.Label>Source Files</Form.Label>
          </Col>
          <Col className="browseButtonCol">
            { this.BrowseButton() }
          </Col>     
        </Form.Row>
        <Form.Row 
          className='dndRow'
          style={{
            height:'400px',
            paddingLeft: '5px',
            paddingRight: '5px'
          }}
        >
          <DragDropContext
            className="textField sourceFilesField"
            onDragStart={this.onDragStart}
            onDragUpdate={this.onDragUpdate}
            onDragEnd={this.onDragEnd}
            style={{
              display:'inline-block',
              height:'auto'
            }}
          >

              {
                this.state.sourceFiles.columnOrder.map(
                  (columnId) => {
                    const column = this.state.sourceFiles.columns[columnId];
                    let docs = [];

                    if (column.docIds && column.docIds.length) {   
                      // not empty 
                      docs = column.docIds.map(docId => this.state.sourceFiles.docs[docId]);
                    } else {
                      // empty
                      console.log("sourcefiles.js column.docIds is currently empty.");
                    }
                    
                    return  <Column 
                              key={column.id}
                              column={column}
                              docs={docs}
                              style={{
                                minHeight:'400px',
                                display:'inline-block'
                              }}
                            />;
                  }
                )
              }
          </DragDropContext>
        </Form.Row>
      </Form.Group>
    )
  } 

export default SourceFiles;