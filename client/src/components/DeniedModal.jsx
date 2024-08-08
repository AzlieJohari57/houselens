import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeniedModal = ({ show, handleClose }) => {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body className="text-center">
          <img
            src={"./XTick.svg"}
            alt="Houselens Logo"
            width="120"
            height="35"
            className="d-inline-block align-top"
          />
          <h3 className="mt-2">Opps!</h3>
          <p>Login unsuccessful, try again</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose} className="w-100">
            Try again
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeniedModal;
