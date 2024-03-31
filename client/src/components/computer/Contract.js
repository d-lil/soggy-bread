import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./css/Contract.css";
import folderLogo from "./assets/folder.png";
import webLogo from "./assets/web_logo.png";
import mp4Logo from "./assets/mp4_logo.png";
import textLogo from "./assets/text_logo.png";
import { Route, Routes } from "react-router-dom";
import Unite from "./Unite";
import ContractText from "./ContractText";
import Screenshot from "./Screenshot";
import characterImage from "./assets/character.png";
import imageLogo from "./assets/image_logo.png";

const Contract = ({
  handleOpenComponent,
  handleMinimizeComponent,
  handleCloseComponent,
  isMinimized,
  minimizedComponents
}) => {
// In Contract component


  const [activeComponent, setActiveComponent] = useState({
    title: "",
    isOpen: false,
  });
  const [isContractVisible, setIsContractVisible] = useState(false);
  const [characterVisible, setCharacterVisible] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const isVisible = location.pathname.startsWith("/computer/contract");
    setIsContractVisible(isVisible);
  }, [location]);

  const closeComponent = () => {
    setActiveComponent({ title: "", isOpen: false });
    navigate("/computer/contract");
  };

  const headerClassName = activeComponent.isOpen
    ? `${activeComponent.title.toLowerCase()}-header`
    : "";

  return (
    <div className={`contract-container ${isMinimized ? 'hidden' : ''}`}>
      <div className="contract-header">
        <div className="contract-title">
          <img src={folderLogo} alt="folder" className="folder-logo" />
          <h2>Contract</h2>
        </div>
        {!characterVisible && (
          <img
            src={characterImage} // You might want a different, smaller image or icon here
            alt="Show Character"
            className="character-minimized-icon"
            onClick={() => setCharacterVisible(true)}
          />
        )}
 <div className="right-buttons">
        <button  className="minimize-button" onClick={() => handleMinimizeComponent("contract")}>
          _
        </button>

        <div className="contract-close">
          <a href="/computer">X</a>
        </div>
        </div>
      </div>
      <div className="contract-body">
        <div className="contract-item">
          <Link to="/computer/internet/website"  onClick={() => handleCloseComponent("contract")}>
            <img src={webLogo} alt="web logo" className="contract-item-icon" />
            <br />
            LetzChat Website Redesign
          </Link>
        </div>

        <div className="contract-item">
          <Link
            to="/computer/contract/unite"
            state={{ title: "unite" }}
            onClick={() => setActiveComponent({ title: "unite", isOpen: true })}
          >
            <img src={mp4Logo} alt="mp4 icon" className="contract-item-icon" />
            <br />
            unite.mp4
          </Link>
        </div>

        <div className="contract-item">
          <Link
            to="/computer/contract/screenshot"
            state={{ title: "screenshot" }}
            onClick={() =>
              setActiveComponent({ title: "screenshot", isOpen: true })
            }
          >
            <img
              src={imageLogo}
              alt="web logo"
              className="contract-item-icon"
            />
            <br />
            website_
            <br/>screenshot.jpg
          </Link>
        </div>

        <div className="contract-item">
          <Link
            to="/computer/contract/contract-text"
            state={{ title: "contract_projects" }}
            onClick={() =>
              setActiveComponent({ title: "contract_projects", isOpen: true })
            }
          >
            <img
              src={textLogo}
              alt="document logo"
              className="contract-item-icon"
            />
            <br />
            contract_
            <br />
            projects.txt
          </Link>
        </div>
      </div>
      <div  
        className={`contract-content ${
          activeComponent.isOpen ? "visible" : "hidden"
        }${isMinimized ? 'hidden' : ''}`}
      >
        <div className={`contract-content-header ${headerClassName}`}>
          <div className="contract-content-title">
            <h2>{activeComponent.title}</h2>
          </div>
          <div className="right-buttons">

          <div className="contract-content-close">
            <button onClick={closeComponent}>X</button>
          </div>
          </div>
        </div>

        <Routes>
          <Route
            path="contract-text"
            element={
              <ContractText
                handleOpenComponent={handleOpenComponent}
                handleCloseComponent={handleCloseComponent}

                
              />
            }
          />
          <Route
            path="screenshot"
            element={
              <Screenshot
                handleOpenComponent={handleOpenComponent}
                handleCloseComponent={handleCloseComponent}
              />
            }
          />
          <Route
            path="unite"
            element={
              <Unite
                handleOpenComponent={handleOpenComponent}
                handleCloseComponent={handleCloseComponent}

              />
            }
          />
        </Routes>
      </div>

      {isContractVisible && characterVisible && (
        <div
          className="character-container"
          onClick={() => setCharacterVisible(false)}
        >
          {" "}
          {/* Clicking on the character will hide it */}
          <img
            src={characterImage}
            alt="Helpful Character"
            className="character"
          />
          <div className="character-tooltip">
            Hi! <br />
            Please read the contract_projects text file to better understand the
            content in this folder!
          </div>
          <span className="character-text">Click to hide</span>
        </div>
      )}
    </div>
  );
};

export default Contract;
