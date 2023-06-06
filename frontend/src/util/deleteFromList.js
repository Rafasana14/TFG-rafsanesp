import tokenService from "../services/token.service";
import getDeleteAlertsOrModal from "./getDeleteAlertsOrModal";

export default function deleteFromList(url, id, [state, setState], [alerts, setAlerts], setMessage, setVisible, options = {}) {
    const jwt = tokenService.getLocalAccessToken();
    const confirmMessage = options.user ? " This will also delete the asociated user." : "";
    const confirm = window.confirm("Are you sure you want to delete it?" + confirmMessage);
    if (confirm) {
        fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    if (options.date)
                        setState(state.filter((i) => i.id !== id && i.creationDate < options.date));
                    else
                        setState(state.filter((i) => i.id !== id));
                }
                return response.json();
            })
            .then(json => {
                getDeleteAlertsOrModal(json, id, alerts, setAlerts, setMessage, setVisible);
            })
            .catch(() => alert("Error deleting entity"));
    }
}