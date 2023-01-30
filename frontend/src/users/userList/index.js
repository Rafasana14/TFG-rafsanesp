import React, { Component } from "react";
import { Button, ButtonGroup, Container, Table } from "reactstrap";
// import AppNavbar from "../AppNavbar";
import { Link } from "react-router-dom";

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [] };
        this.remove = this.remove.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
    }

    componentDidMount() {
        fetch("/api/v1/users", {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                "Content-Type": "application/json",
            },
        }).then((response) => response.json())
            .then((data) => this.setState({ users: data }));
    }

    async remove(username) {
        await fetch(`/api/v1/users/${username}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then(() => {
            let updatedUsers = [...this.state.users].filter((i) => i.username !== username);
            this.setState({ users: updatedUsers });
        });
    }

    render() {
        const { users, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const userList = users.map((user) => {
            return (
                <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>
                        <ButtonGroup>
                            <Button
                                size="sm"
                                color="primary"
                                tag={Link}
                                to={"/api/v1/users/" + user.username}
                            >
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                color="danger"
                                onClick={() => this.remove(user.username)}
                            >
                                Delete
                            </Button>
                        </ButtonGroup>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                {/* <AppNavbar /> */}
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/api/v1/users/new">
                            Add User
                        </Button>
                    </div>
                    <h3>Users</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>{userList}</tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default UserList;
