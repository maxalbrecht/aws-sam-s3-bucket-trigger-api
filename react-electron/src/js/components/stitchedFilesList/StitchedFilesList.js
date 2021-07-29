import React, { Component, Fragment } from 'react'
import { Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { ListGroup } from 'react-bootstrap'
import './StitchedFilesList.scss'
import StitchedFile from './StitchedFile/StitchedFile'
import { Scrollbars } from 'react-custom-scrollbars'

function mapStateToProps(state){
  return {
    ...state,
    stitchedFiles: state.stitchedFiles
  }
}

class ConnectedStitchedFilesList extends Component {
  componentDidMount(){
    const { dispatch } = this.props
    this.dispatch = dispatch
  }

  constructor(props){
    super(props)
    this.stitchedFiles = props.stitchedFiles
    //^^//console.log("props.stitchedFiles:")
    //^^//console.log(props.stitchedFiles)
    this.render = this.render.bind(this)
    this.placeholder = this.placeholder.bind(this)
  }

  placeholder(stitchedFiles) {
    //^^//console.log("testing inside ConnectedStitchedFilesList.js...")

    //^^//console.log("stitchedFiles:")
    //^^//console.log(stitchedFiles)
    let componentVariantFileNumber = 0
    this.props.stitchedFiles.map(
      sf => {
        if(sf.fileStitcher.componentVariant === this.props.componentVariant) {
          componentVariantFileNumber++
        }
      }
    )

    if(!Array.isArray(stitchedFiles) || stitchedFiles.length < 1 || componentVariantFileNumber < 1){
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
          Stitch a File by Clicking the 'Stitch File' Button
        </div>
      )
    }
    else {
      return null
    }
  }

  render() {
    //^^//console.log("rendering stitched jobs list group...")

    let fileOrdinalNumber = 0

    return (
      <Fragment>
        <Form.Label className="textFieldLabel">Stitched Files</Form.Label>
        <Scrollbars className="scrollBars">
          <ListGroup>
            { this.placeholder(this.props.stitchedFiles)}
            {
              this.props.stitchedFiles.map(
                sf => {

                  if(sf.fileStitcher.componentVariant === this.props.componentVariant) {
                    fileOrdinalNumber++

                    //return null
                    return ( <StitchedFile key={sf.id} StitchedFileObject={sf} fileOrdinalNumber={fileOrdinalNumber} />)
                  }
                  else {
                    return null
                  }
                }
              )
            }
          </ListGroup>
        </Scrollbars>
      </Fragment>
    )
  }
}


const StitchedFilesList = connect(mapStateToProps)(ConnectedStitchedFilesList)

export default StitchedFilesList




















