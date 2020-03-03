////////////////////////////////////////////////////////////////////
// Boilerplate code to handle state changes

// This function is called whenever any of the fields are changed
function handleChange(event) {
  // Update the store state to reflect the new value of the field that was changed
  this.setState({ [event.target.id]: event.target.value });

  // Field-specific function to update the available values in the Priority dropdown
  // based on the new value chosen by the user in the Order Type drop down, if any
  this.updatePriorityOptions(event);
}

export default handleChange;