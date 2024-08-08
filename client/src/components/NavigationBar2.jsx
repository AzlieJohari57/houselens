// File: src/components/NavigationBar2.js
import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import styles from "./styles/Navbar.module.css";

const NavigationBar2 = () => {

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

  return (
    <Navbar className={`${styles.navbarCustom2}`} collapseOnSelect expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="home">
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
            <Dropdown>
              <Dropdown.Toggle as={Nav.Link} id="dropdown-signin">
                Signin
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                <Dropdown.Item href="/logout">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar2;
