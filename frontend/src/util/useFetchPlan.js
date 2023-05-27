import { useEffect, useState } from "react";

export default function useFetchPlan(auth, jwt, setMessage, setVisible) {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (auth === "OWNER") {
            let ignore = false;
            fetch("/api/v1/plan", {
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
                            setData(json.plan);
                        }
                    }
                }).catch((message) => alert(message));
            return () => {
                ignore = true;
            };
        } else setData(null);
    }, [auth, jwt, setMessage, setVisible]);
    return data;
}