import UpdateComponent from './updateComponent'
import defined from '../../../../utils/defined'
const uuidv4 = window.require("uuid/v4")

// This mapStateToProps method will be run for all list items whenever any of the list items is updated
// Therefore, for each list item we need loop through state.articles, and find the list item's corresponding
// record in the state.articles array.
// Once we have made sure that, for the current list item, we have found the correct state.articles record,
// we check if an action was passed along with the state, and it there was, we check that the current list item
// corresponds to the list item that triggered the action in the first place.
// Once we have dealt with the action, we then need delete the action from the state, or else we will
// keep toggling this list item, even if the action sent in is actually to insert a new list item into the list.
// We do not want the next action to be responsible for clearing out the old action, because that could make it
// difficult to debug.
// The reason we did not simply save whether job details is expanded or collapsed in each record of state.articles
// is that we are trying to maintain separation of concerns; in this case we want to keep all UI-related information
// within each UI component, and use the store only to save data that is used in the business logic (as opposed to
// how the data is displayed to the user).
function mapStateToProps(state, ownProps) {
  let update = {};

  // Loop through all state.articles
  state.articles.forEach(article => {
    // Make sure the current state.articles article corresponds to the current ListItem
    if (article.id === ownProps.ListItemObject.id ) {
      // Check that an action was passed along with the state, and that the current list item
      // is the list item that triggered the action.
      if (defined(state.action) && (article.id === state.action.payload.ListItemObject.id)) {
        UpdateComponent(state);

        update.TriggerRender = uuidv4();
      }
      // If there isn't an action provided with the state, or the current state did not create the action,
      // we assume that the action created was to update the api call status. Note that here we 
      // do not check that the current list item is the item that created the item in the first place
      else {
        update.APICallStatus = article.apiCaller.APICallStatus; 
      }
    }
  });
  
  return update;
}

export default mapStateToProps;