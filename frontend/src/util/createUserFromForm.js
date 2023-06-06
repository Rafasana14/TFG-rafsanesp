import { FormGroup, Input, Label } from "reactstrap"
import tokenService from "../services/token.service";

const jwt = tokenService.getLocalAccessToken();

export function getUserCreateForm(entity, user, handleChange, handleUserChange, userOptions) {
    if (entity.id) {
        return <FormGroup>
            <Label for="user">User</Label>
            <Input type="text" disabled name="user" id="user" value={entity.user?.username || ""} />
        </FormGroup>
    } else {
        if (user.create === "yes") {
            return <FormGroup>
                <Label for="user">User</Label>
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input type="text" name="username" id="username" required value={user.username || ''}
                        onChange={handleUserChange} />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" aria-label='password' role='textbox' required name="password" id="password" value={user.password || ''}
                        onChange={handleUserChange} />
                </FormGroup>
            </FormGroup>
        } else if (user.create === "no") {
            return <FormGroup>
                <Label for="user">User</Label>
                <Input type="select" required name="user" id="user" value={entity.user?.id || ""}
                    onChange={handleChange} >
                    <option value="">None</option>
                    {userOptions}
                </Input>
            </FormGroup>
        }
    }
}

export async function submitUserState(event, user, state, url, setMessage, setVisible, setRedirect) {
    event.preventDefault();

    let status = "";
    let res;
    await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${jwt}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    })
        .then((response) => response.json())
        .then(json => {
            if (json.message) {
                setMessage(json.message);
                setVisible(true);
            } else {
                status = "200";
                res = { ...state, user: json };
            }
        })
        .catch((message) => alert(message));
    if (status === "200") {
        await fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${jwt}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(res),
        })
            .then((response) => response.json())
            .then(json => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                } else {
                    setRedirect(true);
                }
            })
            .catch((message) => alert(message));
    }
}