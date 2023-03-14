import React, { Component } from "react";
import { Button, ButtonGroup, Container, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
// import AppNavbar from "./AppNavbar";
import { Link } from "react-router-dom";

class OwnerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owners: [],
      message: null,
      modalShow: false,
    };
    this.remove = this.remove.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.jwt = JSON.parse(window.localStorage.getItem("jwt"));
  }

  async componentDidMount() {
    const owners = await (await fetch("/api/v1/owners", {
      headers: {
        "Authorization": `Bearer ${this.jwt}`,
      },
    })).json();
    if (owners.message) this.setState({ message: owners.message });
    else this.setState({ owners: owners });
  }

  async remove(id) {
    await fetch(`/api/v1/owners/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${this.jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 200) {
        let updatedOwners = [...this.state.owners].filter((i) => i.id !== id);
        this.setState({ owners: updatedOwners });
      }
      return response.json();
    }).then(data => {
      this.setState({ message: data.message, modalShow: true });
    });
  }

  handleShow() {
    let modalShow = this.state.modalShow;
    this.setState({ modalShow: !modalShow });
  }

  render() {
    const { owners, isLoading } = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const ownerList = owners.map((owner) => {
      return (
        <tr key={owner.id}>
          <td style={{ whiteSpace: "nowrap" }}>
            {owner.firstName} {owner.lastName}
          </td>
          <td>{owner.address}</td>
          <td>{owner.city}</td>
          <td>{owner.telephone}</td>
          <td>{owner.user.username}</td>
          <td>{owner.plan}</td>
          <td>
            <ButtonGroup>
              <Button size="sm" color="primary" tag={Link} to={"/owners/" + owner.id}>Edit</Button>
              <Button size="sm" color="danger" onClick={() => this.remove(owner.id)}>Delete</Button>
            </ButtonGroup>
          </td>
        </tr>
      );
    });

    let modal = <></>;
    if (this.state.message) {
      const show = this.state.modalShow;
      const closeBtn = (
        <button className="close" onClick={this.handleShow} type="button">
          &times;
        </button>
      );
      modal = <div>
        <Modal isOpen={show} toggle={this.handleShow}
          keyboard={false}>
          <ModalHeader toggle={this.handleShow} close={closeBtn}>Alert!</ModalHeader>
          <ModalBody>
            {this.state.message || ""}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleShow}>Close</Button>
          </ModalFooter>
        </Modal></div>
    }

    return (
      <div>
        {/* <AppNavbar /> */}
        <Container fluid style={{ marginTop: "15px" }}>
          <h1 className="text-center">Owners</h1>
          <div className="float-right">
            <Button color="success" tag={Link} to="/owners/new">
              Add Owner
            </Button>
          </div>
          <Table className="mt-4">
            <thead>
              <tr>
                <th width="10%">Name</th>
                <th width="10%">Address</th>
                <th width="10%">City</th>
                <th width="10%">Telephone</th>
                <th width="10%">User</th>
                <th width="10%">Plan</th>
                <th width="40%">Actions</th>
              </tr>
            </thead>
            <tbody>{ownerList}</tbody>
          </Table>
        </Container>
        {modal}
      </div>
    );
  }
}

export default OwnerList;
