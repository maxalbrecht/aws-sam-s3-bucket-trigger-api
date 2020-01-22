//src/js/middleware/index.js

import { ADD_ARTICLE, API_CALL_FINISHED } from '../constants/action-types';
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

function AddArticleMiddleware(action) {
  console.log("Adding article... Currently in AddArticleMiddleware()");
  console.log(`action.payload:\n${JSON.stringify(action.payload)}`)

  const foundWord = forbiddenWords.filter(word =>
    action.payload.jobNumber.includes(word)  
  );

  if (foundWord.length) {
    console.log("Found a disallowed word");
  }
}

function UpdateStatusMiddleware(actionParam) {
  console.log("Updating Status... Currently UpdateStatusMiddleware()");
  console.log("actionParam:");
  console.log(actionParam);
  console.log("store.getState:");
  console.log(window.store.getState());
}