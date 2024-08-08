import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import "./styles/main.css";
import { Link } from "react-router-dom";

// chatbot
import Chatbot from "react-chatbot-kit";
import { ConditionallyRender } from "react-util-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import config from "./config";
import "./styles/chatbot.css";
import styles from "./styles/Chatbot.module.css";

const Pricing = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [sessionID, setSessionID] = useState();
  const [showChatbot, toggleChatbot] = useState(false);


  // Make sure to replace with your own publishable key
  const stripePromise = loadStripe(
    "pk_test_51Pbya8RoC4Hvexv4fIP375oR6MYZwpOEWwk6Lh0FyirZ15d0l1ZhR6fO3rQFOt0uibIlbq6AlfgoLF2GZlR8uCEI00CQ5LfkX5"
  );

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8800/session", { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          setSessionID(res.data.username);
          console.log(res.data.username);
        } else {
          console.log("Invalid session");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleClick = async () => {
    try {
      // Ensure sessionID is properly set
      // const sessionID = 'your-session-id-here'; // Replace with actual session ID logic

      const response = await fetch(
        "http://localhost:8800/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionID }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Get error response data
        throw new Error(
          `Failed to create checkout session: ${errorData.error}`
        );
      }

      const { id: sessionId } = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error("Stripe Checkout error:", error);
        }
      } else {
        console.error("Stripe.js has not loaded yet.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div>
        <NavigationBar />
        <div className="container">
          <div className="row-md-12">
            <main style={{ marginTop: navbarHeight }}>
              <div className="row mb-2 text-center p-5">
                <div className="col-lg-12 mb-4 mt-5">
                  <h2>
                    <b>Pricing plans</b>
                  </h2>
                  <hr />
                  <p>Our pricing is simple with no hidden charge</p>
                </div>
                <div className="col-md-4">
                  <div className="card mb-4 rounded-3 shadow-sm pricing-card">
                    <div className="card-header py-3">
                      <h4 className="my-0 fw-normal">Free tier</h4>
                    </div>
                    <div className="card-body">
                      <h1 className="card-title pricing-card-title">
                        RM 0.0<small className="text-muted fw-light">/mo</small>
                      </h1>
                      <ul className="list-unstyled mt-3 mb-4">
                        <li>✓ Prediction Feature</li>
                        <li>X Forecasting feature</li>
                        <li>X Housing recommendations</li>
                        <li>X Mortgage Calculator</li>
                      </ul>
                      <button
                        className="btn btn-primary"
                      >
                        <Link
                          to="/register"
                          style={{ color: "white", textDecoration: "none" }}
                        >
                          Register now
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card mb-4 rounded-3 shadow-sm border-primary pricing-card">
                    <div className="card-header py-3 text-white bg-primary">
                      <h4 className="my-0 fw-normal">Pro tier</h4>
                    </div>
                    <div className="card-body">
                      <h1 className="card-title pricing-card-title">
                        RM 19.90
                        <small className="text-muted fw-light">/mo</small>
                      </h1>
                      <ul className="list-unstyled mt-3 mb-4">
                        <li>✓ Prediction Feature</li>
                        <li>✓ Forecasting feature</li>
                        <li>✓ Housing recommendations</li>
                        <li>✓ Mortgage Calculator</li>
                      </ul>
                      {/* Ensure stripe-buy-button is installed and used correctly */}
                      <button
                        className="btn btn-primary"
                        role="link"
                        onClick={handleClick}
                      >
                        Subscribe Now
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 ">
                  <div className="card mb-4 rounded-3 shadow-sm pricing-card">
                    <div className="card-header py-3 ">
                      <h4 className="my-0 fw-normal">Premium tier</h4>
                    </div>
                    <div className="card-body">
                      <h1 className="card-title pricing-card-title">
                        <small className="text-muted fw-light">
                          Coming soon
                        </small>
                      </h1>
                      <ul className="list-unstyled mt-3 mb-4">
                        <li>✓ All features from pro tier</li>
                        <li>✓ Real-time data feeds</li>
                        <li>✓ Detailed market analysis reports</li>
                        <li>✓ Access to HouseLens APIs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        <div className="container">
          <div className="col-md-12 mb-4 text-center">
            <h2>
              <b>Compare plans</b>
            </h2>
            <hr />
            <p>
              See and Compare our pricing plan to find the best one matching
              your need
            </p>
          </div>
          <div className="row-md-12">
            <div className="table-responsive">
              <table className="table text-center table-bordered">
                <thead>
                  <tr>
                    <th style={{ width: "34%" }}></th>
                    <th style={{ width: "22%" }}>Free tier</th>
                    <th style={{ width: "22%" }}>Pro tier</th>
                    <th style={{ width: "22%" }}>Premium tier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className="text-start">
                      Prediction
                    </th>
                    <td>✓</td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <th scope="row" className="text-start">
                      Forecasting
                    </th>
                    <td></td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <th scope="row" className="text-start">
                      Recommendations
                    </th>
                    <td></td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <th scope="row" className="text-start">
                      Mortgage calculator
                    </th>
                    <td></td>
                    <td>✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <th scope="row" className="text-start">
                      Real-time data feeds
                    </th>
                    <td></td>
                    <td></td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <th scope="row" className="text-start">
                      Detailed market analysis reports
                    </th>
                    <td></td>
                    <td></td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <th scope="row" className="text-start">
                      Access to HouseLens APIs
                    </th>
                    <td></td>
                    <td></td>
                    <td>✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ConditionallyRender
        ifTrue={showChatbot}
        show={
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        }
      />
      <button
        className={styles.appChatbotButton}
        onClick={() => toggleChatbot((prev) => !prev)}
      >
        <img
          src="./chatboticon.svg"
          alt="Chatbot Icon"
          className={styles.appChatbotButtonIcon}
        />
      </button>
    </>
  );
};

export default Pricing;
