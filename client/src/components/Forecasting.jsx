import React, { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "./NavigationBar";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import stylesx from "./styles/Main.module.css";
import { Link } from "react-router-dom";

import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Pie, Line } from "react-chartjs-2";
import ForecastData from "../data/ForecastData.json";
import AvgAreaPrice from "../data/AvgAreaPrice.json";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

// chatbot
import Chatbot from "react-chatbot-kit";
import { ConditionallyRender } from "react-util-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import config from "./config";
import "./styles/chatbot.css";
import styles from "./styles/Chatbot.module.css";

const Forecasting = () => {
  const [Freemium, setFreemium] = useState("");
  const [showChatbot, toggleChatbot] = useState(false);

  const [navbarHeight, setNavbarHeight] = useState(0);
  useEffect(() => {
    const navbar = document.querySelector("nav");
    setNavbarHeight(navbar.offsetHeight);
  }, []);

  // FORECAST

  const [formData, setFormData] = useState({
    mortgageInterest: "",
    vacancyRate: "",
    cpi: "",
    medianSalesPrice: "",
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to Node.js endpoint
      const response = await axios.post("http://localhost:8800/forecast", {
        mortgageInterest: parseFloat(formData.mortgageInterest),
        vacancyRate: parseFloat(formData.vacancyRate),
        cpi: parseFloat(formData.cpi),
        medianSalesPrice: parseFloat(formData.medianSalesPrice),
      });

      // Assuming the forecasted price is a number, format it to two decimal places
      const formattedPrediction = {
        ...response.data,
        forecast_median_house_price: parseFloat(
          response.data.forecast_median_house_price
        ).toFixed(2),
      };

      setPrediction(formattedPrediction);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //GOOGLE MAP
  const GOOGLE_MAP_API_KEY = "AIzaSyBY5pBWae1wstMkNuYOB0RJ9jjxEpzkxd0";
  const MAP_ID = "b5b304925e5f4303";
  const KLCC = { lat: 3.140853, lng: 101.693207 };
  const MontKiara = { lat: 3.1685, lng: 101.6512 };
  const Dutamas = { lat: 3.178, lng: 101.661 };
  const BukitJalil = { lat: 3.0583, lng: 101.6904 };
  const Cheras = { lat: 3.1068, lng: 101.7259 };
  const Setapak = { lat: 3.1864, lng: 101.7059 };
  const Klang = { lat: 3.0439, lng: 101.4462 };
  const Bangsar = { lat: 3.129, lng: 101.6798 };
  const Ampang = { lat: 3.1314, lng: 101.7626 };
  const Setiawangsa = { lat: 3.183, lng: 101.7462 };

  const handleMarkerClick = (location) => {
    setOpenInfoWindow(location);
  };

  const [openInfoWindow, setOpenInfoWindow] = useState(null);

  const [open, setOpen] = useState(false);

  //=============================

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
      <main style={{ marginTop: navbarHeight, backgroundColor: "#F8F9FA" }}>
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
                  <p>Subscribe to gain access to premium features</p>
                  <Link to="/pricing">
                    <button className="btn btn-primary">Subscribe Now</button>
                  </Link>
                </div>
              </div>
            </div>
          ) : Freemium === "Premium" ? (
            <div>
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div
                      className="p-4 p-1 border mb-3 mt-3  rounded  shadow-sm"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <h5 className="mb-2">
                        <b>Median Real Estate Price Forecast In Kuala Lumpur</b>
                      </h5>
                      <p className="text-muted">
                        The data currently spans from March 2014 to March 2024.
                        Enter current real estate trends and economic indicator
                        data to forecast the median real estate price for the
                        next quarter in Kuala Lumpur. Click{" "}
                        <a target="__blank" href="https://www.brickz.my/transactions/residential/">
                          here
                        </a>{" "}
                        to explore housing trend data or{" "}
                        <a target="__blank" href="https://tradingeconomics.com/malaysia/consumer-price-index-cpi">
                          here
                        </a>{" "}
                        to view CPI rate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col-lg-4">
                    <div
                      className="p-3 bg-white border rounded"
                      style={{ borderColor: "#6A0DAD", borderWidth: "2px" }}
                    >
                      <h6 className="m-0 p-0">
                        <b>Real Estate Trend</b>
                      </h6>
                      <hr />
                      <small className="text-muted m-0 p-0">
                        Current Avg. RM 1,413,602
                      </small>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <input
                            type="number"
                            name="medianSalesPrice"
                            value={formData.medianSalesPrice}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Median Sales Price"
                          />
                        </div>
                        <h6>
                          <b>Economic Indicator</b>
                        </h6>
                        <hr />
                        <small className="text-muted m-0 p-0">
                          *Current Avg. 122.2
                        </small>
                        <div className="mb-3">
                          <input
                            type="number"
                            name="cpi"
                            value={formData.cpi}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="CPI"
                          />
                        </div>
                        <small className="text-muted m-0 p-0">
                          *Current Avg. 4.26
                        </small>
                        <div className="mb-3">
                          <input
                            type="number"
                            name="mortgageInterest"
                            value={formData.mortgageInterest}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Morgage Interest Rate"
                          />
                        </div>
                        <small className="text-muted ">*Current Avg. 4.6</small>
                        <div className="mb-3">
                          <input
                            type="number"
                            name="vacancyRate"
                            value={formData.vacancyRate}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Vacancy Rate"
                          />
                        </div>
                        <button type="submit" className="btn btn-dark w-100">
                          Forecast Next Quarter
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="row">
                      <div className="col-lg-12 mb-3">
                        {prediction && (
                          <div
                            className=" border rounded  shadow-sm"
                            style={{ backgroundColor: "#ffffff" }}
                          >
                            <h5 className="p-3">
                              <b>
                                Median Price Forecast Next Quarter:{" RM"}
                                {prediction.forecast_median_house_price}
                              </b>
                            </h5>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12 mb-3">
                        <div className={` p-2  ${stylesx.revenueCard}`}>
                          <Line
                            data={{
                              labels: ForecastData.map((data) => data.label),
                              datasets: [
                                {
                                  label: "Price",
                                  data: ForecastData.map((data) => data.Price),
                                  backgroundColor: "#064FF0",
                                  borderColor: "#064FF0",
                                },
                              ],
                            }}
                            options={{
                              elements: {
                                line: {
                                  tension: 0.5,
                                },
                              },
                              plugins: {
                                title: {
                                  text: "Monthly Revenue & Cost",
                                },
                              },
                              responsive: true,
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="p-4 p-1  mb-1 mt-1">
                      <h5 className="mb-2">
                        <b>Median Price Visualization from Each District</b>
                      </h5>
                      <p className="text-muted">
                        Median residential real estate price distribution in Kuala Lumpur. 
                      </p>
                      <hr />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div style={{ height: "300px", width: "100%" }}>
                      <Bar
                        data={{
                          labels: AvgAreaPrice.map((data) => data.label),
                          datasets: [
                            {
                              label: "Median Price",
                              data: AvgAreaPrice.map((data) => data.value),
                              backgroundColor: ["rgba(43, 63, 229, 0.8)"],
                              borderRadius: 5,
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            title: {
                              display: true,
                              text: "Highest Median Price by District (RM)",
                            },
                          },
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                    <hr />
                    <div style={{ height: "300px", width: "100%" }}>
                      <Pie
                        data={{
                          labels: AvgAreaPrice.map((data) => data.label),
                          datasets: [
                            {
                              label: "Count",
                              data: AvgAreaPrice.map((data) => data.value),
                              backgroundColor: [
                                "rgba(20, 43, 129, 0.9)",
                                "rgba(58, 83, 204, 0.9)",
                                "rgba(66, 103, 178, 0.9)",
                                "rgba(70, 130, 180, 0.9)",
                                "rgba(30, 144, 255, 0.9)",
                                "rgba(100, 149, 237, 0.9)",
                                "rgba(135, 206, 250, 0.9)",
                                "rgba(135, 206, 235, 0.9)",
                                "rgba(173, 216, 230, 0.9)",
                                "rgba(176, 224, 230, 0.9)",
                                // Add more colors if you have more data points
                              ],
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            title: {
                              display: true,
                              text: "Median Price Distribution by District (RM)",
                            },
                          },
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-lg-8 mb-3">
                    <div
                      className={` border rounded  shadow-sm p-2 mb-3`}
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <APIProvider apiKey={GOOGLE_MAP_API_KEY}>
                        <div style={{ height: "60vh", width: "100%" }}>
                          <Map
                            defaultZoom={11}
                            defaultCenter={KLCC}
                            mapId={MAP_ID}
                            options={{
                              draggable: true,
                              gestureHandling: "auto",
                              disableDoubleClickZoom: false,
                              scrollwheel: true,
                              streetViewControl: false,
                            }}
                          >
                            <AdvancedMarker
                              position={KLCC}
                              onClick={() => handleMarkerClick("KLCC")}
                            >
                              <Pin
                                background={"white"}
                                borderColor={"black"}
                                glyphColor={"blue"}
                              />
                            </AdvancedMarker>

                            <AdvancedMarker
                              position={MontKiara}
                              onClick={() => handleMarkerClick("MontKiara")}
                            >
                              <Pin
                                background={"white"}
                                borderColor={"black"}
                                glyphColor={"blue"}
                              />
                            </AdvancedMarker>

                            <AdvancedMarker
                              position={Dutamas}
                              onClick={() => handleMarkerClick("Dutamas")}
                            >
                              <Pin
                                background={"white"}
                                borderColor={"black"}
                                glyphColor={"blue"}
                              />
                            </AdvancedMarker>

                            <AdvancedMarker
                              position={BukitJalil}
                              onClick={() => handleMarkerClick("Bukit Jalil")}
                            >
                              <Pin
                                background={"white"}
                                borderColor={"black"}
                                glyphColor={"blue"}
                              />
                            </AdvancedMarker>

                            <AdvancedMarker
                              position={Setapak}
                              onClick={() => handleMarkerClick("Setapak")}
                            >
                              <Pin
                                background={"white"}
                                borderColor={"black"}
                                glyphColor={"blue"}
                              />
                            </AdvancedMarker>

                            <AdvancedMarker
                              position={Cheras}
                              onClick={() => handleMarkerClick("Cheras")}
                            >
                              <Pin
                                background={"white"}
                                borderColor={"black"}
                                glyphColor={"blue"}
                              />
                            </AdvancedMarker>

                            <AdvancedMarker
                              position={Klang}
                              onClick={() => handleMarkerClick("Klang")}
                            >
                              <Pin
                                background={"white"}
                                borderColor={"black"}
                                glyphColor={"blue"}
                              />
                            </AdvancedMarker>

                            <AdvancedMarker
                              position={Bangsar}
                              onClick={() => handleMarkerClick("Bangsar")}
                            >
                              <Pin
                                background={"white"}
                                borderColor={"black"}
                                glyphColor={"blue"}
                              />
                            </AdvancedMarker>

                            <AdvancedMarker
                              position={Ampang}
                              onClick={() => handleMarkerClick("Ampang")}
                            >
                              <Pin
                                background={"white"}
                                borderColor={"black"}
                                glyphColor={"blue"}
                              />
                            </AdvancedMarker>

                            <AdvancedMarker
                              position={Setiawangsa}
                              onClick={() => handleMarkerClick("Setiawangsa")}
                            >
                              <Pin
                                background={"white"}
                                borderColor={"black"}
                                glyphColor={"blue"}
                              />
                            </AdvancedMarker>

                           

                            {openInfoWindow === "KLCC" && (
                              <InfoWindow
                                position={KLCC}
                                onCloseClick={() => setOpenInfoWindow(null)}
                              >
                                <h5>
                                  <b>Kuala Lumpur City Center (KLCC)</b>
                                </h5>
                                <p>Average Price: RM 2,282,345</p>
                              </InfoWindow>
                            )}

                            {openInfoWindow === "MontKiara" && (
                              <InfoWindow
                                position={MontKiara}
                                onCloseClick={() => setOpenInfoWindow(null)}
                              >
                                <h5>
                                  <b>Mont Kiara</b>
                                </h5>
                                <p>Average Price: RM 1,874,720</p>
                              </InfoWindow>
                            )}

                            {openInfoWindow === "Dutamas" && (
                              <InfoWindow
                                position={Dutamas}
                                onCloseClick={() => setOpenInfoWindow(null)}
                              >
                                <h5>
                                  <b>Dutamas</b>
                                </h5>
                                <p>Average Price: RM 1,200,094</p>
                              </InfoWindow>
                            )}

                            {openInfoWindow === "Bukit Jalil" && (
                              <InfoWindow
                                position={BukitJalil}
                                onCloseClick={() => setOpenInfoWindow(null)}
                              >
                                <h5>
                                  <b>Bukit Jalil</b>
                                </h5>
                                <p>Average Price: RM 932,634</p>
                              </InfoWindow>
                            )}

                            {openInfoWindow === "Cheras" && (
                              <InfoWindow
                                position={Cheras}
                                onCloseClick={() => setOpenInfoWindow(null)}
                              >
                                <h5>
                                  <b>Cheras</b>
                                </h5>
                                <p>Average Price: RM 973,018</p>
                              </InfoWindow>
                            )}

                            {openInfoWindow === "Setapak" && (
                              <InfoWindow
                                position={Setapak}
                                onCloseClick={() => setOpenInfoWindow(null)}
                              >
                                <h5>
                                  <b>Setapak</b>
                                </h5>
                                <p>Average Price: RM 996,015</p>
                              </InfoWindow>
                            )}

                            {openInfoWindow === "Klang" && (
                              <InfoWindow
                                position={Klang}
                                onCloseClick={() => setOpenInfoWindow(null)}
                              >
                                <h5>
                                  <b>Klang</b>
                                </h5>
                                <p>Average Price: RM 990,000</p>
                              </InfoWindow>
                            )}

                            {openInfoWindow === "Bangsar" && (
                              <InfoWindow
                                position={Bangsar}
                                onCloseClick={() => setOpenInfoWindow(null)}
                              >
                                <h5>
                                  <b>Bangsar</b>
                                </h5>
                                <p>Average Price: RM 883,673</p>
                              </InfoWindow>
                            )}

                            {openInfoWindow === "Ampang" && (
                              <InfoWindow
                                position={Ampang}
                                onCloseClick={() => setOpenInfoWindow(null)}
                              >
                                <h5>
                                  <b>Ampang</b>
                                </h5>
                                <p>Average Price: RM 1,259,290</p>
                              </InfoWindow>
                            )}

                            {openInfoWindow === "Setiawangsa" && (
                              <InfoWindow
                                position={Setiawangsa}
                                onCloseClick={() => setOpenInfoWindow(null)}
                              >
                                <h5>
                                  <b>Setiawangsa</b>
                                </h5>
                                <p>Average Price: RM 1,013,226</p>
                              </InfoWindow>
                            )}

                          </Map>
                        </div>
                      </APIProvider>
                    </div>

                    <div
                      className={`border rounded shadow-sm p-3 mb-3 d-flex flex-column`}
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <div className="d-flex justify-content-between align-items-center ">
                        <h5>
                          <b>
                            Analysis on the Highest Median Price Distribution
                          </b>
                        </h5>
                        <a href="/prediction" className="btn btn-primary">
                          Get Prediction
                        </a>
                      </div>
                      <hr />
                      <p style={{ textAlign: "justify" }}>
                        Analysis reveals that KLCC has the highest median
                        property prices in Kuala Lumpur, exceeding RM 2,000,000,
                        with Mont Kiara and Bukit Jalil following. This
                        indicates a strong demand and premium value for
                        properties in KLCC and Mont Kiara. The see Specific
                        house price prediction click the prediction button.
                      </p>
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
        </div>
      </main>

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

export default Forecasting;
