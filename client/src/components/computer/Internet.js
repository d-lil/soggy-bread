import React from "react";
import "./css/Internet.css"
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import internetLogo from "./assets/internet_logo.png";


import Email from "./Email";
import EmbeddedWebsite from "./Website";


const InternetHome = () => {
    return (
        <div className="home-page">
        <h1>Welcome to the Internet</h1>
        </div>
    );
    }



const Internet = ({ handleMinimizeComponent, isMinimized }) => {

  
  return (
    <div className={`internet-window-border ${isMinimized ? 'hidden' : ''}`}>
    <div className="internet-window">
      <div className="nav">
        <div className="internet-title">
        <div className="nav-links">
          <Link to="">Home</Link>
          <Link to="email">Email</Link>
          {/* <Link to="/call">Call</Link> */}
        </div>
        <div className="right-buttons">
        <button  className="minimize-button-internet" onClick={() => handleMinimizeComponent('internet')}>_</button>
        <div className="internet-close">
            <Link to="/computer">X</Link>
        </div>
        </div>
        </div>
      </div>
      <div className="computer-logo">
        <img src={internetLogo} alt="internet" />
      </div>
      <div className="content">
        <Routes>
          <Route index element={<InternetHome />} />
          <Route path="email" element={<Email />} />
          <Route path="website" element={<EmbeddedWebsite src="https://gravel-sandwich-cdd2ca40b2a9.herokuapp.com/" height="100%" width="100%" />} />
        </Routes>
      </div>
    </div>
    </div>
  );
};

export default Internet;