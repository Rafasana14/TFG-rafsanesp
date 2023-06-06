import { useEffect, useState } from "react";

export function fetchAndSet(url, jwt, ignore, setMessage, setVisible, setData) {
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
};

export default function useFetchData(url, jwt, setMessage, setVisible, admin = true) {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (url && admin) {
            let ignore = false;
            fetchAndSet(url, jwt, ignore, setMessage, setVisible, setData);
            return () => {
                ignore = true;
            };
        }
    }, [url, jwt, setMessage, setVisible, admin]);
    return data;
}