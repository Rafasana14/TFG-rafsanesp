import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class VisitEdit extends Component {

    emptyItem = {
        id: '',
        date: '',
        description: '',
        pet: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.jwt = JSON.parse(window.localStorage.getItem("jwt"));

        var pathArray = window.location.pathname.split('/');
        this.petId = pathArray[4];
        this.visitId = pathArray[6];
    }

    async componentDidMount() {
        if (this.id !== 'new') {
            const visit = await (await fetch(`/api/v1/pets/${this.petId}/visits/${this.visitId}`, {
                headers: {
                    "Authorization": `Bearer ${this.jwt}`,
                },
            })).json();
            this.setState({ item: visit });
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

        await fetch(`/api/v1/pets/${this.petId}/visits` + (item.id ? '/' + item.id : ''), {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                "Authorization": `Bearer ${this.jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        window.location.href = `/api/v1/pets/${this.petId}/visits`;
    }

    render() {
        const { item } = this.state;
        const title = <h2>{item.id ? 'Edit Visit' : 'Add Visit'}</h2>;

        return <div>
            {/* <AppNavbar /> */}
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="date">Date</Label>
                        <Input type="date" name="date" id="date" value={item.date || ''}
                            onChange={this.handleChange} autoComplete="date" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" id="description" value={item.description || ''}
                            onChange={this.handleChange} autoComplete="description" />
                    </FormGroup>

                    <FormGroup>
                        {item.id ?
                            <Input type="text" readOnly>{item.pet.name || ''}</Input> : <></>}

                    </FormGroup>
                    <br></br>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to={`/api/v1/pets/${this.petId}/visits`}>Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div >
    }
}
export default VisitEdit;