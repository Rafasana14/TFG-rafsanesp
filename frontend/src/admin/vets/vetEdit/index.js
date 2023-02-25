import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';

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
            availableSpecialties: [],
            allSpecialties: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSpecialtyChange = this.handleSpecialtyChange.bind(this);
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
        this.setState({ allSpecialties: specialtiesList });
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

    // handleSpecialtyChange(event) {
    //     const target = event.target;
    //     const value = target.value;
    //     const allSpecialties = { ...this.state.allSpecialties }
    //     let item = { ...this.state.item };
    //     let selectedSpecialties = item.specialties;
    //     const selectedIds = selectedSpecialties.map(specialty => specialty.id);
    //     console.log(selectedIds);
    //     for (let i = 0; i < Object.keys(allSpecialties).length; i++) {
    //         if (allSpecialties[i].name === value) {
    //             if (allSpecialties[i].id in selectedIds) {
    //                 var index = selectedSpecialties.indexOf(allSpecialties[i]);
    //                 console.log(index);
    //                 if (index !== -1) {
    //                     selectedSpecialties.splice(index, 1);
    //                 }
    //                 selectedSpecialties = selectedSpecialties.filter(specialty => specialty.name !== value);
    //             } else selectedSpecialties.push(allSpecialties[i]);
    //         }
    //         console.log(selectedSpecialties);
    //     }
    //     item["specialties"] = selectedSpecialties;
    //     this.setState({ item });
    // }

    handleSpecialtyChange(event) {
        const target = event.target;
        const checked = target.checked;
        const name = target.name;
        const allSpecialties = { ...this.state.allSpecialties }
        let item = { ...this.state.item };
        let selectedSpecialties = item.specialties;
        for (let i = 0; i < Object.keys(allSpecialties).length; i++) {
            if (allSpecialties[i].name === name) {
                if (!checked) selectedSpecialties = selectedSpecialties.filter(specialty => specialty.name !== name);
                else selectedSpecialties.push(allSpecialties[i]);
            }
        }
        item["specialties"] = selectedSpecialties;
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
        const { item, allSpecialties } = this.state;
        const title = <h2>{item.id ? 'Edit Vet' : 'Add Vet'}</h2>;

        const selectedSpecialties = item.specialties.map(specialty => specialty.name);
        const specialties = allSpecialties.map(specialty => {
            if (selectedSpecialties.includes(specialty.name)) {
                return (<FormGroup key={specialty.name}>
                    <Input type="checkbox" name={specialty.name} onChange={this.handleSpecialtyChange} checked />
                    <Label for={specialty.name}> {specialty.name}</Label>
                </FormGroup>);
            } else {
                return (<FormGroup key={specialty.name}>
                    <Input type="checkbox" key={specialty.name} name={specialty.name} onChange={this.handleSpecialtyChange} />
                    <Label for={specialty.name}> {specialty.name}</Label>
                </FormGroup>);
            }
        });
        // const specialties = allSpecialties.map(specialty => {
        //     return <option key={specialty.id} value={specialty.name}>{specialty.name}</option>
        // });

        return (
            <div>
                <Container className="d-flex ">
                    <Col md={4}>
                        {title}
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
                            <Label for="specialties">Specialties</Label>
                            <Row className="row-cols-lg-auto g-3 align-items-center">
                                {specialties}
                            </Row>
                            {/* <Input type="select" multiple name="specialties" id="specialties" value={item.specialties.map(specialty => specialty.name) || ''}
                                onChange={this.handleSpecialtyChange} autoComplete="specialties">
                                {specialties}
                            </Input> */}
                            <br></br>
                            <FormGroup>
                                <Button color="primary" type="submit">Save</Button>{' '}
                                <Button color="secondary" tag={Link} to="/api/v1/vets">Cancel</Button>
                            </FormGroup>
                        </Form>
                    </Col>
                </Container>
            </div >
        )
    }
}
export default VetEdit;