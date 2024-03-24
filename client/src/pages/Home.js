import React from "react";
import "./css/Home.css";
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";


const Home = () => {
  return (
    <div className="computer">
      <Link to="computer">👽Computer</Link>
    </div>
  );
};

export default Home;
