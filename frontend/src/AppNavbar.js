import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavLink, NavItem, Nav } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <Navbar color="dark" dark expand="md">
                <NavbarBrand className="NavbarBrand" tag={Link} to="/">Home</NavbarBrand>
                <Nav className="container-fluid" navbar>
                    <NavItem>
                        <NavLink tag={Link} to="/dashboard">Dashboard</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/api/v1/users">Users</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="ml-auto" id="login" tag={Link} to="/login">Login</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }
}