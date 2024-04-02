import React from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { useRef, useCallback } from "react";
import { useState, useEffect } from "react";
import Weather from "../../components/phone/Weather";
import Camera from "../../components/phone/Camera";
import Game from "../../components/phone/Game";
import Contacts from "../../components/phone/Contacts";
import SomeApp from "../../components/phone/Shopping";



function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const timeString = currentTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const dateString = currentTime.toLocaleDateString([], {
    year: "numeric",
    month: "numeric",
    day: "2-digit",
  });

  return (
    <div className="computer-clock">
      <p>
        {timeString}
        <br />
        {dateString}
      </p>
    </div>
  );
}

const Phone = () => {


  

  return (
    <div className="computer-container">
      <div className="screen">
        <div className="bezel">
         
            <div className="app-container">
                <Clock />
              <div className="desktop-internet">
              <Link to="internet">       
              <img src="" alt="internet" className="internet-logo-desktop"/><br/>
              Internet
              </Link>
                </div>
                <div className="desktop-contract">
              <Link to="contract">
              <img src="" alt="folder" className="folder-logo-desktop"/>
                Contract
                </Link>
                </div>
                <div className="desktop-chat">
              <Link to="chat">
                <img src="" alt="dan" className="dan-logo-desktop"/>
                <br/>
                DAN<br/>Instant <br/>Messenger
                </Link>
                </div>
                <div className="desktop-resume">
                <Link to="resume">
                <img src="" alt="dan" className="docu-logo-desktop"/>
                <br/>
                Resume
                </Link>
                </div>
              {/* </>
            )} */}
              <Routes>
                <Route path="weather/*" element={<div className="overlay-component"><Weather /></div>} />
                {/* <Route path="home" element={<Home />} /> */}
                <Route path="camera/*" element={<div className="overlay-component"><Camera/></div>} />
                <Route path="game/*" element={<div className="overlay-component"><Game /></div>} />
                <Route path="contacts/*" element={<div className="overlay-component"><Contacts /></div>} />
                <Route path="someapp/*" element={<div className="overlay-component"><SomeApp /></div>} />
              </Routes>
            </div>
            </div>

      </div>
    </div>
  );
};

export default Phone;
