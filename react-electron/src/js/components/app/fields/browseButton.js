import React from 'react';
import { Button } from 'react-bootstrap'

function BrowseButton() {
    return (
      <Button 
        type="button"
        variant="secondary"
        className="formBrowseButton"
        onClick={this.handleClickBrowse}
      >
        Browse...
      </Button>
    )
  } 

export default BrowseButton;