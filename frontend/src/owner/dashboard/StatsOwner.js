import React, { useState } from 'react';
import { Col, Container, Row, Table } from 'reactstrap';
import "react-big-calendar/lib/css/react-big-calendar.css";
import getErrorModal from '../../util/getErrorModal';
import useFetchData from '../../util/useFetchData';
import tokenService from '../../services/token.service';
import { getBarStats, getPieStats } from '../../util/getStats';
import { useMediaQuery } from 'react-responsive';

const jwt = tokenService.getLocalAccessToken();

function StatsOwner() {
    const isMobile = useMediaQuery({ query: `(max-width: 767px)` });
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const consultationsStats = useFetchData(`/api/v1/consultations/stats`, jwt, setMessage, setVisible);
    const visitsStats = useFetchData(`/api/v1/visits/stats`, jwt, setMessage, setVisible);

    const modal = getErrorModal(setVisible, visible, message);

    const title = <h3 className='text-center'>Stats</h3>;

    return <div>
        <Container style={{ marginTop: "15px" }}>
            {title}
            <Row>
                <Col md="6">
                    <h4 className='text-center'>Consultations Stats</h4>
                    <Table align='center' style={{ maxWidth: "400px" }}>
                        <tbody>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Total Consultations</td>
                                <td className='stats-cell'>{consultationsStats.totalConsultations}</td>
                            </tr>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Average Consultation per Year</td>
                                <td className='stats-cell'>{consultationsStats.avgConsultationsPerYear}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {getBarStats('Number of Consultations by Year', 'Number of Consultations', consultationsStats.consultationsByYear)}
                    {getPieStats('Number of Consultations by Pet', 'Number of Consultations', consultationsStats.consultationsByPet)}
                </Col>
                {isMobile ? <div className="mb-4"><hr className="solid" /></div> : <></>}
                <Col md="6">
                    <h4 className='text-center'>Visits Stats</h4>
                    <Table color='info' align='center' style={{ maxWidth: "400px" }}>
                        <tbody>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Total Visits</td>
                                <td className='stats-cell'>{visitsStats.totalVisits}</td>
                            </tr>
                            <tr className="border border-dark">
                                <td className="table-info border border-dark">Average Visits per Year</td>
                                <td className='stats-cell'>{visitsStats.avgVisitsPerYear}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {getBarStats('Number of Visits by Year', 'Number of Visits', visitsStats.visitsByYear)}
                    {getPieStats('Number of Visits By Pet', 'Number of Visits', visitsStats.visitsByPet)}
                </Col>
            </Row>
        </Container>
        {modal}
    </div >
}
export default StatsOwner;