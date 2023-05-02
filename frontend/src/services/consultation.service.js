import { Link } from "react-router-dom";
import { Button, ButtonGroup } from "reactstrap";

class ConsultationService {
    getConsultationList(consultations, remove, plan = null) {
        return consultations.map((c) => {
            return (
                <tr key={c.id}>
                    <td>{c.title}</td>
                    <td>{c.status}</td>
                    {!plan ?
                        <td>{c.owner.user.username}</td> : <></>
                    }
                    <td>{c.pet.name}</td>
                    <td>{(new Date(c.creationDate)).toLocaleString()}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="info" tag={Link}
                                to={`/consultations/${c.id}/tickets`}>
                                Details
                            </Button>
                            {!plan || plan === "PLATINUM" ?
                                <Button size="sm" color="primary" tag={Link}
                                    to={"/consultations/" + c.id}>
                                    Edit
                                </Button> :
                                <></>
                            }
                            {!plan ?
                                <Button size="sm" color="danger" onClick={() => remove(c.id)}>
                                    Delete
                                </Button> :
                                <></>
                            }
                        </ButtonGroup>
                    </td>
                </tr>
            );
        });
    }
}
const consultationService = new ConsultationService();

export default consultationService;