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
import React from "react";
import { connect } from "react-redux";
import { ListGroup } from 'react-bootstrap'
import "./List.css"

const mapStateToProps = state => {
  return { articles: state.articles };
};

const ConnectedList = ({ articles }) => (
  <ListGroup className="submittedJobsListGroup">
    {
      articles.map(
        el => (
          <ListGroup.Item className="submittedJobsListGroupItem" key={el.id} >
            {"Job #:"} {el.jobNumber}
          </ListGroup.Item>
        )
      )
    }
  </ListGroup>
);

const List = connect(mapStateToProps)(ConnectedList);

export default List;