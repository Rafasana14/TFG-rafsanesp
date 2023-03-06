import React from 'react';
import { Navigate } from 'react-router-dom';
import tokenService from '../services/token.service';
// import { useLocalState } from '../util/useLocalStorage';

const PrivateRoute = ({ children }) => {
    // const [jwt,] = useLocalState("jwt","");
    const jwt = tokenService.getLocalAccessToken();
    return jwt
        ? children
        : <Navigate to="/login" />;
};

export default PrivateRoute;