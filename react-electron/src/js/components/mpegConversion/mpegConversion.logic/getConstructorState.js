import initialData from './../../dnd_list/initial-data'

function getConstructorState() {
  return {
    jobNumber: "",
    sourceFiles: initialData,
    errors: {}
  }
}

export default getConstructorState