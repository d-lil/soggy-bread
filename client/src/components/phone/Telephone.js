import React, { useState } from "react";
import "./css/Telephone.css";
import dannyPic from "./assets/danny.jpg";
import { createClient } from "@signalwire/js";

const Telephone = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const handleCall = async () => {
    if (
      window.confirm(
        "This will call Danny. Continue? \n *Must allow microphone access*"
      )
    ) {
      await connectCall();
    }
  };

  const connectCall = async () => {
    const client = await createClient({
      project: process.env.REACT_APP_SIGNALWIRE_PROJECT_ID, // Replace with your Project ID
      token: process.env.REACT_APP_SIGNALWIRE_API_TOKEN, // Replace with your API Token
    });

    try {
      const call = await client.calling.newCall({
        type: "webrtc", // Use 'webrtc' for browser-to-phone calls
        from: "12089867703",
        to: "13038815725", // The number you want to call
      });

      call.on("created", () => {
        console.log("Call created");
        setIsConnected(true);
        startTimer();
      });

      call.on("answered", () => {
        console.log("Call answered");
        call.playTTS({
          text: "Hello, you are connecting to Danny",
          gender: "female",
        });
      });

      call.on("ended", () => {
        console.log("Call ended");
        setIsConnected(false);
        stopTimer();
        setTimeout(() => setTimer(0), 3000);
      });

      await call.dial();
    } catch (error) {
      console.error("Error making call:", error);
    }
  };

  const endCall = async () => {
    // Implement SignalWire SDK call ending if necessary
    setIsConnected(false);
    stopTimer();
    setTimeout(() => setTimer(0), 3000);
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setTimer((oldTime) => oldTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="telephone">
      <div className="telephone-header">
        <h1>Danny</h1>
        <p>Phone number: (303) 881 - 5725</p>
      </div>
      <img src={dannyPic} alt="Danny" className="danny-picture" />
      <div className="phone-buttons">
        <button
          onClick={handleCall}
          disabled={isConnected}
          className="call-button"
        >
          Call
        </button>
        <button
          onClick={endCall}
          disabled={!isConnected}
          className="end-connected"
        >
          End
        </button>
      </div>
      <div className="call-status">
        {isConnected ? `Call Connected: ${formatTime(timer)}` : "Call Ended"}
      </div>
    </div>
  );
};

export default Telephone;
