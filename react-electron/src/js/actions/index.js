// src/js/actions/index.js

import {
  ADD_ARTICLE,
  API_CALL_FINISHED,

  ADD_ARCHIVED_JOB,
  JOB_ARCHIVING_FINISHED,

  ADD_STITCHED_FILE,
  FILE_STITCHING_QUEUED,

  ADD_MPEG1_CONVERSION_JOB,
  MPEG1_CONVERSION_FINISHED
} from "../constants/action-types";

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}

export function AddArchivedJob(payload) {
  return { type: ADD_ARCHIVED_JOB, payload }
}
export function addStitchedFile(payload){
  return { type: ADD_STITCHED_FILE, payload }
}

export function addMpeg1ConversionJob(payload){
  return { type: ADD_MPEG1_CONVERSION_JOB, payload }
}

export function apiCallFinished(payload) {
  console.log("executing updateStatus(payload) in the actions definitions file...");
  sleep(1000).then(() => {
    return { type: API_CALL_FINISHED, payload };
  })
}

export function fileStitchingQueued(payload) {
  console.log("executing fileStitchingQueued(payload) in the actions definitions file...")

  sleep(1000).then(
    () => {
      return { type: FILE_STITCHING_QUEUED, payload }
    }
  )
}

export function jobArchivingFinished(payload) {
  console.log(" executing jobArchivingFinished(payload) in the actions definitions file...")

  sleep(1000).then(
    () => {
      return { type: JOB_ARCHIVING_FINISHED, payload }
    }
  )
}

export function mpeg1ConversionFinished(payload) {
  console.log("executing mpeg1ConversionFinished(payload) in the actions definitions file...")

  sleep(1000).then(
    () => {
      return { type: MPEG1_CONVERSION_FINISHED, payload }
    }
  )
}



