import { useState } from "react";
import tokenService from "../../services/token.service";
import useFetchData from "../../util/useFetchData";
import { Button, ButtonGroup, Container } from "reactstrap";
import { Link } from "react-router-dom";
import CalendarOwner from "./CalendarOwner";
import getErrorModal from "../../util/getErrorModal";

const jwt = tokenService.getLocalAccessToken();

export default function DashboardOwner() {

    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const plan = useFetchData("/api/v1/plan", jwt, setMessage, setVisible).plan;
    const [showStats, setShowStats] = useState(false);

    function getFunctions() {
        if (plan === "BASIC") {
            return (
                <h4 className="text-center">This is only for GOLD or PLATINUM users. Upgrade your <Link to={"/plan"}>plan</Link> if you want to use it.</h4>
            )
        } else if (plan === "GOLD") {
            return (
                <CalendarOwner />
            )
        } else {
            return <div>
                <ButtonGroup>
                    <Button aria-label={`show-calendar`} outline color="dark"
                        onClick={() => setShowStats(false)}>
                        Calendar
                    </Button>
                    <Button aria-label={`show-stats`} outline color="dark"
                        onClick={() => setShowStats(true)}>
                        Stats
                    </Button>
                </ButtonGroup>
                {showStats ? <></> : <CalendarOwner />}
            </div>
            // Stats
        }
    }

    const modal = getErrorModal(setVisible, visible, message);

    return (
        <Container>
            <h2 className="text-center" style={{ marginTop: "15px" }}>Dashboard</h2>
            {modal}
            {getFunctions()}
        </Container>
    )

}