import React, { useState, useEffect, useRef } from "react";
import "./css/FakeVirus.css";
import orangeWire from "../../pages/computer/assets/orangewire.png"
import errorSound from "./assets/error.mp3"

function FakeVirus() {
  const [windows, setWindows] = useState([]);

  const handleClick = (e) => {
    e.preventDefault();
  // Both types of popups start simultaneously
  const totalPopups = 30; // Number of each type of popups

  for (let i = 0; i < totalPopups; i++) {
    // Cascading popups
    setTimeout(() => {
        const audio = new Audio(errorSound);
        audio.volume = 0.03;
        audio.play();
      const newWindow = {
        id: `cascading-${i}`,
        message: "Your computer is infected. Click OK to fix it.",
        top: 2 + i * 30,
        left: 2 + i * 30,
        positionType: "cascading",
      };
      setWindows((wins) => [...wins, newWindow]);
    }, i * 100);

    // Random popups
    setTimeout(() => {
        const audio = new Audio(errorSound);
        audio.volume = 0.03;
        audio.play();
      const newWindow = {
        id: `random-${i}`,
        message: "❌Critical error",
        top: Math.random() * (window.innerHeight - 200),
        left: Math.random() * (window.innerWidth - 300),
        positionType: "random",
      };
      setWindows((wins) => [...wins, newWindow]);
    }, i * 100);
  }

  // Set timeout to clear all popups after 3 seconds
  setTimeout(() => {
    setWindows([]);
  }, 4000);
}

  return (
    <div>
    <div className="desktop-virus">
      <a href="" onClick={handleClick}>
        <img
          src={orangeWire}
          alt="orangewire icon"
          className="orange-wire-desktop"
        />
        OrangeWire
        <br />
        MP3
        <br />
        Pirating
      </a>
    </div>
      <div className="windows-container">
        {windows.map((window) => (
          <div
            key={window.id}
            className={`fake-popup ${window.positionType}`}
            style={{
              top: `${window.top}px`,
              left: `${window.left}px`,
              zIndex: 1000,
            }}
          >
            <div className="popup-window">
              <div className="virus-title-bar">
                <span className="virus-title-text">Error</span>
                <button
                  className="virus-close-button"
                  onClick={() =>
                    setWindows((wins) => wins.filter((w) => w.id !== window.id))
                  }
                >
                  x
                </button>
              </div>
              <p>{window.message}</p>
              <button className="virus-button">OK</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FakeVirus;
