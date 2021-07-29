import React from 'react'
import { Button } from 'react-bootstrap'
import Logging from './../../../utils/logging'

function LocalDownloadButton() {
  Logging.info("inside localDownload.LocalDownloadButton()...")

  return (
    <Button variant="primary" type="submit" className="submitButton" style={{marginTop:'15px'}}>
      Download Locally
    </Button>
  )
}

export default LocalDownloadButton