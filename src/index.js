import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter as Router, Route} from 'react-router-dom';

// Pages
import App from './App';
import OpenWebsite from './openWebsite';
import TodoList from './Containers/TodoList';

const routing = (
    <Router>
        <Route exact path="/" component={App}/>
        <Route exact path="/:workspaceID/website/:websiteID" component={OpenWebsite}/>
        <Route exact path="/testing" component={TodoList}/>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
