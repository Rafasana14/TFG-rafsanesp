import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class UserEdit extends Component {

    emptyItem = {
        id: null,
        username: '',
        password: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
        this.id = window.location.href.split("/api/v1/users/")[1];
    }

    async componentDidMount() {
        console.log(this.id)
        if (this.id !== "new") {
            const user = await (await fetch(`/api/v1/users/${this.id}`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                },
            })).json();
            this.setState({ item: user });
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = { ...this.state.item };
        item[name] = value;
        this.setState({ item });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { item } = this.state;

        await fetch('/api/v1/users' + (item.id ? '/' + this.id : ''), {
            method: item.id ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        window.location.href = '/api/v1/users';
    }

    render() {
        const { item } = this.state;
        const title = <h2>{item.id ? 'Edit User' : 'Add User'}</h2>;

        return <div>
            {/* <AppNavbar /> */}
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="text" name="username" id="username" value={item.username || ''}
                            onChange={this.handleChange} autoComplete="username" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Password</Label>
                        <Input type="password" name="password" id="password" value={item.password || ''}
                            onChange={this.handleChange} autoComplete="password" />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/api/v1/users">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}
export default UserEdit;