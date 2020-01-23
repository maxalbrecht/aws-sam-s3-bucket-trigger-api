function handleChange(event) {
  this.setState({ [event.target.id]: event.target.value });

  this.updatePriorityOptions(event);
}

export {
  handleChange
}