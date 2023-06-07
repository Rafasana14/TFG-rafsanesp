import { Link } from "react-router-dom";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useMediaQuery } from "react-responsive";

function handleVisible(setVisible, visible) {
    setVisible(!visible);
}

export default function useErrorModal(setVisible, visible = false, message = null) {
    const isMobile = useMediaQuery({ query: `(max-width: 991px)` });
    if (message) {
        const closeBtn = (
            <button className="close" onClick={() => handleVisible(setVisible, visible)} type="button">
                &times;
            </button>
        );
        const cond = message.includes("limit") && window.location.pathname !== "/plan";

        return (
            <Modal isOpen={visible} toggle={() => handleVisible(setVisible, visible)}
                keyboard={false} fade={false} centered={isMobile ? true : false} >
                <ModalHeader toggle={() => handleVisible(setVisible, visible)} close={closeBtn}>Alert!</ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <ModalFooter>
                    {cond ? <Button className="extra-button" tag={Link} to={`/plan`}>Check Plan</Button> : <></>}
                    <Button className="close-button" onClick={() => handleVisible(setVisible, visible)}>Close</Button>
                </ModalFooter>
            </Modal>)
    } else
        return <></>;
}