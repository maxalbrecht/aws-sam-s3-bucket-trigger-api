// src/js/reducers/index.js
import {
  ADD_SYNC_APP_TO_STORE,
  ADD_ARTICLE,
  API_CALL_FINISHED,
  TOGGLE_JOB_DETAILS,
  CLEAR_STATE_ACTION,
  ALLOW_OPEN_DIALOG,
  DISALLOW_OPEN_DIALOG,
  REMOVE_DOC
} from "../constants/action-types";

const getInitialState = () => ({
  allowOpenDialog: true,
  articles: []
});

function rootReducer(state = getInitialState(), action) {
  switch(action.type) {
    case ADD_SYNC_APP_TO_STORE:
      return AddSyncAppToStoreReducer(state, action)
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
    case REMOVE_DOC:
      return RemoveDocReducer(state, action);
    default:
      return state;
  }
};

function AddSyncAppToStoreReducer(state, action) {
  console.log("AddSyncAppToStoreReducer action:");
  console.log(action);

  return Object.assign(
    {},
    state,
    {
      ...state,
      syncApp: action.payload.syncApp
    }
  )
}

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

  function RemoveDocReducer(state, action) {
  console.log("Inside RemoveDocReducer");
  console.log("state");
  console.log(state);

  let syncApp = state.syncApp;
  
  let draggableId = action.payload.draggableId;
  console.log("state.syncApp.state.sourceFiles:");
  console.log(state.syncApp.state.sourceFiles)

  console.log("action:");
  console.log(action);

  console.log("draggableId:");
  console.log(draggableId);

  syncApp.RemoveDoc(draggableId);

  //const column = state.sourceFiles.columns[act]

  let newDocs = syncApp.state.sourceFiles.docs;
  delete newDocs[action.payload.draggableId];

  const newColumn = {
  // ...co
  }
  
  return Object.assign(
    {},
    state,
    {
      ...state,
      action: action
    }
);
}

export default rootReducer;

