import React from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import configureStore from "../src/store/configureStore";
import { startSetUserAuth } from "../src/actions/user";

import AppRouter from "../src/router/AppRouter";

import './index.css';

// Passes the Redux store into our higher order component, this lets any child component use dispatch, mapStateToDispatch, mapDispatchToProps functions.

const store = configureStore();
store.dispatch(startSetUserAuth());

// App is the parent component, AppRouter is the child component, TicketTable etc is the child of AppRouter. 

const App = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
);



// Renders the App (parent) component to the HTML element on our page with the id of root. 
ReactDOM.render(App, document.getElementById('root'));




