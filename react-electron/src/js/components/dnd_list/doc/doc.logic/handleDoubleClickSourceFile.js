const { shell } = window.require('electron')

function handleDoubleClickSourceFile(e) {
  if (this.props.doc.content.toLowerCase().endsWith(".txt")) {
    //^^//console.log("opening the following file:");
    //^^//console.log(this.props.doc.content);
    
    shell.openExternal(this.props.doc.content);
  }
}

export default handleDoubleClickSourceFile;