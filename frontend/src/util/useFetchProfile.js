import { useEffect, useState } from "react";
import tokenService from "../services/token.service";

export default function useFetchProfile(auth, jwt, setMessage, setVisible) {
    const [data, setData] = useState([]);
    useEffect(() => {
        let url;
        if (auth === "OWNER") url = "/api/v1/owners/profile";
        else if (auth === "VET") url = "/api/v1/vets/profile";
        else {
            const id = tokenService.getUser().id;
            url = `/api/v1/users/${id}`;
        }
        let ignore = false;
        fetch(url, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
            },
        })
            .then(response => response.json())
            .then(json => {
                if (!ignore) {
                    if (json.message) {
                        setMessage(json.message);
                        setVisible(true);
                    }
                    else {
                        setData(json);
                    }
                }
            }).catch((message) => alert(message));
        return () => {
            ignore = true;
        };
    }, [auth, jwt, setMessage, setVisible]);
    return [data, setData];
}