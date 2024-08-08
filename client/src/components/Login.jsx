import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import NavigationBar from "./NavigationBar";
import styles from "./styles/login.module.css";
import SuccessModal from "./SuccessModal"; // Adjust the path as necessary
import DeniedModal from "./DeniedModal"; // Adjust the path as necessary

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showDeniedModal, setDeniedModal] = useState(false);

  // sending to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation on user input
    let formData = {
      username: username,
      password: password,
    };

    axios.defaults.withCredentials = true;
    try {
      const response = await axios.post(
        "http://localhost:8800/verifysignin",
        formData
      );

      if (response.data.success) {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate("/home");
        }, 2000); // 5000 milliseconds = 5 seconds
        // console.log("success");
      } else {
        setDeniedModal(true);
        setTimeout(() => {
          navigate("/login");
        }, 50); // Hide the modal after 3 seconds
        // console.log("X success");
      }
    } catch (validationError) {
      console.log(validationError);
    }
  };

  return (
    <>
      <main>
        <NavigationBar />
        <div className={styles.loginbackground}>
          <div className={styles.loginContainer}>
            <div className={`card ${styles.cardcontainer}`}>
              <div className="card-body">
                <div className="row justify-content-center">
                  <img
                    src={"./Houselens_Logo_Dark.svg"}
                    alt="Houselens Logo"
                    width="250"
                    height="55"
                    className="d-inline-block align-top"
                  />
                </div>

                <h4 className="card-title text-center mt-3 mb-3">
                  Sign In Here
                </h4>
                <p className="text-center text-muted">
                  Sign in or register to get the most out of your Houselens
                  experience.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      className={`form-control ${styles.loginInput}`}
                      id="username"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className={`form-control ${styles.loginInput}`}
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`btn btn-dark btn-block w-100 mt-2 ${styles.loginButton}`}
                  >
                    Sign In
                  </button>

                  <div className="row justify-content-center text-center mt-3">
                    <p className="text-muted">
                      Dont have an account?{" "}
                      <Link to="/register">Register Here</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SuccessModal show={showModal} handleClose={() => setShowModal(false)} />
      <DeniedModal
        show={showDeniedModal}
        handleClose={() => setDeniedModal(false)}
      />
    </>
  );
};

export default Login;
