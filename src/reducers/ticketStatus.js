const statusReducerDefaultState = "open";

export default (state = statusReducerDefaultState, action) => {
    switch (action.type) {
        case "SET_TICKET_STATUS": 
            return action.status;            
        default:
            return state;
    }
};