import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class VisitEdit extends Component {

    emptyVisit = {
        id: '',
        date: '',
        description: '',
        vet: {},
        pet: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            visit: this.emptyVisit,
            pet: {},
            vets: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleVetChange = this.handleVetChange.bind(this);
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

        const vets = await (await fetch(`/api/v1/vets/`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
            },
        })).json();
        this.setState({ vets: vets });

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

    handleVetChange(event) {
        const target = event.target;
        const value = Number(target.value);
        const vets = [...this.state.vets]
        let selectedVet = null;
        selectedVet = vets.filter((vet) => vet.id === value)[0];
        let visit = { ...this.state.visit };
        visit["vet"] = selectedVet;
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
        window.location.href = `/pets/${this.petId}/visits`;
    }

    render() {
        const { visit, pet, vets } = this.state;
        const title = <h2>{visit.id ? 'Edit Visit' : 'Add Visit'}</h2>;

        const vetOptions = vets.map(vet => <option key={vet.id} value={vet.id}>{vet.firstName} {vet.lastName}</option>);

        return <div>
            {/* <AppNavbar /> */}
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="date">Date</Label>
                        <Input type="date" required name="date" id="date" value={visit.date || ''}
                            onChange={this.handleChange} autoComplete="date" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="text" required name="description" id="description" value={visit.description || ''}
                            onChange={this.handleChange} autoComplete="description" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="vet">Vet</Label>
                        <Input type="select" name="vet" id="vet" value={visit.vet.id}
                            onChange={this.handleVetChange} autoComplete="vet">
                            {vetOptions}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="pet">Pet</Label>
                        <p>{pet.name || ''}</p>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to={`/pets/${this.petId}/visits`}>Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div >
    }
}
export default VisitEdit;