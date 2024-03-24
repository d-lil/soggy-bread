import React from "react";
import "./css/Internet.css"
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import internetLogo from "./assets/internet_logo.png";


import Email from "./Email";


const InternetHome = () => {
    return (
        <div>
        <h1>Welcome to the Internet</h1>
        </div>
    );
    }



const Internet = () => {
  return (
    <div className="internet-window-border">
    <div className="internet-window">
      <div className="nav">
        <div className="nav-links">
          <Link to="">Home</Link>
          <Link to="email">Email</Link>
          {/* <Link to="/call">Call</Link> */}
        </div>


        <div className="internet-close">
            <Link to="/computer">X</Link>
        </div>
      </div>
      <div className="computer-logo">
        <img src={internetLogo} alt="internet" />
      </div>
      <div className="content">
        <Routes>
          <Route index element={<InternetHome />} />
          <Route path="email" element={<Email />} />

        </Routes>
      </div>
    </div>
    </div>
  );
};

export default Internet;