import React from "react";
import moment from "moment";
import axios from "axios";

import "./Ticket.css";

import Thread from "./Thread/Thread";

// Ticket component, loads the individual ticket from the API as the returned result for a ticket is different from the list of tickets. 
// Renders the Thread component for each thread in the ticket.

// If the API request results in a 500 or 404 error, the user will get sent back to the list of tickets.

export default class Ticket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ticket: {},
            threads: []
        };
    }

    componentDidMount() {
        this.loadTicket().then((res) => {
            this.setState({
                ticket: res.data.Ticket,
                threads: res.data.Ticket.Threads
            });
        }).catch(() => this.props.history.push("/"));;
    }

    loadTicket = (history) => {
        const id = parseFloat(this.props.match.params.id);
        var url = `http://localhost:51424/api/ticket/${id}`;
        return axios.get(url)
            .then((res) => {
                return res;
            }).catch((e) => {this.props.history.push("/"); console.log(e.message)});
    }
    

    render() {
        const ticket = this.state.ticket;

        // Conditional rendering for CSS.         
        let status = "";
        switch (ticket.Status) {
            case "active":
                status = "active";
                break;
            case "waiting":
                status = "waiting"
                break;
            case "on-hold":
                status = "on-hold";
                break;
            case "solved":
                status = "solved";
                break;
            case "closed":
                status = "closed";
                break;
            default:
                break;
        }

        return (
            <div className="body-content container">
                {
                    this.state.ticket !== null ? (

                        <div>
                            <h3 className="ticket-id">Ticket ID: <strong>{ticket.Id}</strong></h3>
                            <div className="subject-div"> <span className="glyphicon glyphicon-envelope envelope"></span><p className="subject">{ticket.Subject}</p></div>
                            
                            <table className="ticket-header-table">
                                <tbody>
                                    <tr>
                                        <td>Customer Name: <strong>{ticket.CustomerName}</strong></td>
                                        <td>Assigned: <strong>{ticket.AssignedToFullName}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Date Created: <strong>{moment(ticket.CreatedAt).format("DD/MM/YYYY")}</strong></td>
                                        <td>Source: <strong>{ticket.Source}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Status: <strong className={status}>{ticket.ParsedStatus}</strong></td>
                                        <td>Priority: <strong className="priority">{ticket.ParsedPriority}</strong></td>
                                    </tr>                                    
                                </tbody>
                            </table>
                            {
                                this.state.threads.length !== 0 && this.state.threads.map((thread) => <Thread subject={this.state.ticket.Subject} key={thread.Id} thread={thread} />)
                            }
                        </div>
                    ) : (<h3>Loading...</h3>)
                }
            </div>
        );
    }
}