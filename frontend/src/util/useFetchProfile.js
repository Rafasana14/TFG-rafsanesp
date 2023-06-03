import { useEffect, useState } from "react";
import tokenService from "../services/token.service";
import { fetchAndSet } from "./useFetchData";

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
        fetchAndSet(url, jwt, ignore, setMessage, setVisible, setData);
        return () => {
            ignore = true;
        };
    }, [auth, jwt, setMessage, setVisible]);
    return [data, setData];
}