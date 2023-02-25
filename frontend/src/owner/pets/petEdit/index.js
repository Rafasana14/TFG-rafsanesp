import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class PetOwnerEdit extends Component {

    emptyItem = {
        id: null,
        name: '',
        birthDate: '',
        type: {},
        owner: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            pet: this.emptyItem,
            types: [],
        };
        this.handleChange = this.handleChange.bind(this);
        // this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));

        var pathArray = window.location.pathname.split('/');
        this.petId = pathArray[2];
    }

    async componentDidMount() {
        if (this.petId !== "new") {
            const pet = await (await fetch(`/api/v1/pets/${this.petId}`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                },
            })).json();
            const type = {
                type: pet.type.name,
            }
            this.setState({
                pet: pet,
                selectedType: type,
            });
        }
        const types = await (await fetch(`/api/v1/pets/types`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
            },
        })).json();
        this.setState({ types: types });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let pet = { ...this.state.pet };
        if (name === "type" || !pet.type.name) {
            const types = { ...this.state.types }
            let selectedType = null;
            for (let i = 0; i < Object.keys(types).length; i++) {
                if (types[i].name === value) selectedType = types[i];
                if (!pet.type.name && types[i].name === "bird") selectedType = types[i];
            }
            pet["type"] = selectedType;
        }
        if (name !== "type") pet[name] = value
        this.setState({ pet });

    }

    async handleSubmit(event) {
        event.preventDefault();
        const { pet, } = this.state;

        await fetch('/api/v1/pets' + (pet.id ? '/' + this.petId : ''), {
            method: pet.id ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pet),
        });
        window.location.href = '/myPets';
        // .then(function (response) {
        //     if (response.status === 201) window.location.href = '';
        //     else return response.json();
        // }).then(function (data) {
        //     alert(data.message);
        // }).catch((message) => {
        //     alert(data.message);
        // });

    }

    render() {
        const { pet, types } = this.state;
        const title = <h2>{pet.id ? 'Edit Pet' : 'Add Pet'}</h2>;

        const typeOptions = types.map(type => {
            return < option key={type.id} value={type.name} > {type.name}</option >
        });

        return <div>
            {/* <AppNavbar /> */}
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" required name="name" id="name" value={pet.name || ''}
                            onChange={this.handleChange} autoComplete="name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="birthDate">Birth Date</Label>
                        <Input type="date" required name="birthDate" id="birthDate" value={pet.birthDate || ''}
                            onChange={this.handleChange} autoComplete="birthDate" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="type">Type</Label>
                        <Input type="select" required name="type" id="type" value={pet.type.name || ""}
                            onChange={this.handleChange} autoComplete="type">
                            {typeOptions}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/myPets">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}
export default PetOwnerEdit;