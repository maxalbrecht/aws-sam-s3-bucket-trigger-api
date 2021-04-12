import ClearStateAction from './../../../../utils/clearStateAction'
var store = window.store

function UpdateComponent(state){
  ClearStateAction(store)
}

export default UpdateComponent