import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class VetEdit extends Component {

    emptyItem = {
        id: '',
        firstName: '',
        lastName: '',
        specialties: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            availableSpecialties: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
        this.id = window.location.href.split("/api/v1/vets/")[1];
    }

    async componentDidMount() {
        if (this.id !== 'new') {
            const vet = await (await fetch(`/api/v1/vets/${this.id}`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                },
            })).json();
            this.setState({ item: vet });
        }
        const specialtiesList = await (await fetch(`/api/v1/vets/specialties/`, {
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
            },
        })).json();
        const { item, } = this.state;
        // this.setState({ specialties: specialtiesList });
        let aux = []
        for (var i = 0; i < specialtiesList.length; i++) {
            if (item.specialties.length > 0) {
                for (var j = 0; j < item.specialties.length; j++) {
                    let cond = false;
                    if (item.specialties[j].name === specialtiesList[i].name) cond = true;
                    if (cond === false) aux.push(specialtiesList[i])
                }
                this.setState({ availableSpecialties: aux });
            } else this.setState({ availableSpecialties: specialtiesList });
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

        await fetch('/api/v1/vets' + (item.id ? '/' + item.id : ''), {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        window.location.href = '/api/v1/vets';
    }

    render() {
        const { item, availableSpecialties } = this.state;
        const title = <h2>{item.id ? 'Edit Vet' : 'Add Vet'}</h2>;

        return <div>
            {/* <AppNavbar /> */}
            <Container className="d-flex ">
                <Col md={4}>
                    {title}
                    {availableSpecialties.map(specialty => <p key={specialty.id}>{specialty.name}</p>)}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input type="text" name="firstName" id="firstName" value={item.firstName || ''}
                                onChange={this.handleChange} autoComplete="firstName" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName">Last Name</Label>
                            <Input type="text" name="lastName" id="lastName" value={item.lastName || ''}
                                onChange={this.handleChange} autoComplete="lastName" />
                        </FormGroup>
                        <Label for="">Specialties</Label>
                        {item.specialties.map(specialty => <div key={specialty.id}>{specialty.name}</div>)}
                        <br></br>
                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/api/v1/vets">Cancel</Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Container>
        </div >
    }
}
export default VetEdit;