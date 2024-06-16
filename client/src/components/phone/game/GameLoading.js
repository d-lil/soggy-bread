import React from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Game from "./Game";
import "./css/Game.css";


const GameLoading = () => {
    const navigate = useNavigate(); // Get the navigate function
  
    useEffect(() => {
      const timer = setTimeout(() => {
        navigate('game'); // Navigate to the Game component's route after 3 seconds
      }, 3000);
  
      return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
    }, [navigate]);

    return (
        <div className="game-container">

            <div className="loading-screen">
              <h1>
                <u>FLASH WARNING</u>
              </h1>
              <h2>
                This application contains occasional flash effects that may effect
                some users
              </h2>
              <br />
              <p>
                <i>This game is designed to be played on a desktop or laptop computer</i>
              </p>
              <h4>All artwork by Daniel Liljegren</h4>
              <h4>Music by Vierre Cloud</h4>
              <p>Copyright for this does not exist. @2024</p>
            </div>


            <Routes>
                <Route
                  path="game/*"
                  element={
                    <div className="overlay-component">
                      <Game />
                    </div>
                  }
                />
            </Routes>
          </div>
    );
    };

export default GameLoading;