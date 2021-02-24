////////////////////////////////////////////////////////////////////
// React-beautiful-dnd methods to handle user interactions
// with the drag-and-drop list
import defined from '../../../utils/defined';

function onDragStart() {
  //this.style.color = 'orange';
  //this.style.transition = 'background-color 0.2s ease'
  console.log("Drag started...");
};

function onDragUpdate(update) {
  //const { destination } = update;
  //const opacity = destination
  //  ? destination.index / Object.keys(this.state.sourceFiles.docs).length
  //  : 0;
  //this.style.backgroundColor = 'rgba(153, 141, 217, ${opacity})';
  console.log("Drag update...");

}

function onDragEnd(result) {
  //this.style.color = 'black';
  //this.style.backgroundColor = 'beige';
  console.log("drag ending...");

  const { destination, source, draggableId } = result;

  if (
    !defined(destination)
    || (
      destination &&
      destination.droppabbleId &&
      destination.droppableId === source.droppableId &&
      destination.Index === source.index
    )
  ) {
    return;
  }

  const column = this.state.sourceFiles.columns[source.droppableId]
  let newDocs = this.state.sourceFiles.docs;
  const newDocIds = Array.from(column.docIds);
  newDocIds.splice(source.index, 1);
  if (destination) { //this if statement allows us to delete items if they
                     // are dropped outside of a droppable item
    newDocIds.splice(destination.index, 0, draggableId);
  }


  const newColumn = {
    ...column,
    docIds: newDocIds,
  };

  const newState = {
    ...this.state,
    sourceFiles: {
      docs: newDocs,
      columns: {
        ...this.state.sourceFiles.columns,
        [newColumn.id]: newColumn,
      },
      columnOrder: Array.from(this.state.sourceFiles.columnOrder)
    },
  };

  this.setState(newState);
}

export {
  onDragStart,
  onDragUpdate,
  onDragEnd
}