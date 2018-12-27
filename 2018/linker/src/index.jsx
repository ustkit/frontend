import './css/main.scss';

import React, {Component} from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import routes from './routes';

class App extends Component {
    render() {
        return (
            <div className="container">
                <Switch>
                    {routes.map((route, idx) => <Route key={idx} {...route} />)}
                </Switch>
            </div>
        );
    }
}

ReactDom.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById('root')
);
