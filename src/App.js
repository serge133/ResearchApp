import React, { useState, useEffect } from 'react';
import './App.css';

import axios from 'axios';
import nanoid from 'nanoid';

// Containers
import Workspace from './Containers/Workspace';

const App = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    axios.get('https://central-rush-249500.firebaseio.com/workspaces.json').then( response => {
      const { data } = response;
      if(data){
        const modulatedData = Object.values( data );
      // prevent errors saying website doesn't exist 
      // Websites is an object
        modulatedData.forEach( d => {
          if(d.websites)return;
          d.websites = {}
        });
        setWorkspaces(modulatedData);
      }
    })
  }, []);

  const addWorkspace = () => {
    if(workspaces.length >= 3)return setPopup(false);
    const workspaceName = document.getElementById('addWorkspaceName').value;
    const workspace = {
      id: nanoid(),
      name: workspaceName,
      websites: [],
      open: false
    }
    setWorkspaces(workspaces.concat([workspace]));
    setPopup(false);
    axios.put(`https://central-rush-249500.firebaseio.com/workspaces/${workspace.id}.json`, workspace)
  }

  const Popup = (
    <div className="fadeScreen">
      <div className="closePopup" onClick={() => setPopup(false)}>x</div>
      <section className="popup">
          <input type="text" placeholder="Workspace Name" id="addWorkspaceName"/>
          <button onClick={addWorkspace}>Submit</button>
      </section>
    </div>
  );

  const Workspace_props = {
    workspaces: workspaces,
    setWorkspaces: setWorkspaces
  }

  return (
    <div className="App">
      <button onClick={() => setPopup(true)} 
        className="addWorkspaceBtn">Add Workspace</button>
      {popup ? Popup : null}
      {workspaces.map( m => (
        <Workspace workspace = {m} key={m.id} {...Workspace_props}/>
      ))}
    </div>
  );
}

export default App;
