import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useNavigateAfterSubmit(url, redirect) {
    const navigate = useNavigate();
    useEffect(() => {
        if (redirect) navigate(url);
    }, [url, redirect, navigate]);
    return navigate;
}