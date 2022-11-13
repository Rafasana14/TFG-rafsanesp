import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class OwnerList extends Component {

    constructor(props) {
        super(props);
        this.state = {owners: []};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/api/v1/owners')
            .then(response => response.json())
            .then(data => this.setState({owners: data}));
    }

    async remove(id) {
        await fetch(`/api/v1/owners/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedOwners = [...this.state.owners].filter(i => i.id !== id);
            this.setState({owners: updatedOwners});
        });
    }
    
    render() {
        const {owners, isLoading} = this.state;
    
        if (isLoading) {
            return <p>Loading...</p>;
        }
    
        const ownerList = owners.map(owner => {
            return <tr key={owner.id}>
                <td style={{whiteSpace: 'nowrap'}}>{owner.firstName} {owner.lastName}</td>
                <td>{owner.address}</td>
                <td>{owner.city}</td>
                <td>{owner.telephone}</td>
                <td>{owner.user.username}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/api/v1/owners/" + owner.id + "/edit"}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(owner.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });
    
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/api/v1/owners/new">Add Owner</Button>
                    </div>
                    <h3>Clients</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Name</th>
                            <th width="10%">Address</th>
                            <th width="10%">City</th>
                            <th width="10%">Telephone</th>
                            <th width="10%">User</th>
                            <th width="40%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ownerList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }

}

export default OwnerList;

