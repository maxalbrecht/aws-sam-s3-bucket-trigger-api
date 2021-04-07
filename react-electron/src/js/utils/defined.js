// Returns false if the parameter passed to it (and its properties, if any) is either undefined or null,
// and returns true otherwise
function defined(param, ...propertyPaths) {
  let result = true

  if(param === undefined || param === null) {
    result = false
  } else {
    for (let i = 0; i < propertyPaths.length; i++) {
      let currentObject = param
      let properties = propertyPaths[i].split('.')

      for (let j = 0; j < properties.length; j++) {
        if(defined( currentObject[properties[j]] )) {
          currentObject = currentObject[properties[j]]
        } else {
          console.log(`utils.defined(): the following property is not defined: [param].${(properties.slice(0, j + 1)).join(".")}`)

          result = false
          break
        }
      }
    }
  }

  return result
}

export default defined;