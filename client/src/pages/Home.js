import React from "react";
import "./css/Home.css";
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";


const Home = () => {
  return (
    <div>
    <div className="computer">
      <Link to="computer">👽Computer</Link>
    </div>
    <div className="game">
    </div>
    <div className="phone">
      <Link to="phone">📞Phone</Link>
    </div>
    <div className="mirror">
      <Link to="mirror">🪞Mirror</Link>
    </div>
    </div>
  );
};

export default Home;
