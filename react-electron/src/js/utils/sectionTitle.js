import React, { Fragment } from 'react';
import { Form } from 'react-bootstrap'
import defined from './../utils/defined'

function SectionTitle(title, fontSizeParam) {
  let fontSize = 'inherit'

  if (defined(fontSizeParam)) {
    fontSize = fontSizeParam;
  }

  return (
    <Fragment>
      <Form.Row>
        <Form.Label style={{ marginBottom:'0px', fontSize:fontSize }}>{title}</Form.Label>
      </Form.Row>
    </Fragment>
  )
}

export default SectionTitle;