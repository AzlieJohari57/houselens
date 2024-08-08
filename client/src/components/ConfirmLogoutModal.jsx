import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmLogoutModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to log out?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onClose}>
            No
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default ConfirmLogoutModal