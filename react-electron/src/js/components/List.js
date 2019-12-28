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

const mapStateToProps = state => {
  return { articles: state.articles };
};

const ConnectedList = ({ articles }) => (
  <ul>
    {
      articles.map(
        el => (
          <li key={el.id}>{el.title}</li>
        )
      )
    }
  </ul>
);

const List = connect(mapStateToProps)(ConnectedList);

export default List;