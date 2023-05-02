import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function getErrorModal({ handleVisible }, visible = false, message = null) {
    if (message) {
        const closeBtn = (
            <button className="close" onClick={handleVisible} type="button">
                &times;
            </button>
        );
        return (
            <div>
                <Modal isOpen={visible} toggle={handleVisible}
                    keyboard={false}>
                    <ModalHeader toggle={handleVisible} close={closeBtn}>Alert!</ModalHeader>
                    <ModalBody>
                        {message}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleVisible}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    } else
        return <></>;
}