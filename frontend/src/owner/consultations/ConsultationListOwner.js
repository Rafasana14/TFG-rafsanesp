import { useState } from 'react';
import tokenService from '../../services/token.service';
import consultationService from '../../services/consultation.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';
import useFetchData from '../../util/useFetchData';

const jwt = tokenService.getLocalAccessToken();

export default function ConsultationListOwner() {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [consultations, setConsultations] = useFetchState([], `/api/v1/consultations`, jwt, setMessage, setVisible);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [alerts, setAlerts] = useState([]);
    const plan = useFetchData("/api/v1/plan", jwt).plan;

    function handleSearch(event) {
        consultationService.handleSearch(event, consultations, filter, setSearch, setFiltered, "OWNER");
    }

    function handleFilter(event) {
        consultationService.handleFilter(event, consultations, setFilter, search, setFiltered, "OWNER");
    }

    function handleClear() {
        consultationService.handleClear(consultations, setFiltered, setSearch, setFilter);
    }

    let consultationList;
    if (filtered.length === 0 && (filter !== "" || search !== "")) consultationList =
        <tr>
            <td>There are no consultations with those filter and search parameters.</td>
        </tr>
    else consultationList = consultationService.getConsultationList([consultations, setConsultations],
        [filtered, setFiltered], [alerts, setAlerts], setMessage, setVisible, plan);
    const modal = getErrorModal(setVisible, visible, message);

    return (
        consultationService.render(alerts, modal, search, [handleFilter, handleSearch, handleClear], consultationList, "OWNER")
    );
}
