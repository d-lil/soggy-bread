import React, { useState } from "react";
import "./css/ChatComponent.css";
import { useRef, useEffect } from "react";

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

const ChatComponent = () => {
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("chatMessages")) || []
  );
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    const messagesDisplay = document.querySelector(".messages-display");
    if (messagesDisplay) {
      messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
    }
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = { sender: "user", text: inputMessage };
      setMessages([...messages, userMessage]);
      setInputMessage("");
      setIsTyping(true);

      try {
        const response = await fetch(
          "http://localhost:3001/generate-response",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userInput: inputMessage }),
          }
        );

        if (!response.ok) {
          throw new Error("Response not ok");
        }

        const data = await response.json();

        setTimeout(() => {
          setIsTyping(false);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "ai", text: data.aiResponse },
          ]);
        }, 2000);
      } catch (error) {
        setIsTyping(false);
        console.error("Failed to fetch AI response:", error);
      }
    }
  };

  const askDeleteMessage = (index) => {
    setMessageToDelete(index);
    setShowDeletePopup(true);
  };

  const deleteMessage = () => {
    if (messageToDelete !== null) {
      setMessages((currentMessages) => {
        const filteredMessages = currentMessages.filter(
          (_, index) => index !== messageToDelete
        );
        localStorage.setItem("chatMessages", JSON.stringify(filteredMessages));
        return filteredMessages;
      });

      setShowDeletePopup(false);
      setMessageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setMessageToDelete(null);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>DAN.I.M.</h2>
        <div className="chat-close">
          <a href="/computer">X</a>
        </div>
      </div>
      <div className="messages-display">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-container ${message.sender}`}
            onClick={() => askDeleteMessage(index)}
          >
            <p className="message-sender">
              {message.sender === "user" ? "You" : "Ashley"}
            </p>
            <div className={`message ${message.sender}`}>{message.text}</div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <button onClick={clearMessages} className="clear-messages-button">Clear Chat</button>
      <div className="message-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {showDeletePopup && (
        <div className="delete-confirmation">
          <p>Delete message?</p>
          <button onClick={deleteMessage} className="chat-yes">Yes</button>
          <button onClick={cancelDelete} className="chat-no">No</button>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
