function checkIfDirectoryExists(directory) {
  let fs = window.require("fs");
  try {
    fs.accessSync(directory);
    return true;
  }
  catch (e) {
    return false;
  } 
}

export {
  checkIfDirectoryExists
}