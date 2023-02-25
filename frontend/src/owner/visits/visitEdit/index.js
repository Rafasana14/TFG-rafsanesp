import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class VisitOwnerEdit extends Component {

    emptyVisit = {
        id: '',
        date: '',
        description: '',
        pet: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            visit: this.emptyVisit,
            pet: {},
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));

        var pathArray = window.location.pathname.split('/');
        this.petId = pathArray[2];
        this.visitId = pathArray[4];
    }

    async componentDidMount() {
        const pet = await (await fetch(`/api/v1/pets/${this.petId}`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
            },
        })).json();
        this.setState({ pet: pet });

        if (this.visitId !== 'new') {
            const visit = await (await fetch(`/api/v1/pets/${this.petId}/visits/${this.visitId}`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                },
            })).json();
            this.setState({ visit: visit });
        }


    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let visit = { ...this.state.visit };
        visit[name] = value;
        this.setState({ visit });
    }

    async handleSubmit(event) {
        event.preventDefault();
        let visit = { ...this.state.visit };
        const pet = { ...this.state.pet };
        visit["pet"] = pet;

        await fetch(`/api/v1/pets/${this.petId}/visits` + (visit.id ? '/' + visit.id : ''), {
            method: (visit.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(visit),
        });
        window.location.href = `/myPets`;
    }

    render() {
        const { visit, pet } = this.state;
        const title = <h2>{visit.id ? 'Edit Visit' : 'Add Visit'}</h2>;

        const date = new Date(visit.date);
        let dateInput;
        if (visit.id && date < Date.now()) {
            dateInput = <Input type="date" readOnly name="date" id="date" value={visit.date || ''}
                onChange={this.handleChange} autoComplete="date" />
        } else {
            dateInput = <Input type="date" required name="date" id="date" value={visit.date || ''}
                onChange={this.handleChange} autoComplete="date" />
        }

        return <div>
            {/* <AppNavbar /> */}
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="date">Date</Label>
                        {dateInput}
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        {<Input type="text" required name="description" id="description" value={visit.description || ''}
                            onChange={this.handleChange} autoComplete="description" />}
                    </FormGroup>
                    <FormGroup>
                        <Label for="pet">Pet</Label>
                        <p>{pet.name || ''}</p>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to={`/myPets`}>Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div >
    }
}
export default VisitOwnerEdit;