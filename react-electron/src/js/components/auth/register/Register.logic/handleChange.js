import defined from './../../../../utils/defined'

async function handleChange(event) {
  await this.setState({ [event.target.id]: event.target.value });

    if (
    defined(this.state)
    && defined(this.state.attemptingRegistration)
    && this.state.attemptingRegistration === true
  ) {
    this.ValidateRegisterFields();
  }
}

export default handleChange;