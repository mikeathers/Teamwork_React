
// Filtered Tickets reducer. Each case is an action, when that action gets called from within a component, 
// the returned result from the action e.g. filteredTickets gets returned as state to the redux store. 

const ticketsReducerDefaultState = [];

export default (state = ticketsReducerDefaultState, action) => {
    switch (action.type) {
        case "SET_FILTERED_TICKETS":
            return action.tickets;
        default:
            return state;
    }
};