import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from  './../../dnd_list/column';
import BrowseButton from './browseButton';

function SourceFiles() {
  this.BrowseButton = BrowseButton.bind(this);
  //^^//console.log(">>############################################################################")
  //^^//console.log("sourceFiles.js this:")
  //^^//console.log(this)
  //^^//console.log("this.constructor.name:")
  //^^//console.log(this.constructor.name)
  //^^//console.log("this.state")
  //^^//console.log(this.state)
  //^^//console.log("this.state.sourceFiles:")
  //^^//console.log(this.state.sourceFiles)
  //^^//console.log("this.state.sourceFiles.columns:")
  //^^//console.log(this.state.sourceFiles.columns)
  //^^//console.log(">>>>>>this.state.sourceFiles.columns[\"column-1\"]:")
  //^^//console.log(this.state.sourceFiles.columns["column-1"])

    return (
      <Form.Group as={Col} 
        className="textFieldLabel sourceFilesFormGroup" 
        style={{width:'200px',
          display:'flex',
          flexDirection:'column',
          marginBottom:'10px'
        }}
      >
        <Form.Row style={{maxHeight:'35px'}}>
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
              height:'100%'
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
                      //^^//console.log("#######sourcefiles.js column.docIds is currently empty.");
                    }
                    
                    return  <Column
                              id="sourceFilesDnDColumn"
                              key={column.id}
                              column={column}
                              docs={docs}
                              parentViewName={this.viewName}
                              style={{
                                minHeight:'400px',
                                display:'inline-block',
                                height:'100%',
                                flex:1
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