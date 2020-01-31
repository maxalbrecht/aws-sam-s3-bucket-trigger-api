import { ONE_DAY, TWO_DAYS, THREE_DAYS, FOUR_DAYS } from "../../../constants/priority_options"
import { Manual } from "../../../constants/order_types"

//////////////////////////////////////////////////////////////////////////////////
// Function to update the available values in the Priority dropdown
// based on the new value chosen by the user in the Order Type drop down, if any
function updatePriorityOptions(event) {
  if (event.target.id === "orderType") {
    var options = [ONE_DAY, TWO_DAYS];
    var priority = this.state.priority;

    if (event.target.value === Manual) {
      options.push(THREE_DAYS);
      options.push(FOUR_DAYS);
    }
    else if (this.state.priority === THREE_DAYS || this.state.priority === FOUR_DAYS) {
      priority = ONE_DAY;
    }

    var newState = {
      ...this.state,
      orderType: event.target.value,
      priority: priority,
      priorityOptions: options
    }

    this.setState(newState)
  }
}

export default updatePriorityOptions;