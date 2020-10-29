// src/js/actions/index.js

import { ADD_ARTICLE, API_CALL_FINISHED, ADD_ARCHIVED_JOB, ADD_STITCHED_FILE } from "../constants/action-types";

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}

export function AddArchivedJob(payload) {
  return { type: ADD_ARCHIVED_JOB, payload }
}
export function AddStitchedFile(payload){
  return { type: ADD_STITCHED_FILE, payload }
}

export function apiCallFinished(payload) {
  console.log("executing updateStatus(payload) in the actions definitions file...");
  sleep(1000).then(() => {
    return { type: API_CALL_FINISHED, payload };
  })
  
}