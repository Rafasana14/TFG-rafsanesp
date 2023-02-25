import React, { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavLink, NavItem, Nav, NavbarText } from 'reactstrap';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { useLocalState } from './util/useLocalStorage';

export default function AppNavbar() {
    const [jwt,] = useLocalState("jwt", "");
    const [roles, setRoles] = useState([]);
    const [username, setUsername] = useState("");

    function getRolesFromJWT(jwt) {
        return jwt_decode(jwt).authorities;
    }
    function getUsernameFromJWT(jwt) {
        return jwt_decode(jwt).sub;
    }

    useEffect(() => {
        if (jwt) {
            setRoles(getRolesFromJWT(jwt));
            setUsername(getUsernameFromJWT(jwt));
        }
    }, [jwt])

    let adminLinks = <></>;
    let ownerLinks = <></>;
    let userLinks = <></>;
    let userLogout = <></>;
    let publicLinks = <></>;

    roles.forEach((role) => {
        if (role === "ADMIN") {
            adminLinks = (
                <>
                    <NavItem>
                        <NavLink tag={Link} to="/api/v1/owners">Owners</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/api/v1/pets">Pets</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/api/v1/vets">Vets</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/api/v1/users">Users</NavLink>
                    </NavItem>
                </>
            )
        }
        if (role === "OWNER") {
            ownerLinks = (
                <>
                    <NavItem>
                        <NavLink tag={Link} to="/myPets">My Pets</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={Link} to="/plan">Plan</NavLink>
                    </NavItem>
                </>
            )
        }
    })

    if (jwt === "") {
        publicLinks = (
            <>
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
                    <NavLink id="plans" tag={Link} to="/plans">Pricing Plans</NavLink>
                </NavItem>
                <NavbarText>{username}</NavbarText>
                <NavItem>
                    <NavLink className="ml-auto" id="logout" tag={Link} to="/logout">Logout</NavLink>
                </NavItem>
            </>
        )

    }

    return (
        <Navbar color="dark" dark expand="md">
            <NavbarBrand className="NavbarBrand" tag={Link} to="/">Home</NavbarBrand>
            <Nav navbar>
                {userLinks}
                {adminLinks}
                {ownerLinks}
                {publicLinks}
                {userLogout}
            </Nav>
        </Navbar>
    );
}


// export default class AppNavbar extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             isOpen: false,
//             jwt: JSON.parse(window.localStorage.getItem("jwt")),
//             roles: [],
//         }
//         this.toggle = this.toggle.bind(this);

//     }

//     toggle() {
//         this.setState({
//             isOpen: !this.state.isOpen
//         });
//     }


//     render() {
//         const { state } = this.state;
//         function getRolesFromJWT(jwt) {
//             return jwt_decode(jwt).authorities;
//         }

//         if (state.jwt) this.setState({
//             roles: getRolesFromJWT(state.jwt)
//         });

//         let adminLinks = <></>;
//         let ownerLinks = <></>;
//         this.state.roles.forEach((role) => {
//             if (role === "ADMIN") {
//                 adminLinks = (
//                     <NavItem>
//                         <NavLink tag={Link} to="/api/v1/users">Users</NavLink>
//                     </NavItem>
//                 )
//             }
//             if (role === "OWNER") {
//                 ownerLinks = (
//                     <NavItem>
//                         <NavLink tag={Link} to="/plan">Plan</NavLink>
//                     </NavItem>
//                 )
//             }
//         })
//         return (
//             <Navbar color="dark" dark expand="md">
//                 <NavbarBrand className="NavbarBrand" tag={Link} to="/">Home</NavbarBrand>
//                 <Nav className="container-fluid" navbar>
//                     <NavItem>
//                         <NavLink tag={Link} to="/dashboard">Dashboard</NavLink>
//                     </NavItem>
//                     {adminLinks}
//                     {ownerLinks}
//                     <NavItem>
//                         <NavLink className="ml-auto" id="register" tag={Link} to="/register">Register</NavLink>
//                     </NavItem>
//                     <NavItem>
//                         <NavLink className="ml-auto" id="login" tag={Link} to="/login">Login</NavLink>
//                     </NavItem>
//                     <NavItem>
//                         <NavLink className="ml-auto" id="logout" tag={Link} to="/logout">Logout</NavLink>
//                     </NavItem>
//                 </Nav>
//             </Navbar>
//         );
//     }
// }