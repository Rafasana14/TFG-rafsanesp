import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import tokenService from '../../services/token.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import deleteFromList from '../../util/deleteFromList';

const jwt = tokenService.getLocalAccessToken();

export default function OwnerListAdmin() {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [owners, setOwners] = useFetchState([], `/api/v1/owners`, jwt, setMessage, setVisible);
  const [alerts, setAlerts] = useState([]);

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
            <Button size="sm" color="primary" aria-label={'edit-' + owner.user.username} tag={Link} to={"/owners/" + owner.id}>Edit</Button>
            <Button size="sm" color="danger" aria-label={'delete-' + owner.user.username}
              onClick={() => deleteFromList(`/api/v1/owners/${owner.id}`, owner.id, [owners, setOwners], [alerts, setAlerts], setMessage, setVisible)}>
              Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    );
  });

  const modal = getErrorModal(setVisible, visible, message);

  return (
    <div>
      <Container fluid style={{ marginTop: "15px" }}>
        <h1 className="text-center">Owners</h1>
        {alerts.map((a) => a.alert)}
        {modal}
        <div className="float-right">
          <Button color="success" tag={Link} to="/owners/new">
            Add Owner
          </Button>
        </div>
        <Table aria-label="owners" className="mt-4">
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
    </div>
  );
}
