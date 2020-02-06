function RemoveDoc(draggableId) {
  console.log("inside syncApp RemoveDoc...");
  console.log("this.state:");
  console.log(this.state);

  var newDocs = {...this.state.sourceFiles.docs};
  delete newDocs[draggableId];
  var newColumnOneDocIds = [...this.state.sourceFiles.columns["column-1"].docIds]

  const DraggableIndex = newColumnOneDocIds.indexOf(draggableId)
  if(DraggableIndex > -1) {
    newColumnOneDocIds.splice(DraggableIndex, 1);
  }

  const newState = {
    ...this.state,
    sourceFiles: {
      ...this.state.sourceFiles,
      docs: newDocs,
      columns: {
        ...this.state.sourceFiles.columns,
        'column-1': {
          ...this.state.sourceFiles.columns['column-1'],
          docIds: newColumnOneDocIds
        }
      }
    }
  }

  console.log("App.logic RemoveDoc() newState:");
  console.log(newState);

  this.setState(newState);

  console.log("App.logic RemoveDoc() this.state");
  console.log(this.state);
}

export default RemoveDoc; 