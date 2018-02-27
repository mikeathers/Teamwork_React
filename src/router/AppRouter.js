import React from "react";
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import NavBar from "../components/NavBar/NavBar";
import TicketTable from "../components/TicketTable/TicketTable";
import Ticket from "../components/Ticket/Ticket";
import Footer from "../components/Footer/Footer";

// Import used with react-router so we can use the back and forward buttons in ou browser. 

export const history = createHistory();

// Router used to load components based on certain URLs. 
// The URL never actually posts back to the server, only 1 page is ever rendered, different components are rendered on the page based on the Route. 
// NavBar and Footer compoents are loaded here. 

const AppRouter = () => (
    <Router history={history}>
        <div>
            <NavBar />
            <div className="content">
                <Switch>
                    <Route path="/" component={TicketTable} exact={true} />
                    <Route path="/tickets" component={TicketTable} />
                    <Route path="/ticket/:id" component={Ticket} />
                </Switch>
            </div>
            <Footer />
        </div>
    </Router>
);

export default AppRouter;