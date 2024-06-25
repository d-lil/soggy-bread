import React from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { useRef, useCallback } from "react";
import { useState, useEffect } from "react";
import "./css/Computer.css";
import Home from "../Home";
import Contract from "../../components/computer/Contract";
import Internet from "../../components/computer/Internet";
import ChatComponent from "../../components/computer/ChatComponent";
import Resume from "../../components/computer/Resume";
import internetLogo from "./assets/internet_logo.png";
import folderLogo from "./assets/folder.png";
import danLogo from "./assets/dan_logo.png";
import signoutLogo from "./assets/signout_logo.png";
import documentLogo from "./assets/document_logo.png";
import FakeVirus from "../../components/computer/FakeVirus";


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
        <img
          src={internetLogo}
          alt="internet"
          className="internet-logo-desktop-taskbar"
        />
        Internet
      </Link>
      <br />
      <Link to="/computer/contract">
        <img
          src={folderLogo}
          alt="folder"
          className="folder-logo-desktop-taskbar"
        />
        Contract
      </Link>
      <br />
      <Link to="/computer/chat">
        <img src={danLogo} alt="dan" className="dan-logo-desktop-taskbar" />
        DAN.I.M.
      </Link>
      <br />
      <Link to="/computer/resume">
        <img
          src={documentLogo}
          alt="dan"
          className="docu-logo-desktop-taskbar"
        />
        Resume
      </Link>
      <br />
      <br />
      <Link to="/">
      <span className="taskbar-tooltip" data-text="'Sign Out' to head back to the room">
        <img
          src={signoutLogo}
          alt="signout icon"
          className="signout-logo-desktop-taskbar"
        />
        Sign Out</span>
      </Link>
    </div>
  );
});

const Computer = () => {
  const [isTaskbarVisible, setIsTaskbarVisible] = useState(false);
  const [openComponents, setOpenComponents] = useState([]);
  const location = useLocation();
  const taskbarMenuRef = useRef();
  const [activeComponent, setActiveComponent] = useState("");
  const [minimizedComponents, setMinimizedComponents] = useState([]);

  const closeTaskbar = () => {
    setIsTaskbarVisible(false);
  };

  const toggleTaskbarOnMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsTaskbarVisible((prev) => !prev);
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
  }, [isTaskbarVisible]);

  useEffect(() => {
    const path = location.pathname.split("/")[2];
    if (path && !openComponents.includes(path)) {
      setOpenComponents([...openComponents, path]);
    }
  }, [location, openComponents]);

  const handleOpenComponent = useCallback((componentName, isNested = false) => {
    setOpenComponents((prevComponents) => {
      const existingComponentIndex = prevComponents.findIndex(
        (c) => c.name === componentName
      );
      if (existingComponentIndex === -1) {
        return [...prevComponents, { name: componentName, isVisible: true }];
      } else {
        const newComponents = [...prevComponents];
        newComponents[existingComponentIndex].isVisible = true;
        return newComponents;
      }
    });
  }, []);

  const handleMinimizeComponent = useCallback((componentName) => {
    setMinimizedComponents((prev) => {
      const isMinimized = prev.includes(componentName);
      return isMinimized
        ? prev.filter((name) => name !== componentName)
        : [...prev, componentName];
    });
  }, []);

  const handleCloseComponent = useCallback((componentName) => {
    setOpenComponents((prevComponents) =>
      prevComponents.filter((component) => component.name !== componentName)
    );
  }, []);

  useEffect(() => {
    const path = location.pathname.split("/")[2];
    if (path) {
      handleOpenComponent(path);
    }
  }, [location, handleOpenComponent]);

  const renderTaskbarTabs = () => {
    return openComponents.map(
      (component, index) =>
        component.isVisible && (
          <div
            key={index}
            className={`taskbar-tab ${component.isNested ? "nested-tab" : ""}`}
            onClick={() => {
              setActiveComponent(component.name);
              if (minimizedComponents.includes(component.name)) {
                handleMinimizeComponent(component.name);
              }
            }}
          >
            {component.name}
          </div>
        )
    );
  };

  return (
    <div className="computer-container">
      <div className="screen">
        <div className="bezel">
          <div className="taskbar-container">
            <div className="app-container">
              <div className="desktop-internet">
                <Link to="internet">
                  <img
                    src={internetLogo}
                    alt="internet"
                    className="internet-logo-desktop"
                  />
                  <br />
                  Internet
                </Link>
              </div>
              <div className="desktop-contract">
                <Link to="contract">
                  <img
                    src={folderLogo}
                    alt="folder"
                    className="folder-logo-desktop"
                  />
                  Contract
                </Link>
              </div>
              <div className="desktop-chat">
                <Link to="chat">
                  <img src={danLogo} alt="dan" className="dan-logo-desktop" />
                  <br />
                  DAN
                  <br />
                  Instant <br />
                  Messenger
                </Link>
              </div>
              <div className="desktop-resume">
                <Link to="resume">
                  <img
                    src={documentLogo}
                    alt="dan"
                    className="docu-logo-desktop"
                  />
                  <br />
                  Resume
                </Link>
              </div>
              <FakeVirus />


              {/* </>
            )} */}
              <Routes>
                <Route
                  path="internet/*"
                  element={
                    <div className="overlay-component">
                      <Internet
                        handleOpenComponent={handleOpenComponent}
                        handleCloseComponent={handleCloseComponent}
                        handleMinimizeComponent={handleMinimizeComponent}
                        isMinimized={minimizedComponents.includes("internet")}
                      />
                    </div>
                  }
                />
                {/* <Route path="home" element={<Home />} /> */}
                <Route
                  path="contract/*"
                  element={
                    <div className="overlay-component">
                      <Contract
                        handleOpenComponent={handleOpenComponent}
                        handleCloseComponent={handleCloseComponent}
                        handleMinimizeComponent={handleMinimizeComponent}
                        isMinimized={minimizedComponents.includes("contract")}
                        minimizedComponents={minimizedComponents}
                      />
                    </div>
                  }
                />
                <Route
                  path="chat/*"
                  element={
                    <div className="overlay-component">
                      <ChatComponent
                        handleOpenComponent={handleOpenComponent}
                        handleCloseComponent={handleCloseComponent}
                        handleMinimizeComponent={handleMinimizeComponent}
                        isMinimized={minimizedComponents.includes("chat")}
                      />
                    </div>
                  }
                />
                <Route
                  path="resume/*"
                  element={
                    <div className="overlay-component">
                      <Resume
                        handleOpenComponent={handleOpenComponent}
                        handleCloseComponent={handleCloseComponent}
                        handleMinimizeComponent={handleMinimizeComponent}
                        isMinimized={minimizedComponents.includes("resume")}
                      />
                    </div>
                  }
                />
              </Routes>
            </div>
            <div className="taskbar">
              <div className="start-tabs-container">
                <button
                  onMouseDown={toggleTaskbarOnMouseDown}
                  className="start-button"
                >
                  Start
                </button>
                {renderTaskbarTabs()}
                {isTaskbarVisible && <TaskbarMenu ref={taskbarMenuRef} />}
              </div>
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
