import defined from './../../../../utils/defined'

async function handleChange(event) {
  await this.setState({ [event.target.id]: event.target.value });

  if(
    defined(this.state)
    && defined(this.state.attemptingLogin)
    && this.state.attemptingLogin === true
  ) {
    this.ValidateLoginFields();
  }
  else if (
    defined(this.state)
    && defined(this.state.attemptingConfirm)
    && this.state.attemptingConfirm === true
  ) {
    this.ValidateLoginFields()
  }
}

export default handleChange;