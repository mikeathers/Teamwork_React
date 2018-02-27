
// Tickets reducer. When the action gets called from within a component, 
// the returned result from the action e.g. tickets gets returned as state to the redux store.

const ticketsReducerDefaultState = [];

export default (state = ticketsReducerDefaultState, action) => {
    switch (action.type) {
        case "SET_TICKETS":
            return action.tickets; 
        case "SET_AUTH":
            return action.auth
        default:
            return state;
    }
};