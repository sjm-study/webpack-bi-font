import React from 'react';
import ReactDOM from 'react-dom';
import Login from './views/login'
import { HashRouter, Route, Switch } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import store from './store/store'
import { Provider } from 'react-redux'
// import 'antd/dist/antd.css'
import './global.css'

ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/' component={Login} />
            </Switch>
        </HashRouter>
    </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

