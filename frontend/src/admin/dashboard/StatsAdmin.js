import React, { useState } from 'react';
import { Col, Container, Row, Table } from 'reactstrap';
import "react-big-calendar/lib/css/react-big-calendar.css";
import getErrorModal from '../../util/getErrorModal';
import useFetchData from '../../util/useFetchData';
import tokenService from '../../services/token.service';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { getBarStats, getPieStats } from '../../util/getStats';
import { useMediaQuery } from 'react-responsive';

const jwt = tokenService.getLocalAccessToken();

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function StatsAdmin() {
    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const visitsStats = useFetchData(`/api/v1/visits/stats`, jwt, setMessage, setVisible); // avgVisitsPerPet, totalVisits, visitsByYear
    const ownersStats = useFetchData(`/api/v1/owners/stats`, jwt, setMessage, setVisible); // ownersByPlan, totalOwners, moreThanOnePet
    const consultationsStats = useFetchData(`/api/v1/consultations/stats`, jwt, setMessage, setVisible); // totalConsultations, avgConsultationsPerOwner
    const vetsStats = useFetchData(`/api/v1/vets/stats`, jwt, setMessage, setVisible); //vetsBySpecialty, vetsByCity, totalVets, visitsByVet
    const petsStats = useFetchData(`/api/v1/pets/stats`, jwt, setMessage, setVisible); //petsByType, avgPetsPerOwner, totalPets

    const modal = getErrorModal(setVisible, visible, message);

    const title = <h2 className='text-center'>Stats</h2>;

    return (
        <Container style={{ marginTop: "15px" }}>
            {modal}
            {title}
            <Row>
                <Col md="6">
                    <h4 className='text-center'>Owners Stats</h4>
                    <Table aria-label='owners-stats' color='info' align='center' style={{ maxWidth: "400px" }}>
                        <tbody>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Total Owners</td>
                                <td >{ownersStats.totalOwners}</td>
                            </tr>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Owners with more than 1 Pet</td>
                                <td >{ownersStats.moreThanOnePet}</td>
                            </tr>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Total Consultations</td>
                                <td >{consultationsStats.totalConsultations}</td>
                            </tr>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Average Consultations per Owner</td>
                                <td >{consultationsStats.avgConsultationsPerOwner}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {getPieStats('Number of Owners by Plan', 'Number of Owners', ownersStats.ownersByPlan, true)}
                </Col>
                {isMobile ? <div className="mb-4"><hr className="solid" /></div> : <></>}
                <Col md="6">
                    <h4 className='text-center'>Vets Stats</h4>
                    <Table aria-label='vets-stats' color='info' align='center' style={{ maxWidth: "400px" }}>
                        <tbody>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Total Vets</td>
                                <td >{vetsStats.totalVets}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {getBarStats('Number of Vets by City', 'Number of Vets', vetsStats.vetsByCity)}
                    {getBarStats('Number of Vets by Specialty', 'Number of Vets', vetsStats.vetsBySpecialty)}
                </Col>
            </Row>
            <div className="mb-4">
                <hr className="solid" />
            </div>
            <Row>
                <Col md="6">
                    <h4 className='text-center'>Pets Stats</h4>
                    <Table aria-label='pets-stats' color='info' align='center' style={{ maxWidth: "400px" }}>
                        <tbody>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Total Pets</td>
                                <td >{petsStats.totalPets}</td>
                            </tr>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Average Pets per Owner</td>
                                <td >{petsStats.avgPetsPerOwner}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {getBarStats('Number of Pets by Type', 'Number of Pets', petsStats.petsByType)}
                </Col>
                {isMobile ? <div className="mb-4"><hr className="solid" /></div> : <></>}
                <Col md="6">
                    <h4 className='text-center'>Visits Stats</h4>
                    <Table aria-label='visits-stats' color='info' align='center' style={{ maxWidth: "400px" }}>
                        <tbody>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Total Vets</td>
                                <td >{visitsStats.totalVisits}</td>
                            </tr>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Average Visits per Pet</td>
                                <td >{visitsStats.avgVisitsPerPet}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {getBarStats('Number of Visits by Year', 'Number of Visits', visitsStats.visitsByYear)}
                    {getPieStats('Number of Visits By Vet', 'Number of Visits', vetsStats.visitsByVet)}
                </Col>
            </Row>
        </Container>
    )
}
export default StatsAdmin;