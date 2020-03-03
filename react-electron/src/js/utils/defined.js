// Returns false if the parameter passed to it is either undefined or null,
// and returns true otherwise
function defined(param) {
  if(param === undefined || param === null) {
    return false;
  }
  else {
    return true;
  }
}

export default defined;