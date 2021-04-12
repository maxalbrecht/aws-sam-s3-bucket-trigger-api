import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'

class connectedConversion extends Component {
  render() {
    return (
      <div style={{height:'100%'}} className="main">
        <Form>
          <Form.Row>
            <Button type="submit">
              test
            </Button>
          </Form.Row>
        </Form>
      </div>
    )
  }
}

export default connectedConversion