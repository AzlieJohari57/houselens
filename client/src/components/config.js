// config.js
import { createChatBotMessage } from "react-chatbot-kit";
import ActionProvider from "./ActionProvider"; // adjust path as needed
import MessageParser from "./MessageParser"; // adjust path as needed

const config = {
    botName: "Houselens Bot", // Check if there's a botName or similar property

  initialMessages: [
    createChatBotMessage(`Welcome to Houselens! How can I help you?`),
  ],
  customComponents: {},
  state: {},
  actionProvider: (createChatBotMessage, setStateFunc) =>
    new ActionProvider(createChatBotMessage, setStateFunc),
  messageParser: (actionProvider, state) =>
    new MessageParser(actionProvider, state),
};

export default config;
