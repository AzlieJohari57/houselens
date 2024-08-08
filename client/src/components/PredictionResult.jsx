import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import stylesx from "./styles/Main.module.css";
import { Link } from "react-router-dom";
import HouseItem from "./HouseItem";
import axios from "axios";

// chatbot start
import Chatbot from "react-chatbot-kit";
import { ConditionallyRender } from "react-util-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import config from "./config";
import "./styles/chatbot.css";
import styles from "./styles/Chatbot.module.css";
// chatbot end

const PredictionResult = () => {
  const [HouseItems, setHouseItems] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  // States for form data and predicted price
  const [formData, setFormData] = useState({});
  const [predictedPrice, setPredictedPrice] = useState("");

  useEffect(() => {
    const fetchAllItem = async () => {
      try {
        // Set navbar height
        const navbar = document.querySelector("nav");
        setNavbarHeight(navbar.offsetHeight);
  
        // Retrieve form data and predicted price from sessionStorage
        const storedFormData = JSON.parse(sessionStorage.getItem("formData")) || {};
        const storedPredictedPrice = sessionStorage.getItem("predictedPrice");
  
        // Set form data and predicted price states
        setFormData(storedFormData);
        if (storedPredictedPrice) {
          setPredictedPrice(storedPredictedPrice);
          setPropertyValue(storedPredictedPrice); // Set default value for propertyValue
        }
  
        // Fetch data if predictedPrice is available
        if (storedPredictedPrice) {
          const minPrice = storedPredictedPrice * 0; // 100% below the predicted price
          const maxPrice = storedPredictedPrice * 1.2; // 20% above the predicted price
  
          // Extract House_Location from formData
          const { Location } = storedFormData;
  
          // Prepare the payload
          const payload = {
            minPrice,
            maxPrice,
            Location, // Ensure House_Location is included if present
          };
          
          // Log the p  ayload to ensure it's correct
          console.log("Payload:", payload);
  
          const res = await axios.post("http://localhost:8800/houselist", payload);
          console.log("Data returned:", res);
  
          const data = Array.isArray(res.data) ? res.data : []; // Ensure it's an array
          setHouseItems(data);
        }
      } catch (err) {
        console.error("Error fetching house items:", err);
        setHouseItems([]); // Ensure HouseItems is an array
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
  
    // Call fetchAllItem on component mount
    fetchAllItem();
  }, []); // Empty dependency array ensures this runs only on component mount

  const [showChatbot, toggleChatbot] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Form states
  const [propertyValue, setPropertyValue] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [monthlyRepayment, setMonthlyRepayment] = useState("");

  const handleToggleChatbot = () => {
    toggleChatbot((prev) => !prev);
  };

  

  // Calculation function
  const calculateMortgage = () => {
    const P = parseFloat(propertyValue) || 0;
    const D = parseFloat(downPayment) || 0;
    const L = parseFloat(loanPeriod) || 0;
    const R = parseFloat(interestRate) || 0;

    if (P > 0 && D > 0 && L > 0 && R > 0) {
      const principal = P - P * (D / 100);
      const monthlyInterestRate = R / 100 / 12;
      const numberOfPayments = L * 12;

      const numerator =
        principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments);
      const denominator =
        Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
      const repayment = numerator / denominator;

      setMonthlyRepayment(repayment.toFixed(2));
    } else {
      setMonthlyRepayment("Please enter valid numbers");
    }
  };

  const [Freemium, setFreemium] = useState("");
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/session", { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          console.log(res.data.username);
          setFreemium(res.data.freemium === "Premium" ? "Premium" : "Free");
        } else {
          console.log("Invalid session");
        }
      })
      .catch((err) => console.error("Error fetching session:", err));
  }, []);

  return (
    <>
      <NavigationBar />

      <ConditionallyRender
        ifTrue={showChatbot}
        show={
          <div className={styles.chatbotContainer}>
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </div>
        }
      />
      <button className={styles.appChatbotButton} onClick={handleToggleChatbot}>
        <img
          src="./chatboticon.svg"
          alt="Chatbot Icon"
          className={styles.appChatbotButtonIcon}
        />
      </button>

      <main style={{ marginTop: navbarHeight, backgroundColor: "#F8F9FA" }}>
        <div className="container py-4">
          <div className="row align-items-md-stretch">
            <div className="col-md-7">
              <div className="h-100 p-5 bg-dark rounded-3 text-white">
                <h6>Your Real Estate</h6>
                <h3>
                  Total Cost Prediction
                  <img
                    src="./RM_icon.svg"
                    alt="Cost Icon"
                    style={{
                      width: "34px",
                      height: "34px",
                      marginLeft: "10px",
                    }}
                  />
                </h3>
                <hr className={stylesx.hrStyle2} />

                <Row className={"mt-3 mb-3"}>
                  <Col md={12}>
                    <div className="form-control">
                      <b>RM {predictedPrice}</b>
                    </div>
                  </Col>
                </Row>

                <Row className={"mt-2"}>
                  <Col md={6}>
                    <img
                      src="./Location_icon.svg"
                      alt="Cost Icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        margin: "5px",
                      }}
                    />
                    Location: {formData.Location}
                  </Col>
                  <Col md={6}>
                    <img
                      src="./Sqft_icon.svg"
                      alt="Cost Icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        margin: "5px",
                      }}
                    />
                    Square Footage: {formData.Sqft}
                  </Col>
                </Row>

                <Row className={"mt-2"}>
                  <Col md={6}>
                    <img
                      src="./Rooms_icon.svg"
                      alt="Cost Icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        margin: "5px",
                      }}
                    />
                    Rooms: {formData.Rooms}
                  </Col>
                  <Col md={6}>
                    <img
                      src="./Bathroom_icon.svg"
                      alt="Cost Icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        margin: "5px",
                      }}
                    />
                    Bathrooms: {formData.Bathrooms}
                  </Col>
                </Row>
                <Row className={"mt-2"}>
                  <Col md={6}>
                    <img
                      src="./Furnished_icon.svg"
                      alt="Cost Icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        margin: "5px",
                      }}
                    />
                    Furnished: {formData.Furnishing}
                  </Col>
                  <Col md={6}>
                    <img
                      src="./Buildup_icon.svg"
                      alt="Cost Icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        margin: "5px",
                      }}
                    />
                    Build Type: {formData["Build Type"]}
                  </Col>
                </Row>
                <Row className={"mt-2"}>
                  <Col md={6}>
                    <img
                      src="./CarParks_icon.svg"
                      alt="Cost Icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        margin: "5px",
                      }}
                    />
                    Car Parks: {formData["Car Parks"]}
                  </Col>
                  <Col md={6}>
                    <img
                      src="./landed_icon.svg"
                      alt="Cost Icon"
                      style={{
                        width: "25px",
                        height: "25px",
                        margin: "5px",
                      }}
                    />
                    Property Type: {formData["Property Type"]}
                  </Col>
                </Row>
              </div>
            </div>

            <div className="col-md-5 d-flex">
              <img
                src="./scematic.svg"
                alt="Home Background"
                className="img-fluid w-100 align-self-center"
              />
            </div>

            {/* ================================================ */}

            <div>
              {Freemium === "Free" ? (
                <div className="container">
                  <div className="row justify-content-center align-items-center min-vh-100">
                    <div className="col-lg-12 text-center">
                      <img
                        src="./premiumlogo.svg"
                        alt="Description"
                        style={{ width: "200px" }} // Customize width and height here
                        className="mb-3"
                      />{" "}
                      <p>Subscribe to gain access to premium housing recommendation features</p>
                      <Link to="/pricing">
                        <button className="btn btn-primary">
                          Subscribe Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : Freemium === "Premium" ? (
                <main className="container mt-4">
                  <div className="row mb-2">
                    <div className="col-lg-12">
                      <div
                        className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative"
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        <div className="col p-4 d-flex flex-column position-static">
                          <strong className="d-inline-block">Discover</strong>
                          <h3 className="mb-0">
                          Real Estate Recommendations in Kuala Lumpur
                          </h3>
                          <h6 className="mt-2 text-muted">
                            Scroll down below to see property recommendations
                            with similar pricing to your Real Estate total cost
                            estimation
                            <img
                              src="./down_icon.svg"
                              alt="Cost Icon"
                              style={{
                                width: "15px",
                                height: "15px",
                                marginLeft: "10px",
                              }}
                            />
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-5">
                    <div className="col-lg-8">
                      {HouseItems.map((item, index) => (
                        <HouseItem key={index} item={item} loading={loading} />
                      ))}
                    </div>

                    <div className="col-lg-4">
                      <div className="position-sticky" style={{ top: "5em" }}>
                        <div
                          className="p-4 mb-3 bg-white g-0 border rounded"
                          style={{ borderColor: "#6A0DAD", borderWidth: "2px" }}
                        >
                          <h4>
                            <b>Mortgage Calculator</b>
                          </h4>
                          <hr />
                          <form>
                            <div className="mb-3">
                              <label className="mb-1 text-muted">
                                Property value (RM)
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="propertyValue"
                                value={propertyValue}
                                onChange={(e) =>
                                  setPropertyValue(e.target.value)
                                }
                              />
                            </div>
                            <div className="mb-3">
                              <label className="mb-1 text-muted">
                                Down payment (%)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Down payment (%)"
                                value={downPayment}
                                onChange={(e) => setDownPayment(e.target.value)}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="mb-1 text-muted">
                                Loan Period (Years)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Loan period"
                                value={loanPeriod}
                                onChange={(e) => setLoanPeriod(e.target.value)}
                              />
                            </div>

                            <div className="mb-3">
                              <label className="mb-1 text-muted">
                                Interest Rate
                              </label>
                              <select
                                className="form-select"
                                aria-label="Interest Rate"
                                value={interestRate}
                                onChange={(e) =>
                                  setInterestRate(e.target.value)
                                }
                              >
                                <option value="">Interest Rate</option>
                                <option value="3.9">Bank Islam: 3.9%</option>
                                <option value="2.8">Maybank Islamic houzKEY: 2.8%</option>
                                <option value="3.8">Bank of China: 3.8%</option>
                                <option value="4.3">HSBC HomeSmart: 4.3%</option>
                                <option value="4.1">Standard Chartered: 4.1%</option>
                                {/* Add other interest rates as needed */}
                              </select>
                            </div>
                            <button
                              type="button"
                              className="btn btn-dark w-100"
                              onClick={calculateMortgage}
                            >
                              Calculate Mortgage
                            </button>
                          </form>
                          <div className="mt-3">
                            <h5>
                              <b>Result</b>
                            </h5>
                            <div className="p-2 bg-light border rounded">
                              <p className="mb-0">
                                Monthly Repayment: RM {monthlyRepayment}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PredictionResult;
