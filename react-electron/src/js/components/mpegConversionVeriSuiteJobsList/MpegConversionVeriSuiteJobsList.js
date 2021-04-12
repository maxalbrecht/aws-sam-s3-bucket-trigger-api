import React, { Component, Fragment } from 'react'
import { Form, ListGroup } from 'react-bootstrap'
import { connect } from 'react-redux' 
import './MpegConversionVeriSuiteJobsList.scss'
import MpegConversionVeriSuiteJob from './MpegConversionVeriSuiteJob/MpegConversionVeriSuiteJob'
import { Scrollbars } from 'react-custom-scrollbars'
import defined from './../../utils/defined'
import Logging from './../../utils/logging'

function mapStateToProps(state) {
  return {
    ...state,
     mpegConversionVeriSuiteJobs: state.mpegConversionVeriSuiteJobs
  }
}

class ConnectedMpegConversionVeriSuiteJobsList extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    this.dispatch = dispatch
  }

  constructor(props) {
    super(props)
    this.mpegConversionVeriSuiteJobs = props.mpegConversionVeriSuiteJobs

    this.render = this.render.bind(this)
    this.placeholder = this.placeholder.bind(this)
  }

  placeholder(mpegConversionVeriSuiteJobs) {
    if(!defined(mpegConversionVeriSuiteJobs) 
      || !Array.isArray(mpegConversionVeriSuiteJobs) || mpegConversionVeriSuiteJobs.length < 1) {
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
          Convert .mpg4 files to .mpg by Clicking the 'Convert To MPEG' Button
        </div>
      )
    }
    else {
      return null
    }
  }

  render() {
    let veriSuiteJobOrdinalNumber = 0

    Logging.log("MpegConversionVeriSuiteJobsList this.props.mpegConversionVeriSuiteJobs", this.props.mpegConversionVeriSuiteJobs)

    return (
      <Fragment>
        <Form.Label className="textFieldLabel">MPEG Conversion Jobs</Form.Label>
        <Scrollbars className="scrollBars">
          <ListGroup>
            { this.placeholder(this.props.mpegConversionVeriSuiteJobs) }
            {
              this.props.mpegConversionVeriSuiteJobs.map(
                mpegConversionVeriSuiteJob => {
                  veriSuiteJobOrdinalNumber++

                  return (
                    <MpegConversionVeriSuiteJob 
                      key={ mpegConversionVeriSuiteJob.id }
                      MpegConversionVeriSuiteJobObject={ mpegConversionVeriSuiteJob } 
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

const MpegConversionVeriSuiteJobsList = connect(mapStateToProps)(ConnectedMpegConversionVeriSuiteJobsList)

export default MpegConversionVeriSuiteJobsList 