function handleJobNumberPressEnterKey(event){
  if(event.key === "Enter"){
    //event.preventDefault()
    this.handleSubmit()
  }
}

export default handleJobNumberPressEnterKey