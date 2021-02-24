import React from 'react';
import { ListGroup } from 'react-bootstrap';
const uuidv4 = window.require("uuid/v4")

function SourceFile(file) {
  return (
    <ListGroup.Item style={{padding:'2px 0', border:'none', marginBottom:'5px'}} key={uuidv4()}>
      {file}
    </ListGroup.Item>
  )
}

export default SourceFile;