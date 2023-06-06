import { useState } from "react";
import tokenService from "../../services/token.service";
import useFetchData from "../../util/useFetchData";
import { Button, ButtonGroup, Container, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Link } from "react-router-dom";
import useErrorModal from "../../util/useErrorModal";
import StatsOwner from "./StatsOwner";
import CalendarAuth from "../../components/CalendarAuth";

const jwt = tokenService.getLocalAccessToken();

export default function DashboardOwner() {

    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const plan = useFetchData("/api/v1/plan", jwt, setMessage, setVisible).plan;
    const [showStats, setShowStats] = useState(false);

    function getFunctions(plan) {
        if (plan === "GOLD") {
            return (
                <CalendarAuth auth={"OWNER"} />
            )
        } else if (plan === "PLATINUM") {
            return <div>
                <ButtonGroup>
                    <Button aria-label={`show-calendar`} outline color="dark" className="dashboard-button"
                        onClick={() => setShowStats(false)} active={!showStats}>
                        Calendar
                    </Button>
                    <Button aria-label={`show-stats`} outline color="dark" className="dashboard-button"
                        onClick={() => setShowStats(true)} active={showStats}>
                        Stats
                    </Button>
                </ButtonGroup>
                {showStats ? <StatsOwner /> : <CalendarAuth auth={"OWNER"} />}
            </div>
        } else {
            return (
                <>
                    <ButtonGroup>
                        <Button aria-label={`show-calendar`} outline color="dark" className="dashboard-button"
                            active={true}>
                            Calendar
                        </Button>
                        <Button aria-label={`show-stats`} outline color="dark" className="dashboard-button">
                            Stats
                        </Button>
                    </ButtonGroup>
                    <CalendarAuth auth={"OWNER"} />
                    <Modal contentClassName="basic-dashboard" isOpen={true} keyboard={false} fade={false} centered >
                        <ModalHeader >Alert!</ModalHeader>
                        <ModalBody>
                            This is only for GOLD or PLATINUM users. Upgrade your <Link to={"/plan"}>plan</Link> if you want to use it.
                        </ModalBody>
                        <ModalFooter>
                            <Button className="extra-button" tag={Link} to={`/plan`}>Check Plan</Button>
                        </ModalFooter>
                    </Modal>
                </>

            )
        }
    }

    const modal = useErrorModal(setVisible, visible, message);

    getFunctions();

    return (
        < Container fluid style={{ marginTop: "20px" }}>
            <h2 className="text-center" style={{ marginTop: "15px" }}>Dashboard</h2>
            {modal}
            {getFunctions(plan)}
        </Container >
    )

}