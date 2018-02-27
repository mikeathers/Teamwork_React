import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import axios from "axios";

import { startSetTickets } from "../../actions/tickets";
import { startSetFilteredTickets, startSetSingleTicket } from "../../actions/filteredTickets";
import { setTicketInbox } from "../../actions/ticketInbox";
import { setTicketStatus } from "../../actions/ticketStatus";
import { setPageNumber } from './../../actions/pageNumber';

import { exportCSVFile } from './../../utility/exportToCSV';

import TicketRow from "./TicketRow/TicketRow";
import Pagination from "./Pagination/Pagination";
import ExportModal from "./../Modal/Modal";

import "./TicketTable.css";

export class TicketTable extends React.Component {
	constructor(props) {
    super(props);
    
		this.state = {
			inboxTickets: [],
			parsedTickets: [],
			paginatedTickets: [],
			filteredResults: [],
			currentPage: 0,
			itemsPerPage: 10,
			searchInProgress: false,
			totalCount: 0,
      resultsMessage: "Loading...",
      searchBox: "",
      allTicketSearch: false,
      ticketsToExport: [],
      modalIsOpen: false
    };
  }

  // Only attempts another API call if the list of tickets in the Redux store is empty. 
  
  componentDidMount() {
    if (this.props.allTickets.length === 0)
			this.props.startSetTickets().then(() => this.loadInbox(this.props.ticketInbox));
		else
			this.loadInbox(this.props.ticketInbox);
  }

  // Loads the inbox, if no inbox is passed in as an argument, 880 is used which is the first line inbox.

  loadInbox = (inboxId = 880) => {

    let inboxTicketsFiltered = [];  
    
		if (inboxId === 0) 
			inboxTicketsFiltered = this.props.allTickets;
		else 
      inboxTicketsFiltered = this.props.allTickets.filter(t => t.InboxId === inboxId);
      
    if (this.props.ticketStatus !== "open")
      this.props.startSetFilteredTickets(this.props.ticketInbox, this.props.ticketStatus).then(() => this.loadStatusResults());
    else 
		  this.setState({ inboxTickets: inboxTicketsFiltered }, () => this.parseTickets());
  };

  // Updates the state based on the list of filtered tickets, on-hold, closed etc.
  // Used when the Status drop down is changed. 

  loadStatusResults = () => {        
		const filteredTickets = this.props.filteredTickets;
    this.setState({ inboxTickets: filteredTickets }, () => this.parseTickets());
    this.loadingMessage(filteredTickets, 5000);
  };

  // Builds a new list of tickets used for the table. Sorts the tickets, then updates the state with the new ticket list. 
  // Ready to be used with pagination. 

  parseTickets = () => {
		let parsedTicketsNew = this.state.inboxTickets.map(ticket => {
			const parsedTicket = { 
				id: ticket.Id, 
				customerName: ticket.CustomerName,
				createdAt: moment(ticket.CreatedAt).format("DD/MM/YYYY"),
				assignedTo: ticket.AssignedToFullName ? ticket.AssignedToFullName : "Unassigned",
				subject: ticket.ParsedSubject,
				status: ticket.ParsedStatus,
				avatar: ticket.Customer.AvatarUrl
      };
      return parsedTicket;      
		});

		parsedTicketsNew = _.sortBy(parsedTicketsNew, t => moment(t.date)).reverse();    

		this.setState({ 
			parsedTickets: parsedTicketsNew,
			totalCount: parsedTicketsNew.length }, () =>  this.paginateTickets(this.props.pageNumber));

		this.loadingMessage(parsedTicketsNew, 5000)

  };
  
  // Inbox dropdown change event
  selectInboxChange = e => {   
    let status = parseFloat(e.target.value);	
    
    if (status === 1) {
      this.props.setTicketInbox(status)
      this.setState({ allTicketSearch: true, resultsMessage: "Loading..." });      
    }
    else {
      this.props.setTicketInbox(status).then(() => { 
      this.setState({ allTicketSearch: false, resultsMessage: "Loading..." });        
        this.props.setTicketStatus("open"); 
        this.props.setPageNumber(1);
      }).then(() => this.loadInbox(status));
    }
  };

  // Items per page change event
  selectItemPerPageChange = e => {
		this.setState({ itemsPerPage: parseFloat(e.target.value) }, () => this.paginateTickets(this.props.pageNumber));
  };

  // Status dropdown change event
  selectStatusChange = e => {
		const id = this.props.ticketInbox;
		const status = e.target.value;
    this.setState({ filteredResults: [], inboxTickets: [], resultsMessage: "Loading..." });
    this.props.startSetFilteredTickets(id, status).then(() => this.loadStatusResults());    
    this.props.setTicketStatus(status);
    this.props.setPageNumber(1);
    
  };

  // Search box event, returns a filtered array of objects where conditions need to be met. 
  inputSearchOnChange = e => {
      const search = e.target.value;
      this.setState({ searchInProgress: true, searchBox: e.target.value, resultsMessage: "Loading..." });


      if (this.state.allTicketSearch === true) {
        this.props.startSetSingleTicket(parseFloat(search));        
      }     

      const filteredResults = this.state.parsedTickets.filter(({ id, customerName, createdAt, assignedTo, subject }) => {
          const idMatch = id.toString().toLowerCase().includes(search.toLowerCase());
          const customerMatch = customerName.toLowerCase().includes(search.toLowerCase());
          const createdAtMatch = createdAt.toString().toLowerCase().includes(search.toLowerCase());
          const assignedToMatch = assignedTo.toLowerCase().includes(search.toLowerCase());
          const subjectMatch = subject.toLowerCase().includes(search.toLowerCase());
          return (idMatch || customerMatch || createdAtMatch || assignedToMatch || subjectMatch );
        }
      );

      this.setState({ 
        filteredResults: filteredResults,
        totalCount: filteredResults.length
      }, () => this.paginateTickets(1, filteredResults));

      if (search === "") {
        this.setState({ searchInProgress: false });
        this.paginateTickets(1);
      }

      this.loadingMessage(filteredResults, 1000);
  };
  

  // Date column sort event
  onDateSort = () => {
    let parsedTicketsNew;
      if (this.state.searchInProgress) {
        parsedTicketsNew = _.sortBy(this.state.filteredResults, t => moment(t.date)).reverse();
        this.setState({ filteredResults: parsedTicketsNew }, () => this.paginateTickets(1) );
      } else {
        parsedTicketsNew = _.sortBy(this.state.parsedTickets, t => moment(t.date)).reverse();
        this.setState({ parsedTickets: parsedTicketsNew }, () => this.paginateTickets(1) );
      }
  };


  buildExportList = () => {
    this.setState({ modalIsOpen: true})
    this.setState({ ticketsToExport: [] });

    // var url = `http://localhost:51424/api/exporttickets/`;
    // return axios({
    //   method: "GET",
    //   url: url,
    //   params: {
    //     tickets: JSON.stringify(this.props.inboxTickets)
    //     }
    // }).then((res) => {
    //         console.log(res);
    //     }).catch((e) => console.log(e));

    
    this.state.inboxTickets.forEach((ticket) => {
      this.loadTicket(ticket.Id).then((res) => {
      this.setState({
          ticketsToExport: [...this.state.ticketsToExport, res]
      });
        }, () => {

          if (this.state.ticketsToExport.length === this.state.inboxTickets.length) {
            let firstThread = {};
            const parsedTickets = this.state.ticketsToExport.map((ticket) => {
              let first = false;
              if (!first) {                
                for (let i = ticket.Threads.length - 1; i > 0; i--) {
                    if (ticket.Threads[i].Type === "message") {
                      firstThread = ticket.Threads[i].BodyNoHtml;
                      first = true;
                      break;
                    }
                    else {
                      first = false;
                    }
                }
              }
            return {
              Id: ticket.Id !== null ? ticket.Id : 0 ,
              CustomerName: ticket.CustomerName ? ticket.CustomerName : "",
              CreatedAt: ticket.CreatedAt ? moment(ticket.CreatedAt).format("DD/MM/YYYY") : 0,
              AssignedTo: ticket.AssignedToFullName ? ticket.AssignedToFullName : "Unassigned",                
              Status: ticket.ParsedStatus ? ticket.ParsedStatus : "",
              InboxName: ticket.InboxName ? ticket.InboxName : "",
              Ticket: firstThread !== null ? firstThread.replace(/(,|\n)/g, '') : ""
            };
        });

          var fileTitle = `${ticket.InboxName}__${this.props.ticketStatus}`;
          exportCSVFile(parsedTickets, fileTitle);
          this.setState({ modalIsOpen: false });

          }                   
        });
      });
    }


  loadTicket = (id) => {
    var url = `http://localhost:51424/api/ticket/${id}`;
    return axios.get(url)
        .then((res) => {
            return res.data.Ticket;
        }).catch((e) => console.log(e));
  }

  loadingMessage = (tickets, timeout) => {
    if (tickets.length !== 0)
      this.setState({ resultsMessage: "" })
    else {
      setTimeout(() => {
          this.setState({ resultsMessage: "No results found."})
      }, timeout);
    }
  }

  paginateTickets = (page_number, array = this.state.parsedTickets) => {

    let pageNumber = page_number;
    let itemsPerPage = this.state.itemsPerPage;
    this.props.setPageNumber(pageNumber);

    if (this.state.searchInProgress) 
      array = this.state.filteredResults;

    let paginateTickets = this.paginate(array, itemsPerPage, pageNumber);

    if (paginateTickets.length < 1) {
			paginateTickets = this.paginate(array, itemsPerPage, 1);
    }

    this.setState({
			paginatedTickets: paginateTickets,
			currentPage: pageNumber
    });
  };

  paginate = (array, page_size, page_number) => {
		--page_number;
		return array.slice(page_number * page_size, (page_number + 1) * page_size);
  };

  
  render() {

    let results = !this.state.searchInProgress ? this.state.inboxTickets.length : this.state.filteredResults.length;    
    return (
      <div className="body-content container">
        <h3 className="ticket-table-header">Tickets</h3>

        <div className="form-group">
          <p>
            <strong>Inbox:</strong>
          </p>
          <select onChange={this.selectInboxChange} value={this.props.ticketInbox} id="ticket-inbox-select" className="form-control ticket-inbox-select">
            <option value="880">First Line</option>
            <option value="918">Application Development</option>
            <option value="882">Triage</option>
            { this.props.user.Authenticated ? <option value="881">Alerts</option> : null}
            <option value="0">All Active Tickets</option>
            {/* { this.props.user.Authenticated ? <option value="1">All Tickets</option> : null} */}
          </select>
        </div>
        <div className="form-group status-select">
          <p><strong>Status:</strong></p>
          <select onChange={this.selectStatusChange} value={this.props.ticketStatus} id="ticket-inbox-select" className="form-control ticket-inbox-select">
            <option value="">Open</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="waiting">Waiting on customer</option>
            <option value="on-hold">On-hold</option>
            <option value="solved">Solved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="form-group per-page-div">
          <p><strong>Items per page:</strong></p>
          <select onChange={this.selectItemPerPageChange} className="form-control per-page-select">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>      

        {/* { 
          this.props.user.Authenticated ? (
            <div className="form-group">
              <button onClick={this.buildExportList} className="btn btn-primary export-btn">Export</button>
            </div>
          ) : null          
        }  */}

        <div className="form-group search-input-group">
          <p><strong>Search:</strong></p>
          <input id="input-search"
            type="text"
            onBlur={this.inputSearchExit}
            onChange={this.inputSearchOnChange}
            value={this.state.searchBox}
            placeholder="Enter a term"
            className="form-control search-input"
          />
        </div>

        {
          results !== 0 ? (
          <div className="ticket-table-div">
            <div className="ticket-row ticket-row-header">
              <div className="id-column">Ticket Id</div>
              <div className="customer-column customer-column-header">Customer Name</div>
              <div className="date-column" onClick={this.onDateSort}>Date Created<span className="glyphicon glyphicon-sort sort-icon" /></div>
              <div className="assigned-column">Assigned</div>
              <div className="subject-column">Subject</div>
              <div className="status-column">Status</div>
            </div>
            <div className="ticket-table-body">
              {this.state.paginatedTickets !== 0 && this.state.paginatedTickets.map(t => (<TicketRow key={t.id} ticket={t} />))}
            </div>
          </div>
        ) : (
          //this.state.resultsMessage !== "No results found." ? <img className="loader" src={Loader} alt="Loader" /> : <h3>{this.state.resultsMessage}</h3>
          <h3>{this.state.resultsMessage}</h3>
        )}
        {this.state.parsedTickets !== 0 && (
          <div>
          <Pagination
            currentPage={this.state.currentPage}
            paginateTickets={this.paginateTickets}
            items={ this.state.searchInProgress ? this.state.filteredResults.length : this.state.parsedTickets.length }
            itemsPerPage={this.state.itemsPerPage}
          />
          <p className="total-count">Total: {this.state.totalCount}</p>
          </div>
        )}
       
        <ExportModal
          modalIsOpen={this.state.modalIsOpen}
          ticketCount={this.state.ticketCount}
          inboxName={this.props.ticketInbox}
          status={this.props.ticketStatus}
        >
          
          </ExportModal>
       
      </div>
      
    );
  }
}

const mapStateToProps = (state, props) => ({
  allTickets: state.tickets,
	filteredTickets: state.filteredTickets,
  ticketInbox: state.ticketInbox,
  ticketStatus: state.ticketStatus,
  pageNumber: state.pageNumber,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  startSetTickets: (id, status = "") => dispatch(startSetTickets(id, status)),
  startSetFilteredTickets: (id, status) => dispatch(startSetFilteredTickets(id, status)),
  startSetSingleTicket: (id) => dispatch(startSetSingleTicket(id)), 
  setTicketInbox: (inbox) => dispatch(setTicketInbox(inbox)),
  setTicketStatus: (status) => dispatch(setTicketStatus(status)),
  setPageNumber: (pageNumber) => dispatch(setPageNumber(pageNumber))  
});

export default connect(mapStateToProps, mapDispatchToProps)(TicketTable);
