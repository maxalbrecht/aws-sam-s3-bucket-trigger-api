import React, { Component, Fragment } from 'react'
import { Form, ListGroup } from 'react-bootstrap'
import { connect } from 'react-redux' 
import './Mpeg1ConversionVeriSuiteJobsList.scss'
import Mpeg1ConversionVeriSuiteJob from './Mpeg1ConversionVeriSuiteJob/Mpeg1ConversionVeriSuiteJob'
import { Scrollbars } from 'react-custom-scrollbars'
import defined from './../../utils/defined'
import Logging from './../../utils/logging'

function mapStateToProps(state) {
  return {
    ...state,
     mpeg1ConversionVeriSuiteJobs: state.mpeg1ConversionVeriSuiteJobs
  }
}

class ConnectedMpeg1ConversionVeriSuiteJobsList extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    this.dispatch = dispatch
  }

  constructor(props) {
    super(props)
    this.mpeg1ConversionVeriSuiteJobs = props.mpeg1ConversionVeriSuiteJobs

    this.render = this.render.bind(this)
    this.placeholder = this.placeholder.bind(this)
  }

  placeholder(mpeg1ConversionVeriSuiteJobs) {
    if(!defined(mpeg1ConversionVeriSuiteJobs) 
      || !Array.isArray(mpeg1ConversionVeriSuiteJobs) || mpeg1ConversionVeriSuiteJobs.length < 1) {
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
          Convert .mpg4 files to .mpg by Clicking the 'Convert To MPEG1' Button
        </div>
      )
    }
    else {
      return null
    }
  }

  render() {
    let veriSuiteJobOrdinalNumber = 0

    Logging.log("Mpeg1ConversionVeriSuiteJobsList this.props.mpeg1ConversionVeriSuiteJobs", this.props.mpeg1ConversionVeriSuiteJobs)

    return (
      <Fragment>
        <Form.Label className="textFieldLabel">MPEG1 Conversion Jobs</Form.Label>
        <Scrollbars classNames="scrollBars">
          <ListGroup>
            { this.placeholder(this.props.mpeg1ConversionVeriSuiteJobs) }
            {
              this.props.mpeg1ConversionVeriSuiteJobs.map(
                mpeg1ConversionVeriSuiteJob => {
                  veriSuiteJobOrdinalNumber++

                  return (
                    <Mpeg1ConversionVeriSuiteJob 
                      key={ mpeg1ConversionVeriSuiteJob.id }
                      Mpeg1ConversionVeriSuiteJobObject={ mpeg1ConversionVeriSuiteJob } 
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

const Mpeg1ConversionVeriSuiteJobsList = connect(mapStateToProps)(ConnectedMpeg1ConversionVeriSuiteJobsList)

export default Mpeg1ConversionVeriSuiteJobsList 