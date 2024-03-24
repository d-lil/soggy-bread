import React from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { useRef } from "react";
import { useState, useEffect } from "react";
import "./css/Computer.css";
import Home from "../Home";
import Contract from "./Contract";
import Internet from "./Internet";
import ChatComponent from "../../components/computer/ChatComponent";
import internetLogo from "./assets/internet_logo.png";
import folderLogo from "./assets/folder.png";
import danLogo from "./assets/dan_logo.png";

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

const TaskbarMenu = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="taskbar-menu">
      <Link to="/computer/internet">
        <img src={internetLogo} alt="internet" className="internet-logo-desktop-taskbar"/>
        Internet
        </Link>
        <br />
      <Link to="/computer/contract">
      <img src={folderLogo} alt="folder" className="folder-logo-desktop-taskbar"/>
        Contract
        </Link>
        <br />
      <Link to="/computer/chat">
        <img src={danLogo} alt="dan" className="dan-logo-desktop-taskbar"/>
        DAN.I.M.
        </Link>

    </div>
  );
});

const Computer = () => {
  //   const location = useLocation();
  //   const isHome = location.pathname === "/computer";

  const [isTaskbarVisible, setIsTaskbarVisible] = useState(false);
  const taskbarMenuRef = useRef();

  const closeTaskbar = () => {
    setIsTaskbarVisible(false);
  };

  const toggleTaskbarOnMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    setIsTaskbarVisible(prev => !prev);
};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isTaskbarVisible &&
        taskbarMenuRef.current &&
        !taskbarMenuRef.current.contains(event.target)
      ) {
        closeTaskbar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTaskbarVisible])

  return (
    <div className="computer-container">
      <div className="screen">
        <div className="bezel">
          <div className="taskbar-container">
            <div className="app-container">
              {/* {isHome && (
              <> */}
              <div className="desktop-internet">
              <Link to="internet">       
              <img src={internetLogo} alt="internet" className="internet-logo-desktop"/><br/>
              Internet
              </Link>
                </div>
                <div className="desktop-contract">
              <Link to="contract">
              <img src={folderLogo} alt="folder" className="folder-logo-desktop"/>
                Contract
                </Link>
                </div>
                <div className="desktop-chat">
              <Link to="chat">
                <img src={danLogo} alt="dan" className="dan-logo-desktop"/>
                <br/>
                DAN<br/>Instant <br/>Messenger
                </Link>
                </div>
              {/* </>
            )} */}
              <Routes>
                <Route path="internet/*" element={<div className="overlay-component"><Internet /></div>} />
                {/* <Route path="home" element={<Home />} /> */}
                <Route path="contract/*" element={<div className="overlay-component"><Contract /></div>} />
                <Route path="chat/*" element={<div className="overlay-component"><ChatComponent /></div>} />
              </Routes>
            </div>
            <div className="taskbar">
            <button onMouseDown={toggleTaskbarOnMouseDown} className="start-button">Start</button>

              {isTaskbarVisible && <TaskbarMenu ref={taskbarMenuRef} />}
              <Clock />
            </div>
          </div>
        </div>
      </div>
      <div className="keyboard">
        <div className="keys">
          <div className="key">ESC</div>
          <div className="key">F1</div>
          <div className="key">F2</div>
          <div className="key">F3</div>
          <div className="key">F4</div>
          <div className="key">F5</div>
          <div className="key">F6</div>
          <div className="key">F7</div>
          <div className="key">F8</div>
          <div className="key">F9</div>
          <div className="key">F10</div>
          <div className="key">F11</div>
          <div className="key">F12</div>
          <div className="key">HOME</div>
          <div className="key">END</div>
          <div className="key">DEL</div>
        </div>
        <div className="keys">
          <div className="key2">
            ~<br />`
          </div>
          <div className="key2">
            !<br />1
          </div>
          <div className="key2">
            @<br />2
          </div>
          <div className="key2">
            #<br />3
          </div>
          <div className="key2">
            $<br />4
          </div>
          <div className="key2">
            %<br />5
          </div>
          <div className="key2">
            ^<br />6
          </div>
          <div className="key2">
            &<br />7
          </div>
          <div className="key2">
            *<br />8
          </div>
          <div className="key2">
            (<br />9
          </div>
          <div className="key2">
            )<br />0
          </div>
          <div className="key2">
            _<br />-
          </div>
          <div className="key2">
            +<br />=
          </div>
          <div className="key3">BACKSPACE</div>
        </div>
      </div>
    </div>
  );
};

export default Computer;
