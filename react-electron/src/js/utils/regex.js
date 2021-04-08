import Logging from './logging'
import defined from './defined'

export const Regex = {
  ReplaceJSONPlaceHolders(jsonTemplate, ...args){
    //      This function should take a json template and a number of parameters.
    //      Each of the parameters is expected to be an object with one key-value pair.
    //      For each of the parameters, it should scan the json template and replace
    //      any instances of the the parameter's placeholder with the
    //      parameter values, as well as any necessary formatting, such as quotation marks.
    let finishedTemplate = JSON.stringify(jsonTemplate);
    for (let arg of args) {
      for (let key in arg){
        if(arg.hasOwnProperty(key)){
          let argKey = key;
          let argValue = arg[argKey];

          Logging.log("argKey:", argKey, "argValue:", argValue)

          if(argValue != null){
            finishedTemplate = 
              finishedTemplate
                .replace("\""+argKey+"_val\"", "\""+argValue+"\"" )
                .replace("\""+argKey+"_val_date\"", "\""+argValue+"\"" )
                .replace("\""+argKey+"_val_array\"", argValue)
                .replace("\""+argKey+"_val_int\"", argValue)
                .replace(
                  "\""+argKey+"_val_object\"",
                  JSON.stringify(argValue)
                    .replace("\\\"", "\"")
                    .replace("\"{", "{")
                    .replace("}\"", "}")
                )
                .replace("\"null\"", "null")
          }
        }
      }
    }

    return finishedTemplate;
  },
  endsWithOneOf(string, endingsList) {
    let result = false

    endingsList.forEach(ending => {
      if (string.endsWith(ending)) result = true
    })

    return result
  },
  defaultIfNotDefined(defaultValue, param, propertyPath) {
    if(defined(param, propertyPath)) {
      let currentObject = param
      let properties = propertyPath.split('.')

      for (let j = 0; j < properties.length; j++) {
        currentObject = currentObject[properties[j]]
      }

      return currentObject
    }
    else {
      return defaultValue
    }
  }
}

export default Regex