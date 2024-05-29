import React from "react";
import "./css/Home.css";
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import certificate from "./assets/certificate.png";
import rain from "./assets/rain.mp4";



const Home = () => {
  const [isEnlarged, setIsEnlarged] = useState(false);

  const handleEnlarge = () => {
    setIsEnlarged(!isEnlarged);
  }
  return (
    <div className="room-container">
    <div className="room">
      <div className="upper-room-container">
        <div className={`cert-container  ${isEnlarged ? 'cert-enlarged' : ''}`}>
          <img
            src={certificate}
            className={`certificate`}
            alt="coding certificate"
            onClick={handleEnlarge}
          />
        </div>
        <div className="window-container">
          <div className="window-frame">
            <div className="window">
              <div className="window-video-wrapper">
                <video autoPlay loop muted>
                  <source src={rain} type="video/mp4" />
                </video>
              </div>
            </div>

          </div>
          <div className="window-sill-1"></div>
          <div className="window-sill-2"></div>
        </div>
      </div>
      <div className="lower-room-container">
        <div className="desk-top">
        <div className="desk-left"></div>
        <div className="desk">
          <div className="phone">
            <Link to="phone">📞Phone</Link>
          </div>
          <div className="window-video-reflection">
              <video autoPlay loop muted>
                <source src={rain} type="video/mp4" />
              </video>
            </div>
          <div className="computer">
            <Link to="computer">👽Computer</Link>
          </div>
        </div>
        <div className="desk-right"></div>
      </div>
        <div className="desk-bottom"></div>
      </div>
    </div>
  </div>
  );
};

export default Home;
