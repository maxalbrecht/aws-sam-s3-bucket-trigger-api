import React from 'react'
import { Button } from 'react-bootstrap'
import Logging from './../../../utils/logging'

function MpegConversionButton() {
  Logging.info("Inside mpegConversion.MpegConversionButton()...")

  return (
    <Button variant="primary" type="submit" className="submitButton" style={{marginTop:'15px'}}>
      Convert To MPEG
    </Button>
  )
}

export default MpegConversionButton