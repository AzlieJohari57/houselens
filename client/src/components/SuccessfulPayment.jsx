import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SuccessfulPayment = () => {
  const handleLogout = async () => {
    try {
      // Call the endpoint to end the session
      await axios.post("/logout");
      // No need to use history.push; Link will handle the redirect
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className="row justify-content-center align-items-center min-vh-100"
      style={{ textAlign: "center" }}
    >
      <div className="col-12 col-md-6">
        <img
          src="successpayment.gif" // Replace with your image path
          alt="Successful Payment"
          style={{ width: "100%", maxWidth: "180px", marginBottom: "10px" }}
        />
        <h3 style={{ marginBottom: "20px" }}>Successful Payment</h3>
        <p style={{ marginBottom: "20px" }}>
          Login again to your account to gain access to your premium feature!
        </p>
        <button
          className="btn btn-success"
          style={{ fontWeight: "bold" }}
          onClick={handleLogout}
        >
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            Return to Login
          </Link>
        </button>
      </div>
    </div>
  );
};

export default SuccessfulPayment;
