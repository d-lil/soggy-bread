import React from "react";
import "./css/Internet.css";
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
import rgiLogo from "./assets/rgi_logo.png";
import flameRgi from "./assets/flame_rgi.gif";
import cdGif from "./assets/dvd-cd.gif";
import y2kGif from "./assets/2000s.gif";
import fakeAd from "./assets/fake_ad.png";
import noNo from "./assets/no-nope.gif";

const InternetHome = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [showNo, setShowNo] = useState(false);

  const showNoDiv = () => {
    setShowNo(true);
    setTimeout(() => {
      setShowNo(false);
    }, 1500);
  }


  return (
    <div className="home-container">
      <div className="computer-logo">
        <img src={internetLogo} alt="internet" />
        <img src={rgiLogo} className="rgi-logo" alt="rgi" />
      </div>
      <div className="home-content-container">
                {showNo && (
            <div className="showNo">
              <img src={noNo} alt="naughty finger wag" />
              <h2>Naughty Naughty</h2>
            </div>
          )}
        <div className="home-sidebar">
          <div className="home-sidebar-header">
            <h3>FYI</h3>
          </div>
          <hr className="full-width" />
          <div className="home-sidebar-content">
            <h4>
              This styling is{" "}
              <span
                data-text="Satire is the art of making someone or something look ridiculous, raising laughter in order to embarrass, humble, or discredit its targets."
                className="tooltip-sidebar"
              >
                satire
              </span>
              , meant to have the nostalic feeling of an early
              <img src={y2kGif} className="y2k" alt="2000s font" />{" "}
              website/browser.
            </h4>
          </div>

          <div className="home-sidebar-content">
            <h4>
              For a look at a website redesign I worked on with mobile
              responsiveness
              <br />
              <br />
              <Link to="website"> Click Here</Link>
            </h4>
          </div>
          <button className="home-sidebar-content-button" onClick={showNoDiv}>
            <div className="home-sidebar-content-fa">
              <div className="fa-body">
                <h3>
                  <b>
                    <u>CONGRATULATIONS!</u>
                  </b>
                </h3>
                <h4>You are the 1,000,000th visitor to this site!</h4>
                <h4>
                  Click here to claim your
                  <br />
                  <u>FREE</u>
                  <br />
                  GameBro Advance!
                </h4>
              </div>
              <img src={fakeAd} className="fake-ad" alt="fake ad" />
            </div>
          </button>
          <br />
          <br />
          <br />
          <div className="rgi-gifs">
            <img src={flameRgi} className="flame-gif" alt="flame rgi" />

            {/* <img src={cdGif} className="cd-gif" alt="cd gif" /> */}
          </div>
        </div>

        <div className="home-page">
          <div className="tabs">
            <div className={activeTab === "about" ? "tab active" : "tab"}>
              <Link to="about" onClick={() => setActiveTab("about")}>
                About Me
              </Link>
            </div>
            <div className={activeTab === "home" ? "tab active" : "tab"}>
              <Link to="home" onClick={() => setActiveTab("home")}>
                Draw
              </Link>
            </div>
          </div>
          <div className="tab-content">
            <Routes>
              <Route path="/" element={<AboutTab />} />
              <Route path="/about" element={<AboutTab />} />
              <Route path="/home" element={<HomeTab />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

const Internet = ({
  handleMinimizeComponent,
  isMinimized,
  handleCloseComponent,
}) => {
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
                <Link
                  to="/computer"
                  onClick={() => handleCloseComponent("internet")}
                >
                  X
                </Link>
              </div>
            </div>
          </div>
        </div>
        {showDialup && (
            <div className="dialup">
              <img src={dialupGif} alt="dialup" />
            </div>
          )}
        <div
          className={`content ${
            showDialup ? "content-hidden" : "content-display"
          }`}
        >
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
