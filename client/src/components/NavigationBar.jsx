import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./ConfirmLogoutModal";


import styles from "./styles/Navbar.module.css"; // Correct import statement

const NavigationBar = () => {
  const [showModal, setShowModal] = useState(false);
  const outputLogout = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const [signIn, setsignIn] = useState(false);
  const [navbarBg, setNavbarBg] = useState(styles.bgTransparent);
  const navigate = useNavigate();

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setNavbarBg(styles.bgWhite);
    } else {
      setNavbarBg(styles.bgTransparent);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/session", { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          setsignIn(true);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8800/logout", {}, { withCredentials: true });
      if (response.data.success) {
        console.log(response.data.message);
        setShowModal(true);
        setsignIn(false);
        navigate("/login"); // Redirect to login page after logout
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <Navbar
      className={`${styles.navbarCustom} ${navbarBg}`}
      collapseOnSelect
      expand="lg"
      fixed="top"
    >
      <Container>
        <Navbar.Brand href="/home">
          <img
            src={"./Houselens_Logo_Dark.svg"}
            alt="Houselens Logo"
            width="120"
            height="35"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/forecasting">Forecast</Nav.Link>
            <Nav.Link href="/prediction">Estimate</Nav.Link>
            <Nav.Link href="/pricing">Pricing</Nav.Link>
            {signIn ? (
              <Dropdown>
                <Dropdown.Toggle as={Nav.Link} id="dropdown-signin">
                  Account
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                  <Dropdown.Item onClick={outputLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link href="/login">Sign in</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleLogout}
      />
    </Navbar>
  );
};

export default NavigationBar;
