import React, { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import stylesx from "./styles/Main.module.css";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

// chatbot
import Chatbot from "react-chatbot-kit";
import { ConditionallyRender } from "react-util-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import config from "./config";
import "./styles/chatbot.css";
import styles from "./styles/Chatbot.module.css";

const Home = () => {
  const [showChatbot, toggleChatbot] = useState(false);
  const navigate = useNavigate();

  const [text] = useTypewriter({
    words: [
      "Data-Driven Decision",
      "Informed Investment",
      "Insightful Analysis",
    ],
    loop: 0, // Loop 0 means infinite
    typeSpeed: 200,
    delaySpeed: 450,
  });

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8800/session", { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          console.log(res.data.username);
        } else {
          console.log("Invalid session");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <NavigationBar />
      <div className={stylesx.backgroundBanner}>
        <img
          src="./home_background.svg"
          alt="Home Background"
          className={stylesx.backgroundImage}
        />
        <div className={`${stylesx.textOverlay} ${stylesx.welcomeText}`}>
          <h3>Welcome to Houselens</h3>
          <h5>AI-Driven House Price Prediction & Forecasting promoting</h5>
        </div>
        <div className={`${stylesx.textOverlay} ${stylesx.typewriterText}`}>
          <h1 style={{ fontSize: "60px", marginTop: "15px" }}>
            <b>{text}</b>
            <Cursor />
          </h1>
        </div>
        <div className={stylesx.buttonContainer}>
          <button
            className="btn btn-dark"
            onClick={() => navigate("/prediction")}
          >
            Predict House Price
          </button>
          <button
            className={stylesx.buttonCustom}
            onClick={() => navigate("/forecasting")}
          >
            Forecast Median House Price
          </button>
        </div>
      </div>

      <div className="container">
        <div className="row"></div>
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

export default Home;
