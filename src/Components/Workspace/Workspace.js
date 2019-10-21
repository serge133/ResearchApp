import React, { useState } from 'react';
import './Workspace.css';

import { Link } from 'react-router-dom';

const Workspace = props => {
    const {
    workspaces,
    workspace,
    addWebsite,
    expandWebsite,
    moveTo,
    deleteWebsite,
    saveDescription,
    deleteWorkspace
    } = props;

    const [popup, setPopup] = useState(false);

    const closePopupandAddWebsite = () => {
        setPopup(false);
        addWebsite()
    };


    const Popup = (
        <div className="fadeScreen">
            <div className="closePopup" onClick={()=>setPopup(false)}>x</div>
            <section className="popup">
                <input id="addWebsiteName" type="text" placeholder="Website Name"/>
                <input id="addWebsiteURL" type="text" placeholder="Website URL"/>

                <button onClick={closePopupandAddWebsite}>Submit</button>
            </section>
        </div>
    );

    
    const [moveToPopup, setMoveToPopup] = useState({
        show: false,
        clickedWebsite: {
            id: '',
            name: '',
            description: '',
            url: '',
            open: false
        }
    });


    const closeMoveToPopup = () => {
        setMoveToPopup({
            show: false,
            clickedWebsite: {
                id: '',
                name: '',
                description: '',
                url: '',
                open: false
            }
        })
    }

    const MoveToPopup = (
        <div className="fadeScreen">
            <div className="closePopup" onClick={closeMoveToPopup}>x</div>
            <section className="moveToPopup popup">
               {workspaces.map( w => <div 
                    key={w.id} className="moveToBtn" 
                    onClick={() => moveTo(moveToPopup.clickedWebsite, w.id)}>
                        <h2>{w.name}</h2>
                        {Object.values(w.websites).map( website => (
                            <div 
                            key={website.id} 
                            className="previewWebsites" 
                            style={website.id === moveToPopup.clickedWebsite.id ? {border: '1px solid tomato'} : null}>
                                {website.name}
                            </div>
                        ))}
                    </div>)}
            </section>
        </div>
    )


    const renderWebsites = (website, index) => {
        const { id, name, description, open, url} = website;
        if(open){
            return (
            <div className="expandWebsite" >
                    {index+1}. <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
                    <button onClick={() => expandWebsite(id)}>Minimize</button>
                    <button style={{color: 'tomato'}} onClick={() => deleteWebsite(id)}>Delete</button>
                    <Link to={`/${workspace.id}/website/${id}`}><button>open</button></Link>
                    <button onClick={() => setMoveToPopup({show: true, clickedWebsite: website})}>Move To</button>
                    <textarea className="description" onChange={(event) => saveDescription(event, id)} value={description}/>
            </div>
            )
        } else return (
            <div className="website" >
                    {index+1}. <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
                    <button onClick={() => expandWebsite(id)}>Expand</button>
                    <Link to={`/${workspace.id}/website/${id}`}><button>open</button></Link>
                    <button onClick={() => setMoveToPopup({show: true, clickedWebsite: website})}>Move To</button>
                    <h6>{description}</h6>
            </div>
        )
    }

    // Converts websites object to an array that it can map
    const websites = Object.values(workspace.websites);

    return (
        <div className="workspace">
            {popup ? Popup : null}
            {moveToPopup.show ? MoveToPopup : null}
            <div className="controller">
                <h1 className="name">{workspace.name}</h1>
                <button onClick={deleteWorkspace}>Delete</button>
                <button onClick={() => setPopup(true)}>Add</button>
            </div>
            <div className="websiteList">
                {websites.map( (website, index) => (
                    <div key={website.id}>{renderWebsites(website, index)}</div>
                ))}
            </div>
        </div>
    )
}

export default Workspace;