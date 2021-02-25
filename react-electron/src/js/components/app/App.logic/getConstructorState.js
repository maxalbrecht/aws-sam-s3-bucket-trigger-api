import Deposition from "../../../classes/deposition/deposition"
import { NORMAL, HIGH } from "../../../constants/priority_options"
import { QuickSync } from "../../../constants/order_types"
import initialData from '../../dnd_list/initial-data'

//////////////////////////////////////////////////////////////////////////
// Boilerplate code to connect these logic files to the React Component
function getConstructorState() {
  return {
    id: "",
    title: "",
    jobNumber: "",
    sourceFiles: initialData,
    orderType: QuickSync,
    priorityOptions: [NORMAL, HIGH],
    priority: NORMAL,
    notes: "",
    deposition: new Deposition() 
  }
}

export default getConstructorState