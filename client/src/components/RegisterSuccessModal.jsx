import React from "react";
import { Modal, Button } from "react-bootstrap";

const RegisterSuccessModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Body className="text-center">
          <img
            src={"./register_success.gif"}
            alt="Houselens Logo"
            width="200"
            height="200"
            className="d-inline-block align-top"
          />
          <h3 className="mt-2">Registration Successful!</h3>
          <p>Welcome to Houselens, Empowering your intelligent Real Estate investment</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose} className="w-100">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default RegisterSuccessModal