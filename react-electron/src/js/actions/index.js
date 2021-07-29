// src/js/actions/index.js

import {
  ADD_ARTICLE,
  API_CALL_FINISHED,

  ADD_ARCHIVED_JOB,
  JOB_ARCHIVING_FINISHED,

  ADD_STITCHED_FILE,
  FILE_STITCHING_QUEUED,

  ADD_MPEG_CONVERSION_JOB,
  MPEG_CONVERSION_FINISHED,

  ADD_LOCAL_DOWNLOAD_JOB
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

export function addMpegConversionJob(payload){
  return { type: ADD_MPEG_CONVERSION_JOB, payload }
}

export function addLocalDownloadJob(payload) {
  return { type: ADD_LOCAL_DOWNLOAD_JOB, payload }
}

export function apiCallFinished(payload) {
  //^^//console.log("executing updateStatus(payload) in the actions definitions file...");
  sleep(1000).then(() => {
    return { type: API_CALL_FINISHED, payload };
  })
}

export function fileStitchingQueued(payload) {
  //^^//console.log("executing fileStitchingQueued(payload) in the actions definitions file...")

  sleep(1000).then(
    () => {
      return { type: FILE_STITCHING_QUEUED, payload }
    }
  )
}

export function jobArchivingFinished(payload) {
  //^^//console.log(" executing jobArchivingFinished(payload) in the actions definitions file...")

  sleep(1000).then(
    () => {
      return { type: JOB_ARCHIVING_FINISHED, payload }
    }
  )
}

export function mpegConversionFinished(payload) {
  //^^//console.log("executing mpegConversionFinished(payload) in the actions definitions file...")

  sleep(1000).then(
    () => {
      return { type: MPEG_CONVERSION_FINISHED, payload }
    }
  )
}



