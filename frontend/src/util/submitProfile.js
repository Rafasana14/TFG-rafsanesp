import { Alert } from "reactstrap";
import tokenService from "../services/token.service";
import { login } from "../auth/Login";

const jwt = tokenService.getLocalAccessToken();
function dismiss(alerts, id, setAlerts) {
    setAlerts(alerts.filter(i => i.id !== id))
}

export default async function submitProfile(event, state, auth, setMessage, setVisible, [alerts, setAlerts], specialties = false) {
    event.preventDefault();

    let url, username, password;
    if (auth === "OWNER") {
        url = "/api/v1/owners/profile";
        username = state.user.username;
        password = state.user.password;
    }
    else if (auth === "VET") {
        url = "/api/v1/vets/profile";
        username = state.user.username;
        password = state.user.password;
    }
    else {
        const id = tokenService.getUser().id;
        url = `/api/v1/users/${id}`;
        username = state.username;
        password = state.password;
    }

    let status;
    await fetch(url, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${jwt}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(state),
    })
        .then((response) => response.json())
        .then(json => {
            if (json.message) {
                setMessage(json.message);
                setVisible(true);
            } else {
                status = "200";
            }
        })
        .catch((message) => alert(message));

    if (status === "200") {
        const alertId = `alert-edit`
        setAlerts([
            ...alerts,
            {
                alert: <Alert aria-label="alert-edit" toggle={() => dismiss(alerts, alertId, setAlerts)} key={alertId} id={alertId} color="info">
                    Profile updated!
                </Alert>,
                id: alertId
            }
        ]);
        if (!specialties) await login(username, password, true, setMessage, setVisible);
    }
}