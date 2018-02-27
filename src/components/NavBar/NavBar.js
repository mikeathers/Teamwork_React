import React from 'react';
import { connect } from "react-redux";
import {
    Navbar,
    //NavDropdown,
    NavItem,
    //MenuItem,
    Nav
} from 'react-bootstrap';



import "./NavBar.css";
import Logo from "./Logo";

export class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        return (
            <div>
                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/" className="navbar-brand">
                                <img alt="Logo" className="navbar-title pull-left" src={Logo} />
                                <p className="pull-right">Teamwork Desk</p>
                            </a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem eventKey={1} href="#">
                                
                    </NavItem>
                            <NavItem eventKey={2} href="#">
                            </NavItem>
                            {/* <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                                <MenuItem eventKey={3.1}>Action</MenuItem>
                                <MenuItem eventKey={3.2}>Another action</MenuItem>
                                <MenuItem eventKey={3.3}>Something else here</MenuItem>
                                <MenuItem divider />
                                <MenuItem eventKey={3.3}>Separated link</MenuItem>
                            </NavDropdown> */}
                        </Nav>
                        <Navbar.Text pullRight>Hello, {this.props.user.Name}</Navbar.Text>
                        <Nav pullRight>                        
                            <NavItem eventKey={2} href="#">
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(NavBar);