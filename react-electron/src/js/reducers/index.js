// src/js/reducers/index.js
import {
  ADD_ARTICLE,
  API_CALL_FINISHED,
  TOGGLE_JOB_DETAILS,
  CLEAR_STATE_ACTION,
  ALLOW_OPEN_DIALOG,
  DISALLOW_OPEN_DIALOG
} from "../constants/action-types";

const getInitialState = () => ({
  allowOpenDialog: true,
  articles: []
});

function rootReducer(state = getInitialState(), action) {
  switch(action.type) {
    case ADD_ARTICLE:
      return AddArticleReducer(state, action);
    case API_CALL_FINISHED:
      return APICallFinishedReducer(state, action);
    case TOGGLE_JOB_DETAILS:
      return ToggleJobDetailsReducer(state, action);
    case CLEAR_STATE_ACTION:
      return ClearStateActionReducer(state, action);
    case DISALLOW_OPEN_DIALOG:
      return DisallowOpenDialogReducer(state, action);
    case ALLOW_OPEN_DIALOG:
      return AllowOpenDialogReducer(state, action);
    default:
      return state;
  }
};

function AddArticleReducer(state, action) {
  return Object.assign(
    {},
    state,
    { 
      ...state,
      articles: state.articles.concat(action.payload)
    }
  );
}

function APICallFinishedReducer(state, action) {
  return Object.assign(
    {},
    state,
    {
      ...state,
      articles: state.articles
    }
  );
}
function ToggleJobDetailsReducer(state, action) {
  console.log("Inside ToggleJobDetailsReducer");

  return Object.assign(
    {},
    state,
    { 
      ...state,
      articles: state.articles,
      action: action
    }
  );
}

function ClearStateActionReducer(state, action) {
  console.log("Inside ClearStateAction()");

  return Object.assign(
    {},
    state,
    {
      ...state,
      action: null 
    }
  );
}

function DisallowOpenDialogReducer(state, action) {
  console.log("Inside DisallowOpenDialogReducer");

  return Object.assign(
    {},
    state,
    {
      ...state,
      allowOpenDialog: false
    }
  );
}

function AllowOpenDialogReducer(state, action) {
  console.log("Inside AllowOpenDialogReducer");

  return Object.assign(
    {},
    state,
    {
      ...state,
      allowOpenDialog: true
    }
  );
}

export default rootReducer;

