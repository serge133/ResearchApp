import React from 'react';
import WorkspaceComponent from '../Components/Workspace/Workspace';

import nanoid from 'nanoid';
import axios from 'axios';

const Workspace = props => {
    const {
    workspace,
    workspaces,
    setWorkspaces
    } = props;

    const workspaceIndex = workspaces.findIndex( w => w.id === workspace.id);


    const addWebsite = () => {
        const copyWorkspaces = [...workspaces];
        if(workspaceIndex >= 0){
            const thisWorkspace = copyWorkspaces[workspaceIndex];
            // The inputs in the form
            const websiteName = document.getElementById('addWebsiteName').value;
            const websiteURL = document.getElementById('addWebsiteURL').value;
            const website = {
                id: nanoid(),
                name: websiteName,
                description: '',
                open: false,
                url: websiteURL,
                notes: '',
                todos: [],
            }
            thisWorkspace.websites[website.id] = website;
            setWorkspaces(copyWorkspaces);
            axios.patch(`https://central-rush-249500.firebaseio.com/workspaces/${thisWorkspace.id}/websites/${website.id}.json`, website);
        }
    }

    const expandWebsite = id => {
        const copyWorkspaces = [...workspaces];
        const websites = Object.values(copyWorkspaces[workspaceIndex].websites);
        const websiteIndex = websites.findIndex( website => website.id === id);
        const toggle = !websites[websiteIndex].open;
        websites[websiteIndex].open = toggle;

        // Save to database
        const workspaceID = copyWorkspaces[workspaceIndex].id;
        axios.patch(`https://central-rush-249500.firebaseio.com/workspaces/${workspaceID}/websites/${id}.json`, {open: toggle});
        setWorkspaces(copyWorkspaces);
    }

    const moveTo = (website, moveTo) => {
        // Website is an object 
        // Move to is the workspace Id that you need to move to
        const copyWorkspaces = [...workspaces];
        // First delete the website in the previous workspace
        const workspacesMoveToIndex = copyWorkspaces.findIndex( w => w.id === moveTo);
        if(workspacesMoveToIndex >= 0){
            // Delete all instances of the previous website from the workspace
            for(let i in workspaces){
                const deleteWebsite = copyWorkspaces[i].websites[website.id];
                if(deleteWebsite){
                    const workspaceID = copyWorkspaces[i].id;
                    delete copyWorkspaces[i].websites[website.id];
                    axios.delete(`https://central-rush-249500.firebaseio.com/workspaces/${workspaceID}/websites/${website.id}.json`);
                }
            }
            
            copyWorkspaces[workspacesMoveToIndex].websites[website.id] = website;
            // Save this to database
            axios.put(`https://central-rush-249500.firebaseio.com/workspaces/${moveTo}/websites/${website.id}.json`, website)
            setWorkspaces(copyWorkspaces);
        }
    }

    const deleteWebsite = websiteID => {
            const copyWorkspaces = [...workspaces];
            const thisWorkspace = copyWorkspaces[workspaceIndex];
            delete thisWorkspace.websites[websiteID]
            setWorkspaces(copyWorkspaces);
            // Database delete
            axios.delete(`https://central-rush-249500.firebaseio.com/workspaces/${workspace.id}/websites/${websiteID}.json`)
    
    }

    const saveDescription = (event, websiteID) => {
        const copyWorkspaces = [...workspaces];
        const thisWorkspace = copyWorkspaces[workspaceIndex];
        const val = event.target.value;
        thisWorkspace.websites[websiteID].description = val;
        setWorkspaces(copyWorkspaces);
        // Database
        axios.patch(`https://central-rush-249500.firebaseio.com/workspaces/${workspace.id}/websites/${websiteID}.json`, {description: val})
    }

    const deleteWorkspace = () => {
        const copyWorkspaces = [...workspaces];
        copyWorkspaces.splice(workspaceIndex, 1);
        setWorkspaces(copyWorkspaces);

        // Database
        axios.delete(`https://central-rush-249500.firebaseio.com/workspaces/${workspace.id}.json`);
    }

    const WorkspaceComponent_props = {
        workspaces: workspaces,
        addWebsite: addWebsite,
        workspace: workspace,
        expandWebsite: expandWebsite,
        moveTo: moveTo,
        deleteWebsite: deleteWebsite,
        saveDescription: saveDescription,
        deleteWorkspace: deleteWorkspace
    }

    return <WorkspaceComponent {...WorkspaceComponent_props}/>
}

export default Workspace;