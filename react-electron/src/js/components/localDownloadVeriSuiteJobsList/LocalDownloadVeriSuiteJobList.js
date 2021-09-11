import React, { Component, Fragment } from 'react'
import { Form, ListGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import LocalDownloadVeriSuiteJob from './localDownloadVeriSuiteJob/LocalDownloadVeriSuiteJob'
import { Scrollbars } from 'react-custom-scrollbars'
import defined from './../../utils/defined'
import Logging from './../../utils/logging'

function mapStateToProps(state) {
  return {
    ...state
  }
}

class ConnectedLocalDownloadVeriSuiteJobsList extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    this.dispatch = dispatch
  }

  constructor(props) {
    super(props)
    this.localDownloadVeriSuiteJobs = props.localDownloadVeriSuiteJobs

    this.render = this.render.bind(this)
    this.placeholder = this.placeholder.bind(this)
  }

  placeholder(localDownloadVeriSuiteJobs) {
    if(!defined(localDownloadVeriSuiteJobs)
      || !Array.isArray(localDownloadVeriSuiteJobs)
      || localDownloadVeriSuiteJobs.length < 1
    ) {
      let paddingSides = '10px'
      let paddingTop = paddingSides

      return (
        <div
          style={{
            borderStyle:'dashed',
            borderWidth:'1px',
            borderColor:'darkgrey',
            borderRadius:'.25ren',
            backgroundColor:'none',
            height:'110px',
            paddingLeft:paddingSides,
            paddingRight:paddingSides,
            paddingTop: paddingTop,
            width:'100%',
            color:'darkgrey',
            fontSize:'14px'
          }}
        >
          Download Job Files by Clicking the 'Download Locally' Button
        </div>
      )
    }
    else {
      return null
    }
  }

  render() {
    let veriSuiteJobOrdinalNumber = 0

    Logging.log("LocalDownloadVeriSuiteJobsList this.props.localDownloadVeriSuiteJobs", this.props.localDownloadVeriSuiteJobs)

    return (
      <Fragment>
        <Form.Label className="textFieldLabel">Local Download Jobs</Form.Label>
        <Scrollbars className="scrollBars">
          <ListGroup>
            { this.placeholder(this.props.localDownloadVeriSuiteJobs) }
            {
              this.props.localDownloadVeriSuiteJobs.map(
                localDownloadVeriSuiteJob => {
                  veriSuiteJobOrdinalNumber++

                  return (
                    <LocalDownloadVeriSuiteJob
                      key={ localDownloadVeriSuiteJob.id }
                      LocalDownloadVeriSuiteJobObject={ localDownloadVeriSuiteJob }
                      veriSuiteJobOrdinalNumber={ veriSuiteJobOrdinalNumber }
                    />
                  )
                }
              )
            }
          </ListGroup>
        </Scrollbars>
      </Fragment>
    )
  }
}

const LocalDownloadVeriSuiteJobsList = connect(mapStateToProps)(ConnectedLocalDownloadVeriSuiteJobsList)

export default LocalDownloadVeriSuiteJobsList