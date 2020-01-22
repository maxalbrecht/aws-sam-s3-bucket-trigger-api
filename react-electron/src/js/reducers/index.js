// src/js/reducers/index.js
import { ADD_ARTICLE, API_CALL_FINISHED } from "../constants/action-types";

const getInitialState = () => ({
  articles: []
});

function rootReducer(state = getInitialState(), action) {
  switch(action.type) {
    case ADD_ARTICLE:
      return Object.assign(
      {},
      state,
      { articles: state.articles.concat(action.payload) }
    );

    case API_CALL_FINISHED:
      return Object.assign(
        {},
        state,
        { articles: state.articles }
      );

      default:
        return state;
  }
};

export default rootReducer;

