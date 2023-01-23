import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class VetList extends Component {

    constructor(props) {
        super(props);
        this.state = { vets: [] };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/api/v1/vets')
            .then(response => response.json())
            .then(data => this.setState({ vets: data }));
    }

    async remove(id) {
        await fetch(`/api/v1/vets/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedVets = [...this.state.vets].filter(i => i.id !== id);
            this.setState({ vets: updatedVets });
        });
    }

    render() {
        const { vets, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const vetList = vets.map(vet => {
            return <tr key={vet.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{vet.firstName} {vet.lastName}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/api/v1/vets/" + vet.id + "/edit"}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(vet.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/api/v1/vets/new">Add Vet</Button>
                    </div>
                    <h3>Vets</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="60%">Name</th>
                                <th width="40%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vetList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }

}

export default VetList;

