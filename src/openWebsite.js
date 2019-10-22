import React, { useState, useEffect } from 'react';

import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './openWebsite.css';
import { Link } from 'react-router-dom';
import nanoid from 'nanoid';
// Assets
import menuSVG from './assets/menu.svg';
import backSVG from './assets/back.svg';

import { quillModules } from './Config/Quill';

// Containers
import TodoList from './Containers/TodoList';

const OpenWebsite = ({ match }) => {
    const workspaceID = match.params.workspaceID;
    const websiteID = match.params.websiteID;

    const [website, setWebsite] = useState({
        id: websiteID,
        name: '',
        // The open has nothing to do with the open website only for the dashboard
        open: false,
        notes: '',
        todos: [],
        url: ''
    });


    const [expandMenu, setExpandMenu] = useState(false);

    const websiteURL = `https://central-rush-249500.firebaseio.com/workspaces/${workspaceID}/websites/${websiteID}`

    useEffect(() => {
        axios.get(websiteURL + '.json')
        .then( response => {
           const website = response.data;
           if(website){
            
            // prevent errors saying todos doesn't exist 
            // Websites is an object
                if(!website.todos)website.todos = [];
                setWebsite(website);
            };
        });
    }, [websiteURL]);


    const {name, notes, todos, url} = website;

    const saveContent = content => {
        if(name.length === 0)return;
            setWebsite({...website, notes: content})
            axios.patch(websiteURL + '.json', {notes: content});
    }

    // Todo List Set up down here!
    const [popups, setPopups] = useState({
        addTodo: false,
    });

    const setTodoListOrder = items => {
        setWebsite({...website, todos: items});
        axios.put(websiteURL + '/todos.json', items);
    }

    const addTodoListItem = () => {
        const todoContent = document.getElementById('addTodoContent').value;
        const todo = {
            id: nanoid(),
            content: todoContent,
            finished: false
        }
        const todos = website.todos.concat([todo]);
        setPopups({addTodo: false, editTodo: false});
        setWebsite({...website, todos: website.todos.concat([todo])});

        // Database
        axios.put(websiteURL + '/todos.json', todos);
    }

    const todoPopup = (
        <div className="fadeScreen">
            <div className="closePopup" onClick={() => setPopups({addTodo:false, editTodo: false})}>x</div>
            <section className="popup">
               <input type="text" id="addTodoContent" placeholder="I am going to do..."/>
               <button onClick={addTodoListItem}>Submit</button>
            </section>
        </div>
    );

    const finishTodo = todoID => {
        const copyTodos = [...website.todos];
        const finishIndex = copyTodos.findIndex( todo => todo.id === todoID);
        if(finishIndex < 0)return;
        const toggle = !copyTodos[finishIndex].finished;
        copyTodos[finishIndex].finished = toggle;
        setWebsite({...website, todos: copyTodos});
        axios.put(websiteURL + '/todos.json', copyTodos);
    }

    const editTodo = () => {
        const todoID = document.getElementById('editSelectedTodoID').value;
        const todoContent = document.getElementById('editTodoContent').value;
        const copyTodos = [...website.todos];
        const editIndex = copyTodos.findIndex( todo => todo.id === todoID);
        if(editIndex < 0)return;
        copyTodos[editIndex].content = todoContent;
        setWebsite({...website, todos: copyTodos});
        // Database
        axios.put(websiteURL + '/todos.json', copyTodos);
    }

    const deleteTodo = () => {
        const todoID = document.getElementById('editSelectedTodoID').value;
        const copyTodos = [...website.todos];
        const deleteIndex = copyTodos.findIndex( todo => todo.id === todoID);
        if(deleteIndex < 0)return;
        copyTodos.splice(deleteIndex, 1);
        setWebsite({...website, todos: copyTodos});
        axios.put( websiteURL + '/todos.json', copyTodos);
    }


    const todolist_props = {
        items: todos,
        setTodoListOrder: setTodoListOrder,
        finishItem: finishTodo,
        editItem: editTodo,
        deleteItem: deleteTodo
    }

    return (
        <div className="openWebsite">
            {popups.addTodo ? todoPopup : null}

            <section className={ expandMenu ? "topLeftExpand" : "topLeft"}>
                <Link to="/"><img className="menuBtn" src={backSVG} alt="Open Menu"/></Link>
                <img onClick={() => setExpandMenu(!expandMenu)} className="menuBtn" src={menuSVG} alt="Open Menu"/>
                <a href={url} className="menuBtn" target="_blank" rel="noopener noreferrer">{name}</a>
            </section>
            { expandMenu ?
            <section className="expandMenu">
                <button onClick={() => setPopups({addTodo: true, editTodo: false})} className="addTodoBtn">+</button>
                <TodoList {...todolist_props}/>
            </section> :
            <section className="menu"/>
            }
            <section className="details">

            </section>
            <ReactQuill
                onChange={(content, delta, source, editor) => saveContent(content)}
                value={notes}
                className="textEditor"
                theme="snow"
                modules={{toolbar: quillModules}}/>
        </div>
    );
}

export default OpenWebsite;