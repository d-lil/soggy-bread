import React from "react";
import "./css/Internet.css"
import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import internetLogo from "./assets/internet_logo.png";
import Github from "./Github";
import Email from "./Email";
import EmbeddedWebsite from "./Website";
import HomeTab from "./subcomponents/HomeTab";
import AboutTab from "./subcomponents/AboutTab";
import dialUp from "./assets/dial_up.mp3";
import dialupGif from "./assets/call-calling.gif";

const InternetHome = () => {
  const [activeTab, setActiveTab] = useState('home');
  return (
      <div className="home-page">
          <div className="tabs">
          <div className={activeTab === 'home' ? 'tab active' : 'tab'}>
              <Link to="home" onClick={() => setActiveTab('home')}>Home Tab</Link>
            </div>
            <div className={activeTab === 'about' ? 'tab active' : 'tab'}>
              <Link to="about" onClick={() => setActiveTab('about')}>About Tab</Link>
            </div>
          </div>
          <div className="tab-content">
              <Routes>
                  <Route path="/" element={<HomeTab />} />
                  <Route path="/home" element={<HomeTab />} />
                  <Route path="/about" element={<AboutTab />} />
              </Routes>
          </div>
      </div>
  );
};

const Internet = ({ handleMinimizeComponent, isMinimized, handleCloseComponent }) => {
  const [showDialup, setShowDialup] = useState(false);

  useEffect(() => {
    const audio = new Audio(dialUp);
    audio.volume = 0.03;

    const playAudio = async () => {
      setShowDialup(true);
      try {
        await audio.play();
        audio.addEventListener("ended", () => {
          setShowDialup(false);
        });
      } catch (error) {
        console.error("Failed to play audio:", error);
      }
    };

    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0; // Reset the audio to the start
      setShowDialup(false);
    };
  }, []);

  return (
    <div className={`internet-window-border ${isMinimized ? "hidden" : ""}`}>
      <div className="internet-window">
        <div className="nav">
          <div className="internet-title">
            <div className="nav-links">
              <Link to="">Home</Link>
              <Link to="email">Email</Link>
              <Link to="github">GitHub</Link>
            </div>
            <div className="right-buttons">
              <button
                className="minimize-button-internet"
                onClick={() => handleMinimizeComponent("internet")}
              >
                _
              </button>
              <div className="internet-close">
                <Link to="/computer" onClick={() => handleCloseComponent("internet")}>
                  X
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="computer-logo">
          <img src={internetLogo} alt="internet" />
        </div>
        <div className="content">
          {showDialup && (
            <div className="dialup">
              <img src={dialupGif} alt="dialup" />
            </div>
          )}
          <Routes>
            <Route path="/*" element={<InternetHome />} />
            <Route path="/email" element={<Email />} />
            <Route
              path="/website"
              element={
                <EmbeddedWebsite
                  src="https://gravel-sandwich-cdd2ca40b2a9.herokuapp.com/"
                  height="100%"
                  width="100%"
                />
              }
            />
            <Route path="/github" element={<Github />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Internet;
