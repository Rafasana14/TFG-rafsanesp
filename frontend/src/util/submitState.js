import tokenService from "../services/token.service";

const jwt = tokenService.getLocalAccessToken();

export default async function submitState(event, state, baseUrl, setMessage, setVisible, setRedirect = null) {
    event.preventDefault();

    await fetch(baseUrl + (state.id ? '/' + state.id : ''), {
        method: (state.id) ? 'PUT' : 'POST',
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
                if (setRedirect) setRedirect(true);
            }
        })
        .catch((message) => alert(message));
}