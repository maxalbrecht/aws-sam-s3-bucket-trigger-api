import defined from "../../../../utils/defined";
import { REMOVE_DOC } from "../../../../constants/action-types";
import ClearStateAction from "../../../../utils/clearStateAction";
const uuidv4 = window.require("uuid/v4")

function mapStateToProps(state, ownProps) {
  //^^//console.log("Inside doc.logic mapStateToProps()...")
  let update = {};
  let draggableId = ownProps.doc.id;

  if(defined(state.action) 
      && (state.action.type === REMOVE_DOC) 
      && (state.action.payload.draggableId === draggableId)
    ) {
    update.removeDoc = true;
    //^^//console.log("update.removeDoc:");
    //^^//console.log(update.removeDoc);
    
    ClearStateAction(window.store);
    update.TriggerRender = uuidv4();
  }
  
  return update
}

export default mapStateToProps;