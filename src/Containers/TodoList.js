import React, { Component } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import TodoListComponent from '../Components/openWebsite/TodoList/TodoList';



// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? "lightblue" : "lightgrey",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // change background colour if dragging
    border: '1px solid #ccc',
    borderLeft: isDragging ? '3px solid lightblue' : '1px solid #ccc',
  // styles we need to apply on draggables
  ...draggableStyle
});



class TodoList extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const { items, setTodoListOrder} = this.props;

    const ReorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setTodoListOrder(ReorderedItems);

  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { items, finishItem } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              className="TodoList"
            >
              {items.map((item, index) => (
                <TodoListComponent 
                    item = {item} 
                    key={item.id} 
                    index={index}
                    getItemStyle={getItemStyle}
                    finishItem={finishItem}/>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default TodoList;
