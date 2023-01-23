import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLocalState } from '../util/useLocalStorage';

const PrivateRoute = ({ children }) => {
    const [jwt,] = useLocalState("jwt","");
    return jwt 
    ? children 
    : <Navigate to="/login"/>;
};

export default PrivateRoute;