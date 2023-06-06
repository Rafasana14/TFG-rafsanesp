import React, { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavLink, NavItem, Nav, NavbarToggler, Collapse, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import tokenService from './services/token.service';
import jwt_decode from "jwt-decode";

function AppNavbar() {
    const jwt = tokenService.getLocalAccessToken();
    const [roles, setRoles] = useState([]);
    const [username, setUsername] = useState("");
    const [collapsed, setCollapsed] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleNavbar = () => setCollapsed(!collapsed);

    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            setUsername(tokenService.getUser().username);
        }
    }, [jwt])

    let adminLinks = <></>;
    let ownerLinks = <></>;
    let vetLinks = <></>;
    let userLinks = <></>;
    let userLogout = <></>;
    let publicLinks = <></>;

    roles.forEach((role) => {
        if (role === "ADMIN") {
            adminLinks = (
                <>
                    <NavItem>
                        <NavLink tag={Link} to="/owners">Owners</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/pets">Pets</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/vets">Vets</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/consultations">Consultations</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/users">Users</NavLink>
                    </NavItem>
                </>
            )
        }
        if (role === "OWNER") {
            ownerLinks = (
                <>
                    <NavItem>
                        <NavLink tag={Link} to="/pets">My Pets</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/consultations">Consultations</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/plan">Plan</NavLink>
                    </NavItem>
                </>
            )
        }
        if (role === "VET") {
            vetLinks = (
                <>
                    <NavItem>
                        <NavLink tag={Link} to="/owners">Owners</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/pets">Pets</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/visits">My Visits</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/vets">Vets</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/consultations">Consultations</NavLink>
                    </NavItem>
                </>
            )
        }
    })

    if (!jwt) {
        publicLinks = (
            <>
                <NavItem>
                    <NavLink id="docs" tag={Link} to="/docs">Docs</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink id="plans" tag={Link} to="/plans">Pricing Plans</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink id="register" tag={Link} to="/register">Register</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink id="login" tag={Link} to="/login">Login</NavLink>
                </NavItem>
            </>
        )
    } else {
        userLinks = (
            <>
                <NavItem>
                    <NavLink tag={Link} to="/dashboard">Dashboard</NavLink>
                </NavItem>
            </>
        )
        userLogout = (
            <>
                <NavItem>
                    <NavLink id="docs" tag={Link} to="/docs">Docs</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink id="plans" tag={Link} to="/plans">Pricing Plans</NavLink>
                </NavItem>
                <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle nav caret>
                        {username}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem id="profile" tag={Link} to="/profile">Profile</DropdownItem>
                        {roles.includes("VET") ? <DropdownItem id="specialties" tag={Link} to="/specialties">My Specialties</DropdownItem> : <></>}
                        <DropdownItem divider />
                        <DropdownItem id="logout" tag={Link} to="/logout">Logout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </>
        )

    }

    return (
        <div>
            <Navbar style={{ zIndex: 2000 }} color='success' expand="lg" dark >
                <NavbarBrand href="/">
                    <img alt="logo" src="/logo1-recortado.png" style={{ height: 40, width: 40 }} />
                    PetClinic
                </NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="ms-2" />
                <Collapse isOpen={!collapsed} navbar>
                    <Nav className="me-auto mb-2 mb-lg-0" navbar>
                        {userLinks}
                        {adminLinks}
                        {ownerLinks}
                        {vetLinks}
                    </Nav>
                    <Nav className="ms-auto mb-2 mb-lg-0" navbar>
                        {publicLinks}
                        {userLogout}
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default AppNavbar;