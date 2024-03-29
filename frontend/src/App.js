import React from "react";
import { Route, Routes } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ErrorBoundary } from "react-error-boundary";
import AppNavbar from "./AppNavbar";
import Home from "./home";
import tokenService from "./services/token.service";
import PetEditAdmin from "./admin/pets/PetEditAdmin";
import PetListAdmin from "./admin/pets/PetListAdmin";
import UserListAdmin from "./admin/users/UserListAdmin";
import UserEditAdmin from "./admin/users/UserEditAdmin";
import OwnerListAdmin from "./admin/owners/OwnerListAdmin";
import OwnerEditAdmin from "./admin/owners/OwnerEditAdmin";
import SpecialtyListAdmin from "./admin/vets/SpecialtyListAdmin";
import SpecialtyEditAdmin from "./admin/vets/SpecialtyEditAdmin";
import VetListAdmin from "./admin/vets/VetListAdmin";
import VetEditAdmin from "./admin/vets/VetEditAdmin";
import VisitListAdmin from "./admin/visits/VisitListAdmin";
import VisitEditAdmin from "./admin/visits/VisitEditAdmin";
import ConsultationListAdmin from "./admin/consultations/ConsultationListAdmin";
import ConsultationEditAdmin from "./admin/consultations/ConsultationEditAdmin";
import SwaggerDocs from "./public/swagger";
import ConsultationEditOwner from "./owner/consultations/ConsultationEditOwner";
import ConsultationListOwner from "./owner/consultations/ConsultationListOwner";
import Login from "./auth/Login";
import PetEditOwner from "./owner/pets/PetEditOwner";
import PetListOwner from "./owner/pets/PetListOwner";
import PlanEdit from "./owner/PlanEdit";
import VisitEditOwner from "./owner/visits/VisitEditOwner";
import VisitListOwner from "./owner/visits/VisitListOwner";
import { PlanList } from "./public/plan/PlanList";
import ConsultationListVet from "./vet/consultations/ConsultationListVet";
import DashboardOwner from "./owner/dashboard/DashboardOwner";
import StatsAdmin from "./admin/dashboard/StatsAdmin";
import './App.css';
import TicketList from "./components/TicketList";
import Register from "./auth/Register";
import Logout from "./auth/Logout.js";
import PrivateRoute from "./util/privateRoute";
import ProfileEdit from "./components/ProfileEdit";
import { Col, Container, Row } from "reactstrap";
import SpecialtiesChange from "./vet/specialties/SpecialtiesChange";
import VisitListVet from "./vet/visits/VisitListVet";
import CalendarAuth from "./components/CalendarAuth";
import VisitCreate from "./components/VisitCreate";

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
  let commonRoutes = <></>;
  let publicRoutes = <></>;

  roles.forEach((role) => {
    if (role === "ADMIN") {
      adminRoutes = (
        <>
          <Route path="/dashboard" element={<PrivateRoute><StatsAdmin /></PrivateRoute>} />
          <Route path="/users" exact={true} element={<PrivateRoute><UserListAdmin /></PrivateRoute>} />
          <Route path="/users/:username" exact={true} element={<PrivateRoute><UserEditAdmin /></PrivateRoute>} />
          <Route path="/owners" exact={true} element={<PrivateRoute><OwnerListAdmin /></PrivateRoute>} />
          <Route path="/owners/:id" exact={true} element={<PrivateRoute><OwnerEditAdmin /></PrivateRoute>} />
          <Route path="/pets" exact={true} element={<PrivateRoute><PetListAdmin /></PrivateRoute>} />
          <Route path="/pets/:id" exact={true} element={<PrivateRoute><PetEditAdmin /></PrivateRoute>} />
          <Route path="/pets/:petId/visits" exact={true} element={<PrivateRoute><VisitListAdmin /></PrivateRoute>} />
          <Route path="/pets/:petId/visits/:visitId" exact={true} element={<PrivateRoute><VisitEditAdmin /></PrivateRoute>} />
          <Route path="/vets" exact={true} element={<PrivateRoute><VetListAdmin /></PrivateRoute>} />
          <Route path="/vets/:id" exact={true} element={<PrivateRoute><VetEditAdmin /></PrivateRoute>} />
          <Route path="/vets/specialties" exact={true} element={<PrivateRoute><SpecialtyListAdmin /></PrivateRoute>} />
          <Route path="/vets/specialties/:specialtyId" exact={true} element={<PrivateRoute><SpecialtyEditAdmin /></PrivateRoute>} />
          <Route path="/consultations" exact={true} element={<PrivateRoute><ConsultationListAdmin /></PrivateRoute>} />
          <Route path="/consultations/:consultationId" exact={true} element={<PrivateRoute><ConsultationEditAdmin /></PrivateRoute>} />
        </>)
    }
    if (role === "OWNER") {
      ownerRoutes = (
        <>
          <Route path="/dashboard" element={<PrivateRoute><DashboardOwner /></PrivateRoute>} />
          <Route path="/plan" exact={true} element={<PrivateRoute><PlanEdit /></PrivateRoute>} />
          <Route path="/pets" exact={true} element={<PrivateRoute><PetListOwner /></PrivateRoute>} />
          <Route path="/pets/:id" exact={true} element={<PrivateRoute><PetEditOwner /></PrivateRoute>} />
          <Route path="/pets/:id/visits" exact={true} element={<PrivateRoute><VisitListOwner /></PrivateRoute>} />
          <Route path="/pets/:id/visits/:id" exact={true} element={<PrivateRoute><VisitEditOwner /></PrivateRoute>} />
          <Route path="/visits/new" exact={true} element={<PrivateRoute><VisitCreate auth={"OWNER"} /></PrivateRoute>} />
          <Route path="/consultations" exact={true} element={<PrivateRoute><ConsultationListOwner /></PrivateRoute>} />
          <Route path="/consultations/:consultationId" exact={true} element={<PrivateRoute><ConsultationEditOwner /></PrivateRoute>} />
        </>)
    }
    if (role === "VET") {
      vetRoutes = (
        <>
          <Route path="/dashboard" element={<PrivateRoute><CalendarAuth auth={"VET"} /></PrivateRoute>} />
          <Route path="/owners" exact={true} element={<PrivateRoute><OwnerListAdmin admin={false} /></PrivateRoute>} />
          <Route path="/owners/:id" exact={true} element={<PrivateRoute><OwnerEditAdmin admin={false} /></PrivateRoute>} />
          <Route path="/pets" exact={true} element={<PrivateRoute><PetListAdmin admin={false} /></PrivateRoute>} />
          <Route path="/pets/:id" exact={true} element={<PrivateRoute><PetEditAdmin admin={false} /></PrivateRoute>} />
          <Route path="/pets/:petId/visits" exact={true} element={<PrivateRoute><VisitListAdmin admin={false} /></PrivateRoute>} />
          <Route path="/pets/:petId/visits/:visitId" exact={true} element={<PrivateRoute><VisitEditAdmin admin={false} /></PrivateRoute>} />
          <Route path="/visits" exact={true} element={<PrivateRoute><VisitListVet /></PrivateRoute>} />
          <Route path="/visits/new" exact={true} element={<PrivateRoute><VisitCreate auth={"VET"} /></PrivateRoute>} />
          <Route path="/vets" exact={true} element={<PrivateRoute><VetListAdmin admin={false} /></PrivateRoute>} />
          <Route path="/vets/specialties" exact={true} element={<PrivateRoute><SpecialtyListAdmin admin={false} /></PrivateRoute>} />
          <Route path="/consultations" exact={true} element={<PrivateRoute><ConsultationListVet /></PrivateRoute>} />
          <Route path="/specialties" exact={true} element={<PrivateRoute><SpecialtiesChange /></PrivateRoute>} />
        </>)
    }
    commonRoutes = (
      <>
        <Route path="/consultations/:consultationId/tickets" exact={true} element={<PrivateRoute><TicketList auth={role} /></PrivateRoute>} />
        <Route path="/profile" exact={true} element={<PrivateRoute><ProfileEdit auth={role} /></PrivateRoute>} />
      </>
    )
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
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  }

  return (
    <div className="body">
      <ErrorBoundary FallbackComponent={ErrorFallback} >
        <AppNavbar />
        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/plans" element={<PlanList />} />
          <Route path="/docs" element={<SwaggerDocs />} />
          {publicRoutes}
          {userRoutes}
          {adminRoutes}
          {ownerRoutes}
          {vetRoutes}
          {commonRoutes}
        </Routes>
        <Container fluid>
          <Row>
            <Col xs="4" md="4" lg="4" xl="4"><img className="footer-image-left responsive" src="/perros2.png" alt="dogs running" /></Col>
            <Col xs="4" md="4" lg="4" xl="4" align="center"><img className="footer-image-center responsive" src="/logo1-recortado.png" alt="logo" /></Col>
            <Col xs="4" md="4" lg="4" xl="4"><img className="footer-image-right responsive" src="/perros.png" alt="dogs running" /></Col>
          </Row>
        </Container>


      </ErrorBoundary>
    </div>
  );
}

export default App;
