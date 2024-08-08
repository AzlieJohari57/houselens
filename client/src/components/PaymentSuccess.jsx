import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentSuccess = () => {
  const [status, setStatus] = useState(null);
  const sessionID = new URLSearchParams(window.location.search).get('sessionID');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/payment-status/${sessionID}`);
        setStatus(response.data);
      } catch (error) {
        console.error("Error fetching payment status:", error);
        setStatus("Error fetching status");
      }
    };

    fetchStatus();
  }, [sessionID]);

  return (
    <div>
      {status === "Premium" ? (
        <h1>Payment Successful! You are now a Premium member.</h1>
      ) : (
        <h1>Payment Status: {status}</h1>
      )}
    </div>
  );
};

export default PaymentSuccess;
