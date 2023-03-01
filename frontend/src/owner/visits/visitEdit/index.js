import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class VisitOwnerEdit extends Component {

    emptyVisit = {
        id: '',
        date: '',
        description: '',
        pet: {},
        vet: {
            id: null,
            city: "",
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            visit: this.emptyVisit,
            pet: { owner: { plan: "BASIC" } },
            city: null,
            vets: [],
            message: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
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
        if (pet.message) this.setState({ message: pet.message });
        else this.setState({ pet: pet });

        if (!this.state.message) {
            const vets = await (await fetch(`/api/v1/vets`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                },
            })).json();
            if (vets.message) this.setState({ message: vets.message });
            else this.setState({ vets: vets });

            if (this.visitId !== 'new' && !this.state.message) {
                const visit = await (await fetch(`/api/v1/pets/${this.petId}/visits/${this.visitId}`, {
                    headers: {
                        "Authorization": `Bearer ${this.jwt}`,
                    },
                })).json();
                if (visit.message) this.setState({ message: visit.message });
                else
                    this.setState({
                        visit: visit,
                        city: visit.vet.city,
                    });
            }
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let visit = { ...this.state.visit };
        if (name === "vet") {
            visit[name].id = value;
        } else visit[name] = value;
        this.setState({ visit });
    }

    handleCityChange(event) {
        const target = event.target;
        const value = target.value;
        let city = this.state.city;
        city = value;
        this.setState({ city });

        let visit = { ...this.state.visit };
        let vets = [...this.state.vets];
        const plan = this.state.pet.owner.plan;
        if (plan === "BASIC") {
            vets = vets.filter((vet) => vet.city === value);
            let randomIndex = Math.floor(Math.random() * vets.length);
            visit.vet = vets[randomIndex];
            this.setState({ visit });
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        let visit = { ...this.state.visit };
        const pet = { ...this.state.pet };
        visit["pet"] = pet;

        const submit = await (await fetch(`/api/v1/pets/${this.petId}/visits` + (visit.id ? '/' + visit.id : ''), {
            method: (visit.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(visit),
        })).json();
        if (submit.message) this.setState({ message: visit.message });
        else window.location.href = `/myPets`;
    }

    render() {
        if (this.state.message) {
            return <h2>{this.state.message}</h2>
        } else {
            const { visit, pet, city, vets } = this.state;
            const title = <h2>{visit.id ? 'Edit Visit' : 'Add Visit'}</h2>;

            const date = new Date(visit.date);
            let dateInput;
            if (visit.id && date < Date.now()) {
                dateInput = <Input type="date" readOnly name="date" id="date" value={visit.date || ''}
                    onChange={this.handleChange} />
            } else {
                dateInput = <Input type="date" required name="date" id="date" value={visit.date || ''}
                    onChange={this.handleChange} />
            }
            var cities = [];
            vets.forEach(vet => {
                if (!cities.includes(vet.city)) cities.push(vet.city);
            });
            let i = 0;
            const citiesOptions = cities.map(city => {
                i++;
                if (visit.id && date < Date.now()) {
                    if (visit.vet.city === city) {
                        return (<div key={city} className="form-check form-check-inline">
                            <Input className="form-check-input" required type="radio" defaultChecked name="city" id={`city${i}`} value={city}
                                onChange={this.handleCityChange} ></Input>
                            <Label className="form-check-label" for={`city${i}`}>{city}</Label>
                        </div>)
                    } else {
                        return (<div key={city} className="form-check form-check-inline">
                            <Input className="form-check-input" type="radio" disabled name="city" id={`city${i}`} value={city}
                                onChange={this.handleCityChange} ></Input>
                            <Label className="form-check-label" for={`city${i}`}>{city}</Label>
                        </div>)
                    }
                } else {
                    if (visit.vet.city === city) {
                        return (<div key={city} className="form-check form-check-inline">
                            <Input className="form-check-input" defaultChecked type="radio" name="city" id={`city${i}`} value={city}
                                onChange={this.handleCityChange}></Input>
                            <Label className="form-check-label" for={`city${i}`}>{city}</Label>
                        </div>)
                    } else
                        return (<div key={city} className="form-check form-check-inline">
                            <Input className="form-check-input" required type="radio" name="city" id={`city${i}`} value={city}
                                onChange={this.handleCityChange} ></Input>
                            <Label className="form-check-label" for={`city${i}`}>{city}</Label>
                        </div>)
                }

            });

            const plan = pet.owner.plan;

            let vetSelection = null;
            if (visit.id && date < Date.now()) {
                vetSelection = <Input type="text" readOnly name="vet" id="vet" value={visit.vet.id ? (visit.vet.firstName + " " + visit.vet.lastName) : ''}
                    onChange={this.handleChange} />
            } else {
                if (plan !== "BASIC") {
                    const vetsAux = vets.filter(vet => vet.city === city);
                    const vetsOptions = vetsAux.map(vet => {
                        let spAux = vet.specialties.map(s => s.name).toString().replace(",", ", ");
                        return <option key={vet.id} value={vet.id}>{vet.firstName} {vet.lastName + " "}{spAux !== "" ? "- " + spAux : ""}</option>
                    })
                    vetSelection = <Input type="select" required name="vet" id="vet" value={visit.vet.id ? visit.vet.id : ''}
                        onChange={this.handleChange} >
                        <option value="">None</option>
                        {vetsOptions}</Input>
                } else {
                    vetSelection = <Input type="text" readOnly name="vet" id="vet" value={visit.vet.id ? (visit.vet.firstName + " " + visit.vet.lastName) : ''}
                        onChange={this.handleChange} />
                }

            }

            return <div>
                <Container>
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="date">Date</Label>
                            {dateInput}
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            {/* poner required tras reunión */}
                            <Input type="text" name="description" id="description" value={visit.description || ''}
                                onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="city">Select City for the Visit</Label><br></br>
                            {citiesOptions}
                        </FormGroup>
                        <FormGroup>
                            {plan === "BASIC" ? <Label for="vet">Vet (As you have BASIC Plan, Vet will be selected randomly from the ones in the city)</Label> :
                                <Label for="vet">Vet</Label>}
                            {vetSelection}
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
}
export default VisitOwnerEdit;