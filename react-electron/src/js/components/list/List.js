// src/js/components/List.js

// This component, List, will interact with the Redux store
// The key for connecting a React component with Redux is connect.
//      It takes at least one argument.
// We want List to get a list of articles.
//     It is therefore a matter of connecting
//            state.articles
//        with
//            the component
//     We do this with mapStateToProps
import React, { Component, Fragment } from 'react';
import { Form } from 'react-bootstrap';
import { connect } from "react-redux";
import { ListGroup } from 'react-bootstrap'
import "./List.css"
import ListItem from  './ListItem/ListItem';
import { Scrollbars } from 'react-custom-scrollbars';

function mapStateToProps(state){
  return { 
    ...state,
    articles: state.articles
  };
};

class ConnectedList extends Component {
  componentDidMount(){
    const { dispatch } = this.props
    this.dispatch = dispatch;
  }
  constructor(props){
    super(props); 
    this.articles = props.articles;
    console.log("props.articles:");
    console.log(props.articles);
    this.render = this.render.bind(this);
    this.placeholder = this.placeholder.bind(this);
  }

  placeholder(articles) {
    console.log("testing inside List.js...")

    console.log("articles:");
    console.log(articles);
    
    if(!Array.isArray(articles) || articles.length < 1) {
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
            width: `100%`,
            color:'darkgrey',
            fontSize:'14px',
          }}
          
        >

          Submit a New Job by Clicking the 'Submit Job' Button
        </div>
      )
    }
    else {
      return null;
    }
  }

  render() {
    console.log("rendering list group...");

    return (
      <Fragment>
        <Form.Label className="textFieldLabel">Submitted Jobs</Form.Label>
        <Scrollbars className="scrollBars" >
          <ListGroup className="submittedJobsListGroup">
            { this.placeholder(this.props.articles) }
            {
              this.props.articles.reverse().map(
                el => ( <ListItem key={el.id} ListItemObject={el} /> )
              )
            }
          </ListGroup>
        </Scrollbars>
      </Fragment>
    )
  }
}

const List = connect(mapStateToProps)(ConnectedList);

export default List;