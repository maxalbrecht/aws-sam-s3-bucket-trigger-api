import React from 'react'
import SectionTitle from './../../../../utils/sectionTitle'
import { Form, Col, Button } from 'react-bootstrap'
import defined from './../../../../utils/defined'
import QRCode from 'qrcode.react';

function MFASetup () {
  const { username, cognitoTOTPCode } = this.state;


  if(defined(cognitoTOTPCode)) {
  const str = "otpauth://totp/AWSCognito:"+ username + "?secret=" + cognitoTOTPCode + "&issuer=VeriSync";
    return (
      <Form className="form"
        onSubmit={this.handleMFASetup}
      >
        <Form.Row>
          <Col>
            { SectionTitle('Login') }
            { this.FormErrors() }
            <Form.Row>
              <Form.Group as={Col} className="textFieldLabel">
                <Form.Row style={{marginLeft:'55px', marginBottom:'60px'}}>
                  <QRCode value={str}/>
                </Form.Row>
                <Button variant="primary" type="submit" className="submitButton">
                  I have scanned the QR Code. Go to next step.
                </Button>
              </Form.Group>
            </Form.Row>
          </Col>
        </Form.Row>
      </Form>
    )
  }
}

export default MFASetup;