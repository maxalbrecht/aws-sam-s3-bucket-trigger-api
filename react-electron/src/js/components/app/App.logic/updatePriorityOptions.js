import { NORMAL, HIGH, ONE_DAY, TWO_DAYS, THREE_DAYS, FOUR_DAYS } from "../../../constants/priority_options"
import { QuickSync, ManualSync } from "../../../constants/order_types"

//////////////////////////////////////////////////////////////////////////////////
// Function to update the available values in the Priority dropdown
// based on the new value chosen by the user in the Order Type drop down, if any
function updatePriorityOptions(event) {
  if (event.target.id === "orderType") {
    var options = [];
    var priority = this.state.priority;

    if (event.target.value === ManualSync) {
      options.push(ONE_DAY);
      options.push(TWO_DAYS);
      options.push(THREE_DAYS);
      options.push(FOUR_DAYS);
    }
    else if (event.target.value === QuickSync) {
      options.push(NORMAL);
      options.push(HIGH);

      priority = NORMAL;
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