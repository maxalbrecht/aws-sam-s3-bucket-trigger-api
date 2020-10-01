//src/js/middleware/index.js

import { ADD_ARTICLE, API_CALL_FINISHED, TOGGLE_JOB_DETAILS, REMOVE_DOC, ADD_ARCHIVED_JOB } from '../constants/action-types';
import { AddArchivedJob } from '../actions';
//const forbiddenWords = ["spam", "money"];
const forbiddenWords = [];

export function rootMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      let returnAction = null;

      switch (action.type) {
        case ADD_ARTICLE:
          returnAction = AddArticleMiddleware(action);
          break;
        case API_CALL_FINISHED:
          returnAction = UpdateStatusMiddleware(action);
          break;
        case TOGGLE_JOB_DETAILS:
          returnAction = ToggleJobDetailsMiddleware(action);
          break;
        case REMOVE_DOC:
          returnAction = RemoveDocMiddleware(action);
          break;
        case ADD_ARCHIVED_JOB:
          returnAction = AddArchivedJobMiddleware(action);
          break;
        default:
          break;
      }

      if (returnAction !== undefined && returnAction !== null) {
        console.log("about to next(returnAction)");
        return next(returnAction);
      } else {
        console.log("The action has been checked in the rootMiddleware and no new action has bee generated to intercept it. The action is the following:");
        console.log(action);
        return next(action);
      }
    }
  }
}

function AddArticleMiddleware(actionParam) {
  console.log("Adding article... Currently in AddArticleMiddleware()");
  console.log(`action.payload:\n${JSON.stringify(actionParam.payload)}`)

  const foundWord = forbiddenWords.filter(word =>
    actionParam.payload.jobNumber.includes(word)  
  );

  if (foundWord.length) {
    console.log("Found a disallowed word");
  }
}

function AddArchivedJobMiddleware(actionParam) {
  console.log("Adding archived job... Currently in AddArchivedJobMiddleware()")
  console.log("actionParam:");
  console.log(actionParam);

}

function UpdateStatusMiddleware(actionParam) {
  console.log("Updating Status... Currently UpdateStatusMiddleware()");
  console.log("actionParam:");
  console.log(actionParam);
  console.log("store.getState:");
  console.log(window.store.getState());
}

function ToggleJobDetailsMiddleware(actionParam) {
  console.log("Toggling JobDetails... Currently in ToggleJobDetailsMiddleware()");
  console.log("actionParam:");
  console.log(actionParam);
}

function RemoveDocMiddleware(actionParam) {
  console.log("Inside RemoveDocMiddleware");
  console.log("actionParam:");
  console.log(actionParam);
}