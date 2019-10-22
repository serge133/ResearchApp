import React, { Component, Fragment } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Todo from '../Components/openWebsite/TodoList/Todo';



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
    this.state = {
      editTodoPopup: false,
      todoSelected: {id: '', content: '', finished: false}
    }
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

  editTodoAndClosePopup = () => {
    this.props.editItem();
    this.setState({editTodoPopup: false});
  }

  deleteTodoAndClosePopup = () => {
    this.props.deleteItem();
    this.setState({
      editTodoPopup: false,
      todoSelected: {id: '', content: '', finished: false}
    })
  }

  editTodoPopup = () => (
    <div className="fadeScreen">
        <div className="closePopup" onClick={() => this.setState({editTodoPopup: false})}>x</div>
        <section className="popup">
          <h1>EDIT TODO</h1>
            <input type="hidden" value={this.state.todoSelected.id} id="editSelectedTodoID"/>
            <input type="text" defaultValue={this.state.todoSelected.content} id="editTodoContent"/>
            <button onClick={this.editTodoAndClosePopup}>Submit</button>
            <button onClick={this.deleteTodoAndClosePopup}>Delete</button>
        </section>
      </div>
  );

  openEditTodoPopup = todo => {
    this.setState({
      editTodoPopup: true,
      todoSelected: todo
    });
  }


  render() {
    const { items, finishItem } = this.props;
    return (
      <Fragment>
        {this.state.editTodoPopup ? this.editTodoPopup() : null}
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
                  <Todo 
                      item = {item} 
                      key={item.id} 
                      index={index}
                      getItemStyle={getItemStyle}
                      finishItem={finishItem}
                      editItemPopup = {this.openEditTodoPopup}/>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Fragment>
    );
  }
}

export default TodoList;
