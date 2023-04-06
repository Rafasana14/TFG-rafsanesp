import React from "react";
import { Route, Routes } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ErrorBoundary } from "react-error-boundary";
import AppNavbar from "./AppNavbar";
import Home from "./home";
import PrivateRoute from "./privateRoute";
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
import Login from "./auth/login";
import Logout from "./auth/logout";
import VisitList from "./admin/visits/visitList";
import VisitEdit from "./admin/visits/visitEdit";
import OwnerPetList from "./owner/pets/petList";
import OwnerPetEdit from "./owner/pets/petEdit";
import OwnerVisitEdit from "./owner/visits/visitEdit";
import PlanList from "./public/plan";
import tokenService from "./services/token.service";
import SpecialtiesList from "./admin/vets/specialtiesList";
import SpecialtyEdit from "./admin/vets/specialtyEdit";
import OwnerDashboard from "./owner/dashboard";
import SwaggerDocs from "./public/swagger";
import ConsultationList from "./admin/consultations/consultationList";
import ConsultationEdit from "./admin/consultations/consultationEdit";
import OwnerConsultationList from "./owner/consultations/consultationList";
import OwnerConsultationEdit from "./owner/consultations/consultationEdit";
import OwnerConsultationTickets from "./owner/consultations/tickets/ticketList";
import VetConsultationList from "./vet/consultations/consultationList";
import VetConsultationTickets from "./vet/consultations/tickets/ticketList";
import AdminConsultationTickets from "./admin/consultations/tickets/ticketList";

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
  const jwt = tokenService.getLocalAccessToken();
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
  let vetRoutes = <></>;
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
          <Route path="/vets/specialties" exact={true} element={<PrivateRoute><SpecialtiesList /></PrivateRoute>} />
          <Route path="/vets/specialties/:specialtyId" exact={true} element={<PrivateRoute><SpecialtyEdit /></PrivateRoute>} />
          <Route path="/consultations" exact={true} element={<PrivateRoute><ConsultationList /></PrivateRoute>} />
          <Route path="/consultations/:consultationId" exact={true} element={<PrivateRoute><ConsultationEdit /></PrivateRoute>} />
          <Route path="/consultations/:consultationId/tickets" exact={true} element={<PrivateRoute><AdminConsultationTickets /></PrivateRoute>} />
        </>)
    }
    if (role === "OWNER") {
      ownerRoutes = (
        <>
          <Route path="/dashboard" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} />
          <Route path="/plan" exact={true} element={<PrivateRoute><PricingPlan /></PrivateRoute>} />
          <Route path="/myPets" exact={true} element={<PrivateRoute><OwnerPetList /></PrivateRoute>} />
          <Route path="/myPets/:id" exact={true} element={<PrivateRoute><OwnerPetEdit /></PrivateRoute>} />
          <Route path="/myPets/:id/visits/:id" exact={true} element={<PrivateRoute><OwnerVisitEdit /></PrivateRoute>} />
          <Route path="/consultations" exact={true} element={<PrivateRoute><OwnerConsultationList /></PrivateRoute>} />
          <Route path="/consultations/:consultationId" exact={true} element={<PrivateRoute><OwnerConsultationEdit /></PrivateRoute>} />
          <Route path="/consultations/:consultationId/tickets" exact={true} element={<PrivateRoute><OwnerConsultationTickets /></PrivateRoute>} />
        </>)
    }
    if (role === "VET") {
      vetRoutes = (
        <>
          {/* <Route path="/dashboard" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} /> */}
          <Route path="/myPets" exact={true} element={<PrivateRoute><OwnerPetList /></PrivateRoute>} />
          <Route path="/consultations" exact={true} element={<PrivateRoute><VetConsultationList /></PrivateRoute>} />
          <Route path="/consultations/:consultationId/tickets" exact={true} element={<PrivateRoute><VetConsultationTickets /></PrivateRoute>} />
        </>)
    }
  })
  if (!jwt) {
    publicRoutes = (
      <>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  } else {
    userRoutes = (
      <>
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  }

  return (
    <div>
      <AppNavbar />
      <ErrorBoundary FallbackComponent={ErrorFallback} >
        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/plans" element={<PlanList />} />
          <Route path="/docs" element={<SwaggerDocs />} />
          {publicRoutes}
          {userRoutes}
          {adminRoutes}
          {ownerRoutes}
          {vetRoutes}
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
