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
import React, { Component } from 'react';
import { connect } from "react-redux";
import { ListGroup } from 'react-bootstrap'
import "./List.css"
import ListItem from  './ListItem';

const mapStateToProps = state => {
  return { articles: state.articles };
};

class ConnectedList extends Component {
  componentDidMount(){
    const { dispatch } = this.props
    this.dispatch = dispatch;
  }
  constructor(props){
    super(props); 
    this.articles = props.articles;
    console.log(`props.articles: ${props.articles}`);
    this.render = this.render.bind(this);
  }

  render() {
    console.log("rendering list group...");

    return (
      <ListGroup className="submittedJobsListGroup">
        {
          this.props.articles.map(
            el => ( <ListItem key={el.id} ListItemObject={el} /> )
          )
        }
      </ListGroup>
    )
  }
}

const List = connect(mapStateToProps)(ConnectedList);

export default List;