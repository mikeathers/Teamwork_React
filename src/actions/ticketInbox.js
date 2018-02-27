
// Action for storing the currently selected ticket inbox in the Redux store so when we click into a ticket 
// and then press the back button we can stay in the correct ticket inbox list within the table.

// Using an ES6 promise so when we call the action we can add a '.then(() => ) function to do something once the ticket inbox has been stored in the Redux store. 

export const setTicketInbox = (inbox) => (dispatch) => 
        new Promise((resolve, reject) => {
            resolve(dispatch({
                type: "SET_TICKET_INBOX",
                inbox
            }))
        });