const inboxReducerDefaultState = 880

export default (state = inboxReducerDefaultState, action) => {
    switch (action.type) {
        case "SET_TICKET_INBOX": 
            return action.inbox;            
        default:
            return state;
    }
};