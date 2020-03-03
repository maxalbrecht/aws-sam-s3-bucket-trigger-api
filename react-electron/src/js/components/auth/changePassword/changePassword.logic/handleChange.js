import defined from './../../../../utils/defined'

async function handleChange(event) {
  await this.setState({ [event.target.id]: event.target.value });
  if (
    defined(this.state)
    && defined(this.state.attemptingChangePassword)
    && this.state.attemptingChangePassword === true
  ) {
    this.ValidateChangePasswordFields();
  }
}

export default handleChange;