class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  // Method to send user message to endpoint and handle response
  sendMessageToEndpoint = async (message) => {
    try {
      const response = await fetch("http://localhost:8800/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      this.actionProvider.echoMessage(data.message); // Assuming your response structure has a "message" field
    } catch (error) {
      console.error("Error sending message to endpoint:", error);
      // Handle error, e.g., show error message in chat
      const errorMessage = this.actionProvider.createChatBotMessage('Error: Failed to send message');
      this.actionProvider.addMessageToState(errorMessage);
    }
  };

  parse = (message) => {
    // Log the incoming message to console (optional)
    console.log(message);

    // Call sendMessageToEndpoint to send message and handle response
    this.sendMessageToEndpoint(message);
  };
}

export default MessageParser;
