import React, { useState } from "react";
import axios from "axios";
import { Link,useNavigate  } from "react-router-dom";

import NavigationBar from "./NavigationBar";
import styles from "./styles/login.module.css";
import RegisterSuccessModal from "./RegisterSuccessModal";

const Register = () => {

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // validation on user input
    let formData = {
      fullname: fullname,
      username: username,
      email: email,
      password: password,
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8800/register",
        formData
      );
  
      if (response.data.message === "User registered successfully") {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/login');
        }, 3000); // 5000 milliseconds = 5 seconds
      } else {
        // Handle registration failure
        console.log("Registration failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <main>
        <NavigationBar />
        <div className={styles.loginbackground}>
          <div className={styles.RegisterContainer}>
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
                  Create your account
                </h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="text-muted">Full name</label>
                        <input
                          type="text"
                          className={`form-control ${styles.loginInput}`}
                          placeholder="Full name"
                          onChange={(e) => setFullname(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-muted">Email</label>
                        <input
                          type="text"
                          className={`form-control ${styles.loginInput}`}
                          placeholder="Email"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="text-muted">Username</label>
                        <input
                          type="text"
                          className={`form-control ${styles.loginInput}`}
                          id="username"
                          placeholder="Username"
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-muted">Password</label>
                        <input
                          type="password"
                          className={`form-control ${styles.loginInput}`}
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-dark btn-block w-100 mt-2 ${styles.loginButton}`}
                  >
                    Register now
                  </button>

                  <dic className="row justify-content-center text-center mt-3">
                    <p className="text-muted">
                      Already have an account?
                      <Link to="/login"> Login Here</Link>
                    </p>
                  </dic>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <RegisterSuccessModal show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
};

export default Register;
