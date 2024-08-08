import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import stylesx from "./styles/Main.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Chatbot start
import Chatbot from "react-chatbot-kit";
import { ConditionallyRender } from "react-util-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import config from "./config";
import "./styles/chatbot.css";
import styles from "./styles/Chatbot.module.css";
// Chatbot end

const Prediction = () => {
  // CHATBOT
  const [showChatbot, toggleChatbot] = useState(false);
  const handleToggleChatbot = () => {
    toggleChatbot((prev) => !prev);
  };

  // PREDICTION
  const [formData, setFormData] = useState({
    Location: "",
    Rooms: "",
    Bathrooms: "",
    "Car Parks": "",
    "Property Type": "",
    Furnishing: "",
    "Build Type": "",
    Sqft: "",
  });

  const [predictedPrice, setPredictedPrice] = useState(null);

  // Use navigate hook for redirection
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      Location: [formData.Location],
      Rooms: [parseInt(formData.Rooms)],
      Bathrooms: [parseInt(formData.Bathrooms)],
      "Car Parks": [parseInt(formData["Car Parks"])],
      "Property Type": [formData["Property Type"]],
      Furnishing: [formData.Furnishing],
      "Build Type": [formData["Build Type"]],
      Sqft: [parseInt(formData.Sqft)],
    };

    console.log("Submitting data:", formattedData);

    // Store the form data in sessionStorage
    sessionStorage.setItem("formData", JSON.stringify(formData));

    axios
      .post("http://localhost:8800/predict", formattedData)
      .then((response) => {
        console.log("API response:", response);
        let price = response.data.predicted_price;

        // Convert price to range of millions and hundred thousands
        price = Math.round(price * 1000000);

        setPredictedPrice(price);

        // Store the predicted price in sessionStorage
        sessionStorage.setItem("predictedPrice", price);

        // Redirect to the result page
        navigate("/predictionresult");
      })
      .catch((error) => {
        console.error("Error predicting house price:", error);
      });
  };

  const [LogSession, Setsession] = useState(null);
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/session", { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          console.log(res.data.username);
          Setsession(res.data.username);
        } else {
          console.log("Invalid session");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <main>
        <NavigationBar />

        {LogSession ? (
          <div>
            <div className="row">
              <div className={stylesx.backgroundBanner}>
                <img
                  src="./predictionpage.svg"
                  alt="Home Background"
                  className={stylesx.backgroundImage}
                />
                <Container>
                  <Row className="justify-content-start">
                    <Col
                      md={6}
                      lg={4}
                      className={`${stylesx.formContainer} p-3 rounded`}
                    >
                      <div className={stylesx.iconContainer}>
                        <img
                          src="./PredictionHouseIcon.svg"
                          alt="Prediction House Icon"
                          className={stylesx.logo}
                        />
                      </div>
                      <h5 className="text-center">Price Prediction</h5>
                      <p className="text-center mb-2 muted-text">
                        Fill in the details below to get price estimation
                      </p>
                      <hr className={stylesx.hrStyle} />
                      <Form
                        className={stylesx.formText}
                        onSubmit={handleSubmit}
                      >
                        <Row>
                          <Col md={6}>
                            <Form.Group
                              controlId="formLocation"
                              className="mb-2"
                            >
                              <Form.Label>Location</Form.Label>
                              <Form.Control
                                as="select"
                                name="Location"
                                className="form-select"
                                aria-label="Location"
                                value={formData.Location}
                                onChange={handleChange}
                                required
                              >
                                <option value="" disabled>
                                  Select Location
                                </option>
                                <option value="KLCC">KLCC</option>
                                <option value="Mont Kiara">Mont Kiara</option>
                                <option value="Dutamas">Dutamas</option>
                                <option value="Bukit Jalil">Bukit Jalil</option>
                                <option value="Cheras">Cheras</option>
                                <option value="Setapak">Setapak</option>
                                <option value="Klang">Klang</option>
                                <option value="Bangsar">Bangsar</option>
                                <option value="Ampang">Ampang</option>
                                <option value="Setiawangsa">Setiawangsa</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group
                              controlId="formPropertyType"
                              className="mb-2"
                            >
                              <Form.Label>Property Type</Form.Label>
                              <Form.Control
                                as="select"
                                className="form-select"
                                aria-label="Property Type"
                                name="Property Type"
                                value={formData["Property Type"]}
                                onChange={handleChange}
                                required
                              >
                                <option value="" disabled>
                                  Select Property Type
                                </option>
                                <option value="Condominium">Condominium</option>
                                <option value="Serviced Residence">
                                  Serviced Residence
                                </option>
                                <option value="Bungalow">Bungalow</option>
                                <option value="Semi-detached House">
                                  Semi-detached House
                                </option>
                                <option value="Condominium">
                                  2-sty Terrace/Link House{" "}
                                </option>
                                <option value="Condominium">
                                  3-sty Terrace/Link House
                                </option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId="formRooms" className="mb-2">
                              <Form.Label>Number of Rooms</Form.Label>
                              <Form.Control
                                as="select"
                                className="form-select"
                                aria-label="Number of Rooms"
                                name="Rooms"
                                value={formData.Rooms}
                                onChange={handleChange}
                                required
                              >
                                <option value="" disabled>
                                  Select Number of Rooms
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5+</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group
                              controlId="formFurnishing"
                              className="mb-2"
                            >
                              <Form.Label>Furnishing</Form.Label>
                              <Form.Control
                                as="select"
                                className="form-select"
                                aria-label="Furnishing"
                                name="Furnishing"
                                value={formData.Furnishing}
                                onChange={handleChange}
                                required
                              >
                                <option value="" disabled>
                                  Select Furnishing
                                </option>
                                <option value="Fully Furnished">
                                  Fully Furnished
                                </option>
                                <option value="Partly Furnished">
                                  Partially Furnished
                                </option>
                                <option value="Unfurnished">Unfurnished</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group
                              controlId="formBathrooms"
                              className="mb-2"
                            >
                              <Form.Label>Number of Bathrooms</Form.Label>
                              <Form.Control
                                as="select"
                                className="form-select"
                                aria-label="Number of Bathrooms"
                                name="Bathrooms"
                                value={formData.Bathrooms}
                                onChange={handleChange}
                                required
                              >
                                <option value="" disabled>
                                  Select Number of Bathrooms
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5+</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group
                              controlId="formBuildType"
                              className="mb-2"
                            >
                              <Form.Label>Build Up</Form.Label>
                              <Form.Control
                                as="select"
                                className="form-select"
                                aria-label="Build Up Type"
                                name="Build Type"
                                value={formData["Build Type"]}
                                onChange={handleChange}
                                required
                              >
                                <option value="" disabled>
                                  Select Build Up Type
                                </option>
                                <option value="Built-up">Build Up</option>
                                <option value="Land area">Land Area</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group
                              controlId="formCarParks"
                              className="mb-2"
                            >
                              <Form.Label>Car Parks</Form.Label>
                              <Form.Control
                                as="select"
                                className="form-select"
                                aria-label="Number of Car Parks"
                                name="Car Parks"
                                value={formData["Car Parks"]}
                                onChange={handleChange}
                                required
                              >
                                <option value="" disabled>
                                  Select Number of Car Parks
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5+</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="formSize" className="mb-2">
                              <Form.Label>Size (Sqft)</Form.Label>
                              <Form.Control
                                type="number"
                                name="Sqft"
                                value={formData.Sqft}
                                onChange={handleChange}
                                placeholder="In square footage"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Button
                          variant="primary"
                          type="submit"
                          className="w-100 mt-2"
                        >
                          <b>Predict Price</b>
                        </Button>
                      </Form>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>

            <div className="container">
              <div className="row mt-5">
                <div className="col-lg-8">
                  <div className="p-3">
                    <h4>
                      <b>What Influence House Price?</b>
                    </h4>
                    <hr />
                    <p align="justify">
                      When predicting house prices, several factors
                      significantly influence value. The number of rooms and
                      bathrooms enhances functionality and appeal, often raising
                      prices. Location is paramount; homes in desirable
                      neighborhoods with good schools and amenities are more
                      expensive. Additionally, the square footage (sft) of a
                      home is crucial, as larger homes provide more living
                      space, attracting buyers and increasing the property's
                      market value. Together, these elements play a vital role
                      in determining house prices.
                    </p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div>
                    <img
                      src="./prediction_info_pic.svg"
                      alt="Chatbot Icon"
                      className={stylesx.predictionimg1}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div>
                    <div className="container" id="featured-3">
                      <h4 className="pb-2">
                        <b>Most Important Factors to Consider</b>
                      </h4>
                      <hr />
                      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
                        <div className="feature col">
                          <div className="feature-icon mb-3">
                            <img
                              src="./location_prediction_icon.svg"
                              alt="Chatbot Icon"
                              className={stylesx.predictionicon1}
                            />
                          </div>
                          <h5>
                            <b>Location</b>
                          </h5>
                          <hr />
                          <p align="justify" className="text-muted">
                            The location of a property influences its value due
                            to proximity to amenities, schools, and employment
                            centers. A desirable location can significantly
                            increase a property's market value and
                            attractiveness to buyers.
                          </p>
                        </div>
                        <div className="feature col">
                          <div className="feature-icon mb-3">
                            <img
                              src="./propertyzise_prediction_icon.svg"
                              alt="Chatbot Icon"
                              className={stylesx.predictionicon1}
                            />
                          </div>
                          <h5>
                            <b>Property Size</b>
                          </h5>
                          <hr />
                          <p align="justify" className="text-muted">
                            The size of a property, including the number of
                            bedrooms and overall square footage, affects its
                            value. Larger properties typically command higher
                            prices and offer more space for potential buyers.
                          </p>
                        </div>
                        <div className="feature col">
                          <div className="feature-icon mb-3">
                            <img
                              src="./markettrend_prediction_icon.svg"
                              alt="Chatbot Icon"
                              className={stylesx.predictionicon1}
                            />
                          </div>
                          <h5>
                            <b>Market Trend</b>
                          </h5>
                          <hr />
                          <p align="justify" className="text-muted">
                            Economic trends, such as employment rates and local
                            market conditions, impact property values. A strong
                            economy often leads to higher property values and
                            increased buyer demand, while economic downturns can
                            depress the market.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row justify-content-center align-items-center min-vh-100">
              <div className="col-lg-12 text-center">
                <img
                  src="./premiumlogo.svg"
                  alt="Description"
                  style={{ width: "200px" }} // Customize width and height here
                  className="mb-3"
                />{" "}
                <p>Please sign in first to use Houselens! </p>
                <Link to="/login">
                  <button className="btn btn-primary">Sign in</button>
                </Link>
              </div>
            </div>
          </div>
        )}

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
        <button
          className={styles.appChatbotButton}
          onClick={handleToggleChatbot}
        >
          <img
            src="./chatboticon.svg"
            alt="Chatbot Icon"
            className={styles.appChatbotButtonIcon}
          />
        </button>
      </main>
      {/* <Footer/> */}
    </div>
  );
};

export default Prediction;
