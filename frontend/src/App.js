//import logo from './logo.svg';
import React from "react";
import { Route, Routes } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import Dashboard from "./dashboard";
import Home from "./home";
import Login from "./login";
import PrivateRoute from "./privateRoute";
import VetList from "./vets/vetList";
import UserList from "./users/userList";
import OwnerEdit from "./owners/ownerEdit";
import OwnerList from "./owners/ownerList";
import UserEdit from "./users/userEdit";

function App() {

  return (
    <div>
      <AppNavbar />
      <Routes>
        <Route path="/" exact={true} element={<Home />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/api/v1/users" exact={true} element={<PrivateRoute><UserList /></PrivateRoute>} />
        <Route path="/api/v1/users/:username" exact={true} element={<PrivateRoute><UserEdit /></PrivateRoute>} />
        <Route path="/api/v1/owners" exact={true} element={<PrivateRoute><OwnerList /></PrivateRoute>} />
        <Route path="/api/v1/owners/:id" exact={true} element={<PrivateRoute><OwnerEdit /></PrivateRoute>} />
        <Route path="/api/v1/vets" exact={true} element={<PrivateRoute><VetList /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
