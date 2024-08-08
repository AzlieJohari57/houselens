import React from "react";
import { useState } from "react";

import Chatbot from "react-chatbot-kit";
import { ConditionallyRender } from "react-util-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import config from "./config";
// import "react-chatbot-kit/build/main.css";
import "./styles/chatbot.css";
import styles from "./styles/Chatbot.module.css";

const TestChatbot = () => {
  const [showChatbot, toggleChatbot] = useState(false);
  return (
    <>
      TestChatbot
      
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

export default TestChatbot;
