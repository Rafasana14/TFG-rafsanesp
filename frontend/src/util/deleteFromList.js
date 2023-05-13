import tokenService from "../services/token.service";
import getDeleteAlertsOrModal from "./getDeleteAlertsOrModal";

export default function deleteFromList(url, id, [state, setState], [alerts, setAlerts], setMessage, setVisible, options = {}) {
    const jwt = tokenService.getLocalAccessToken();
    let confirmMessage = window.confirm("Are you sure you want to delete it?");
    if (confirmMessage) {
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
                    else if (options.filtered && options.setFiltered) {
                        setState(state.filter((i) => i.id !== id));
                        options.setFiltered(options.filtered.filter((i) => i.id !== id));
                    }
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