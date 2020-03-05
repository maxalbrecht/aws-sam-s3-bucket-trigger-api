async function handleChange(event) {
  await this.setState({ [event.target.id]: event.target.value })
}

export default handleChange