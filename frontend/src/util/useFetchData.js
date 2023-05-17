import { useEffect, useState } from "react";

export default function useFetchData(url, jwt, setMessage, setVisible) {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (url) {
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
        }
    }, [url, jwt, setMessage, setVisible]);
    return data;
}