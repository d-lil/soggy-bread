import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Internet.css";
import mePic from "../assets/me2.jpg";
import mePic2 from "../assets/me1.jpg";

const AboutTab = () => {
  const [iframeSrc, setIframeSrc] = useState("");
  const [iframeVisible, setIframeVisible] = useState(false);

  const openIframe = (src) => {
    setIframeSrc(src);
    setIframeVisible(true);
  };

  const closeIframe = () => {
    setIframeSrc("");
    setIframeVisible(false);
  };

  return (
    <div className="about-tab">
      <div className="about-wrapper">
        <h1 className="staggered-text st1">Welcome to my</h1>
        <h1 className="staggered-text st2">
          <span className="color-change color-change-1">P</span>
          <span className="color-change color-change-2">O</span>
          <span className="color-change color-change-3">R</span>
          <span className="color-change color-change-4">T</span>
          <span className="color-change color-change-5">F</span>
          <span className="color-change color-change-6">O</span>
          <span className="color-change color-change-7">L</span>
          <span className="color-change color-change-8">I</span>
          <span className="color-change color-change-1">O</span>
        </h1>
      </div>
      <div className="about-tab-content">
        <div className="about-tab-header">
          <h2>I am Danny. A full-stack developer from Denver, Colorado.</h2>
        </div>
        <div className="about-tab-images">
          {/* <img src={mePic} alt="me" className="me-pic" /> */}
          <img src={mePic2} alt="me" className="me-pic" />
        </div>
        <div className="about-tab-body">
          <h3>
            I don't have much as far as professional experience, but I have done
            contract work with a translation software company called{" "}
            <button
              onClick={() => openIframe("https://www.letzchat.com")}
              className="letzchat-button"
            >
              LetzChat
            </button>
            .
          </h3>

          {iframeVisible && (
            <div className="iframe-container">
              <button onClick={closeIframe} className="letzchat-close-button">
                Close
              </button>
              <iframe
                src={iframeSrc}
                height="500"
                width="100%"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <h3 className="pink">
            You can read about some projects I have worked on and see a couple
            of the products in the <Link to="/contract">Contract</Link> folder on this desktop.
          </h3>
          <hr />
          <h3 className="yella">
            I am currently looking for a full-time position as a software
            developer. I am open to any and all opportunities.
          </h3>
          <hr />
          <br />
          <h3>
            I hope you have fun exploring my portfolio! <span className="standout">If you'd like to get in
            touch</span>, you can email me from the{" "}
            <Link to="/computer/internet/email">Email</Link> link in the nav bar
            above or you can call me from my{" "}
            <Link to="/phone/telephone">Phone</Link> component! I hope to hear
            from you!
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
