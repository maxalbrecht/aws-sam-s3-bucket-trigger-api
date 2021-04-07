// src/js/constants/action-types.js

const ADD_SYNC_APP_TO_STORE = "ADD_SYNC_APP_TO_STORE";
const ADD_STITCH_APP_TO_STORE = "ADD_STITCH_APP_TO_STORE";
const ADD_MPEG1_CONVERSION_APP_TO_STORE  = "ADD_MPEG1_CONVERSION_APP_TO_STORE "
const ADD_ARTICLE = "ADD_ARTICLE";
const API_CALL_FINISHED = "API_CALL_FINISHED";
const TOGGLE_JOB_DETAILS = "TOGGLE_JOB_DETAILS"
const CLEAR_STATE_ACTION = "CLEAR_STATE_ACTION";
const DISALLOW_OPEN_DIALOG = "DISALLOW_OPEN_DIALOG"; 
const ALLOW_OPEN_DIALOG = "ALLOW_OPEN_DIALOG"; 
const REMOVE_DOC = "REMOVE_DOC";
const SET_AUTH_STATE = "SET_AUTH_STATE";
const USER_LOGGED_IN = "USER_LOGGED_IN";
const LOG_OUT = "LOG_OUT";
const TOGGLE_DARK_THEME = "TOGGLE_DARK_THEME";
const CHECK_USER_ACTIVITY = "CHECK_USER_ACTIVITY";
const GO_TO_LOGIN_IF_LOGGED_OFF = "GO_TO_LOGIN_IF_LOGGED_OFF";
const DRAGGING_JOB = "DRAGGING_JOB"
const JOB_ARCHIVING_FINISHED = "JOB_ARCHIVING_FINISHED"
const FILE_STITCHING_QUEUED = "FILE_STITCHING_QUEUED"
const MPEG1_CONVERSION_FINISHED = "MPEG1_CONVERSION_FINISHED"
const ADD_ARCHIVED_JOB = "ADD_ARCHIVED_JOB"
const ADD_STITCHED_FILE = "ADD_STITCHED_FILE"
const ADD_MPEG1_CONVERSION_JOB = "ADD_MPEG1_CONVERTED_MPEG1S_JOB"
const MPEG1_CONVERSION_THIRD_PARTY_JOB_CREATED = "MPEG1_CONVERSION_THIRD_PARTY_JOB_CREATED" 
const RECEIVED_MPEG1_CONVERSION_JOB_UPDATE = "RECEIVED_MPEG1_CONVERSION_JOB_UPDATE"
const GET_STITCHING_JOB_STATUS_UPDATE = "GET_STITCHING_JOB_STATUS_UPDATE"

export {
  ADD_SYNC_APP_TO_STORE,
  ADD_STITCH_APP_TO_STORE, 
  ADD_MPEG1_CONVERSION_APP_TO_STORE, 
  ADD_ARTICLE,
  API_CALL_FINISHED,
  TOGGLE_JOB_DETAILS,
  CLEAR_STATE_ACTION,
  DISALLOW_OPEN_DIALOG,
  ALLOW_OPEN_DIALOG,
  REMOVE_DOC,
  SET_AUTH_STATE,
  USER_LOGGED_IN,
  LOG_OUT,
  TOGGLE_DARK_THEME,
  CHECK_USER_ACTIVITY,
  GO_TO_LOGIN_IF_LOGGED_OFF,
  DRAGGING_JOB,
  JOB_ARCHIVING_FINISHED,
  FILE_STITCHING_QUEUED, 
  MPEG1_CONVERSION_FINISHED,
  ADD_ARCHIVED_JOB,
  ADD_STITCHED_FILE,
  ADD_MPEG1_CONVERSION_JOB,
  MPEG1_CONVERSION_THIRD_PARTY_JOB_CREATED, 
  RECEIVED_MPEG1_CONVERSION_JOB_UPDATE,
  GET_STITCHING_JOB_STATUS_UPDATE
}