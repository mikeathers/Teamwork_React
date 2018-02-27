import axios from "axios";

// Tickets actions. Used to populate the redux store. 
// Functions can be mapped as props and then called from components to populate state and props.
// Dispatch gets mapped from the redux store, allows you to dispatch actions. 

// axios is an AJAX fetch engine which implements ES6 promises. Once the request has been completed the 'then' method will be called.  

export const startSetTickets = (id = 0, status = "") => {
    return (dispatch, getState) => {
        var url = `http://localhost:51424/api/tickets/`;
        return axios({
            method: "GET",
            url: url,
            params: {
                id: id,
                status: status
            }
        }).then((res) => {
            const tickets = [];
            if (getState().user.Authenticated) {
                res.data.Tickets.forEach((ticket) => {
                    tickets.push(ticket)
                });
            } else {
                const filteredTickets = res.data.Tickets.filter((ticket) => ticket.Customer.Email === getState().user.EmailAddress)
                filteredTickets.forEach((ticket) => tickets.push(ticket));
            }
            // Passes the array of tickets to the setTickets action. 
            dispatch(setTickets(tickets));
        }).catch((e) => (console.log(e)));
    }
}

// This type of action will be called from the Tickets reducer, the tickets will be passed to the reducer 
// and then saved in the redux store as state, ready to be passed into components. 

export const setTickets = (tickets) => ({
    type: "SET_TICKETS",
    tickets
});







