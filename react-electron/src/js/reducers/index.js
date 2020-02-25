// src/js/reducers/index.js
import { Auth } from 'aws-amplify'
import defined from './../utils/defined'
import { THEME_DARK, THEME_LIGHT } from './../constants/themes'
import { THEME } from './../constants/localStorageVariables'
import {
  ADD_SYNC_APP_TO_STORE,
  ADD_ARTICLE,
  API_CALL_FINISHED,
  TOGGLE_JOB_DETAILS,
  CLEAR_STATE_ACTION,
  ALLOW_OPEN_DIALOG,
  DISALLOW_OPEN_DIALOG,
  REMOVE_DOC,
  USER_LOGGED_IN,
  LOG_OUT,
  TOGGLE_DARK_THEME
} from "../constants/action-types";

const getInitialState = () => ({
  allowOpenDialog: true,
  articles: [],
  user: null,
  theme: getPreferredTheme()
});

function getPreferredTheme() {
  let theme = localStorage.getItem(THEME)

  if(defined(theme) && theme === THEME_LIGHT) {
    return THEME_LIGHT
  }
  else {
    return THEME_DARK
  }
}

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
    case USER_LOGGED_IN:
      return UserLoggedInReducer(state, action)
    case LOG_OUT:
      return LogOutReducer(state, action);
    case TOGGLE_DARK_THEME:
      return ToggleDarkThemeReducer(state, action);
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

function UserLoggedInReducer(state, action) {
  console.log("Inside UserLoggedInReducer");

  console.log("UserLoggedInReducer action:");
  console.log(action);

  return Object.assign(
    {},
    state,
    {
      ...state,
      user: action.payload.user
    }
  )
}

function LogOutReducer(state, action) {
  console.log("Inside LogOutReducer");

  console.log("LogOutReducer state:");
  console.log(state)

  console.log("LogOutReducer action:");
  console.log(action);
  let that = action.payload.that;

  try {
    Auth.signOut({ global: true });
  }
  catch(error) {
    let e = null;
    !error.message ? e = { "message" : error } : e = error;

    console.log("Error signing out. error:");
    console.log(e)
  }

  that.props.history.push("/login");

  return Object.assign(
    {},
    state,
    {
      ...state,
      user: null
    }
  )
}

function ToggleDarkThemeReducer(state, action) {
  console.log("Inside ToggleDarkThemeReducer");
  
  let theme = state.theme;
  if(theme === THEME_DARK) {
    theme = THEME_LIGHT
  }
  else {
    theme = THEME_DARK
  }
  
  localStorage.setItem(THEME, theme)
  
  return Object.assign(
    {},
    state,
    {
      ...state,
      action: action,
      theme: theme
    }
  )
}


export default rootReducer;

