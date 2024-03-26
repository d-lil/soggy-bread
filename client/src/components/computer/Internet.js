import React from "react";
import "./css/Internet.css"
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
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



const Internet = () => {
  return (
    <div className="internet-window-border">
    <div className="internet-window">
      <div className="nav">
        <div className="internet-title">
        <div className="nav-links">
          <Link to="">Home</Link>
          <Link to="email">Email</Link>
          {/* <Link to="/call">Call</Link> */}
        </div>
        <div className="internet-close">
            <Link to="/computer">X</Link>
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