import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { loadingBarReducer } from 'react-redux-loading-bar'

import ticketsReducer from "../reducers/tickets";
import filteredTicketsReducer from "../reducers/filteredTickets";
import ticketInboxReducer from "../reducers/ticketInbox";
import ticketStatusReducer from "../reducers/ticketStatus";
import pageNumberReducer from "../reducers/pageNumber";
import userReducer from "../reducers/user";

// Needed so the redux web tools works. 

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


// Configures the store. Reducers are imported at the top of the file and combined into 
// one single store. 

export default () => {
    
    const store = createStore(
        combineReducers({
            tickets: ticketsReducer,
            filteredTickets: filteredTicketsReducer,
            ticketInbox: ticketInboxReducer,
            ticketStatus: ticketStatusReducer,
            pageNumber: pageNumberReducer,
            loadingBar: loadingBarReducer,
            user: userReducer 
        }),

        // Redux thunk middleware, used so we can create actions that return a function instead of just an action. 
        // In this case we make an API call to our backend (startSetTickets), then once thats completed we pass the result to the action (setTickets).
        // The action is then passed into the Redux store and can then be used as state from anywhere in our application.

        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
}