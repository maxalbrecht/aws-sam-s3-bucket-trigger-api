//import initialData from "../../dnd_list/initial-data"
import initialData from './../../dnd_list/initial-data'

function getConstructorState() {
  return{
    jobNumber: "",
    destinationFileName: "",
    sourceFiles: initialData,
    errors: {

    }
  }
}

export default getConstructorState