import React from "react";
import { Link } from "react-router-dom";

// Ticket row component, one is loaded per object in the ticket array. 

const TicketRow = (props) => (
    <Link className="ticket-link" to={`/ticket/${props.ticket.id}`}>
        <div className="ticket-row">
            <div className="id-column">{props.ticket.id}</div>
            <div className="customer-column"><img alt="avataer" src={props.ticket.avatar} className="ticket-row-avatar" /><p className="customer-name">{props.ticket.customerName}</p></div>
            <div className="date-column">{props.ticket.createdAt}</div>
            <div className="assigned-column">{props.ticket.assignedTo}</div>
            <div className="subject-column">{props.ticket.subject}</div>
            <div className="status-column">{props.ticket.status}</div>
        </div>
    </Link>
);

export default TicketRow;