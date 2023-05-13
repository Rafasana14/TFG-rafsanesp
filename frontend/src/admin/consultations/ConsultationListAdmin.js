import { useState } from 'react';
import tokenService from '../../services/token.service';
import consultationService from '../../services/consultation.service';
import useFetchState from '../../util/useFetchState';
import getErrorModal from '../../util/getErrorModal';

const jwt = tokenService.getLocalAccessToken();

export default function ConsultationListAdmin() {
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [consultations, setConsultations] = useFetchState([], `/api/v1/consultations`, jwt, setMessage, setVisible);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [alerts, setAlerts] = useState([]);

    function handleSearch(event) {
        consultationService.handleSearch(event, consultations, filter, setSearch, setFiltered, "ADMIN");
    }

    function handleFilter(event) {
        consultationService.handleFilter(event, consultations, setFilter, search, setFiltered, "ADMIN");
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
        [filtered, setFiltered], [alerts, setAlerts], setMessage, setVisible);
    const modal = getErrorModal(setVisible, visible, message);


    return (
        consultationService.render(alerts, modal, search, [handleFilter, handleSearch, handleClear], consultationList, "ADMIN")
    );
}
