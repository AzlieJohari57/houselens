import React from "react";
import { Modal, Button } from "react-bootstrap";

const SuccessModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body className="text-center">
        <img
          src={"./greenTick.svg"}
          alt="Houselens Logo"
          width="120"
          height="35"
          className="d-inline-block align-top"
        />
        <h3 className="mt-2">Awesome!</h3>
        <p>Login Successful, Welcome to Houselens!</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleClose} className="w-100">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;
