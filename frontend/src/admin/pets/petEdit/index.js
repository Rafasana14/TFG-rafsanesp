import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class PetEdit extends Component {

    emptyItem = {
        id: null,
        name: '',
        birthDate: '',
        type: [],
        owner: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            pet: this.emptyItem,
            types: [],
            owners: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
        this.id = window.location.href.split("/api/v1/pets/")[1];
    }

    async componentDidMount() {
        if (this.id !== "new") {
            const pet = await (await fetch(`/api/v1/pets/${this.id}`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                },
            })).json();
            this.setState({ pet: pet });
        }
        const types = await (await fetch(`/api/v1/pets/types`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
            },
        })).json();
        this.setState({ types: types });

        const owners = await (await fetch(`/api/v1/owners`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
            },
        })).json();
        this.setState({ owners: owners });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let pet = { ...this.state.pet };
        pet[name] = value;
        this.setState({ pet });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { pet, } = this.state;

        await fetch('/api/v1/pets' + (pet.id ? '/' + this.id : ''), {
            method: pet.id ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pet),
        });
        window.location.href = '/api/v1/pets';
    }

    render() {
        const { pet, types, owners } = this.state;
        const title = <h2>{pet.id ? 'Edit Pet' : 'Add Pet'}</h2>;

        const typeOptions = types.map(type => <option key={type.id} value={type.name}>{type.name}</option>);
        const ownerOptions = owners.map(owner => <option key={owner.id} value={owner.id}>{owner.user.username}</option>)

        return <div>
            {/* <AppNavbar /> */}
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" value={pet.name || ''}
                            onChange={this.handleChange} autoComplete="name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="birthDate">Birth Date</Label>
                        <Input type="date" name="birthDate" id="birthDate" value={pet.birthDate || ''}
                            onChange={this.handleChange} autoComplete="birthDate" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="type">type</Label>
                        <Input type="select" name="type" id="type" value={pet.type.name}
                            onChange={this.handleChange} autoComplete="type">
                            {typeOptions}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="owner">Owner</Label>
                        {pet.id ?
                            <p>{pet.owner.user.username || ''}</p> :
                            <Input type="select" name="owner" id="owner" value={pet.owner || ''}
                                onChange={this.handleChange} autoComplete="owner">
                                {ownerOptions}
                            </Input>}
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/api/v1/pets">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}
export default PetEdit;