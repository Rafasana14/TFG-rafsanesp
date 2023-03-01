//import logo from './logo.svg';
import React from "react";
import { Route, Routes } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ErrorBoundary } from "react-error-boundary";
import AppNavbar from "./AppNavbar";
import Dashboard from "./dashboard";
import Home from "./home";
import PrivateRoute from "./privateRoute";
import RegisterOwner from "./auth/register/owner";
import PetEdit from "./admin/pets/petEdit";
import UserList from "./admin/users/userList";
import UserEdit from "./admin/users/userEdit";
import OwnerList from "./admin/owners/ownerList";
import OwnerEdit from "./admin/owners/ownerEdit";
import PetList from "./admin/pets/petList";
import VetList from "./admin/vets/vetList";
import VetEdit from "./admin/vets/vetEdit";
import PricingPlan from "./owner/plan";
import Register from "./auth/register";
import RegisterVet from "./auth/register/vet";
import Login from "./auth/login";
import Logout from "./auth/logout";
import VisitList from "./admin/visits/visitList";
import VisitEdit from "./admin/visits/visitEdit";
import PetOwnerList from "./owner/pets/petList";
import PetOwnerEdit from "./owner/pets/petEdit";
import VisitOwnerEdit from "./owner/visits/visitEdit";
import PlanList from "./public/plan";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const jwt = JSON.parse(window.localStorage.getItem("jwt"));
  let roles = []
  if (jwt) {
    roles = getRolesFromJWT(jwt);
  }

  function getRolesFromJWT(jwt) {
    return jwt_decode(jwt).authorities;
  }

  let adminRoutes = <></>;
  let ownerRoutes = <></>;
  let userRoutes = <></>;
  let publicRoutes = <></>;

  roles.forEach((role) => {
    if (role === "ADMIN") {
      adminRoutes = (
        <>

          <Route path="/users" exact={true} element={<PrivateRoute><UserList /></PrivateRoute>} />
          <Route path="/users/:username" exact={true} element={<PrivateRoute><UserEdit /></PrivateRoute>} />
          <Route path="/owners" exact={true} element={<PrivateRoute><OwnerList /></PrivateRoute>} />
          <Route path="/owners/:id" exact={true} element={<PrivateRoute><OwnerEdit /></PrivateRoute>} />
          <Route path="/pets" exact={true} element={<PrivateRoute><PetList /></PrivateRoute>} />
          <Route path="/pets/:id" exact={true} element={<PrivateRoute><PetEdit /></PrivateRoute>} />
          <Route path="/pets/:petId/visits" exact={true} element={<PrivateRoute><VisitList /></PrivateRoute>} />
          <Route path="/pets/:petId/visits/:visitId" exact={true} element={<PrivateRoute><VisitEdit /></PrivateRoute>} />
          <Route path="/vets" exact={true} element={<PrivateRoute><VetList /></PrivateRoute>} />
          <Route path="/vets/:id" exact={true} element={<PrivateRoute><VetEdit /></PrivateRoute>} />

        </>)
    }
    if (role === "OWNER") {
      ownerRoutes = (
        <>
          <Route path="/plan" exact={true} element={<PrivateRoute><PricingPlan /></PrivateRoute>} />
          <Route path="/myPets" exact={true} element={<PrivateRoute><PetOwnerList /></PrivateRoute>} />
          <Route path="/myPets/:id" exact={true} element={<PrivateRoute><PetOwnerEdit /></PrivateRoute>} />
          <Route path="/myPets/:id/visits/:id" exact={true} element={<PrivateRoute><VisitOwnerEdit /></PrivateRoute>} />
        </>)
    }
  })
  if (!jwt) {
    publicRoutes = (
      <>
        <Route path="/register" element={<Register />} />
        <Route path="/register/owner" element={<RegisterOwner />} />
        <Route path="/register/vet" element={<RegisterVet />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  } else {
    userRoutes = (
      <Route path="/logout" element={<Logout />} />
    )
  }

  return (
    <div>
      <AppNavbar />
      <ErrorBoundary FallbackComponent={ErrorFallback} >
        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/plans" element={<PlanList />} />
          {publicRoutes}
          {userRoutes}
          {adminRoutes}
          {ownerRoutes}
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
