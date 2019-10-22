import React from 'react';
import './Todo.css';

// assets
import editSVG from '../../../assets/threeDotMenu.svg';

import { Draggable } from 'react-beautiful-dnd'

const TodoList = props => {
    const {
    item,
    index,
    getItemStyle,
    finishItem,
    editItemPopup
    } = props;


    const { id, content, finished } = item;

    return (
        <Draggable draggableId={id} index={index} key={id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      className={finished ? "todoList_draggable-finished" : "todoList_draggable"}
                    >
                      <div onClick={() => finishItem(id)} className="finishItem"/>
                      {content}
                      <img src={editSVG} 
                        className="editItem" 
                        alt="Edit Todo" 
                        onClick={() => editItemPopup(item)}/>
                    </div>
                  )}
        </Draggable>
    );
}

export default TodoList;