import React, { Component, Fragment } from 'react'
import { Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { ListGroup } from 'react-bootstrap'
import './ArchivedJobsList.scss'
import ArchivedJob from './ArchivedJob/ArchivedJob'
import { Scrollbars } from 'react-custom-scrollbars'

function mapStateToProps(state){
  return {
    ...state,
    archivedJobs: state.archivedJobs
  }
}

class ConnectedArchivedJobsList extends Component {
 componentDidMount(){
   const { dispatch } = this.props
   this.dispatch = dispatch
 }

 constructor(props){
   super(props)
   this.archivedJobs = props.archivedJobs
   console.log("props.archivedJobs:")
   console.log(props.archivedJobs)
   this.render = this.render.bind(this)
   this.placeholder = this.placeholder.bind(this)
 }

 placeholder(archivedJobs) {
   console.log("testing inside ArchivedJobsList.js...")

   console.log("archivedJobs:")
   console.log(archivedJobs)

   if(!Array.isArray(archivedJobs) || archivedJobs.length < 1) {
    let paddingSides = '10px' 
    let paddingTop = paddingSides

    return (
      <div
      style={{
        borderStyle:'dashed',
        borderWidth:'1px',
        borderColor:'darkgrey',
        borderRadius:'.25rem',
        backgroundColor:'none',
        height:'110px',
        paddingLeft:paddingSides,
        paddingRight:paddingSides,
        paddingTop:paddingTop,
        width:'100%',
        color:'darkgrey',
        fontSize:'14px'
      }}
      >
        Archive a Job by Clicking the 'Archive Job' Button
      </div>
    )
   }
   else {
     return null
   }
 }

 render() {
   console.log("rendering archived jobs list group...")

   let jobOrdinalNumber = 0

   return (
     <Fragment>
       <Form.Label className="textFieldLabel">Archived Jobs (note: archiving functionality not yet implemented)</Form.Label>
       <Scrollbars className="scrollBars">
         <ListGroup className="submittedJobsListGroup">
          { this.placeholder(this.props.archivedJobs) }
          {
            this.props.archivedJobs.map(
              aj => {
                jobOrdinalNumber++;
              
                //return null
                return ( <ArchivedJob key={aj.id} ArchivedJobObject={aj} jobOrdinalNumber={jobOrdinalNumber} />)
              }
            )
          }
         </ListGroup>
       </Scrollbars>
     </Fragment>
   )
 }
}

const ArchivedJobsList = connect(mapStateToProps)(ConnectedArchivedJobsList)

export default ArchivedJobsList