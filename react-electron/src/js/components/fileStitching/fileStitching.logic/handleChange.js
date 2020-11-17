import defined from './../../../utils/defined'
async function handleChange(event) {
  await this.setState({ [event.target.id]: event.target.value })

  if(defined(this.state)){
    this.ValidateFileStitchingFields()
  }
}

export default handleChange