function handleJobNumberPressEnterKey(event){
  if(event.key === "Enter"){
    event.preventDefault()
    this.handleClickBrowse()
  }
}

export default handleJobNumberPressEnterKey