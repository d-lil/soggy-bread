import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./css/Contract.css";
import folderLogo from "./assets/folder.png";
import webLogo from "./assets/web_logo.png";
import documentLogo from "./assets/document_logo.png";
import textLogo from "./assets/text_logo.png";
import { Route, Routes } from "react-router-dom";
import Unite from "./Unite";
import ContractText from "./ContractText";
import characterImage from "./assets/web_logo.png";

const Contract = () => {
  const [activeComponent, setActiveComponent] = useState({
    title: "",
    isOpen: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [isContractVisible, setIsContractVisible] = useState(false);

  useEffect(() => {
    // Set isContractVisible based on the location
    // For instance, if the Contract component becomes visible at a certain path
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
    <div
      className="contract-container">
      <div className="contract-header">
        <div className="contract-title">
          <img src={folderLogo} alt="folder" className="folder-logo" />
          <h2>Contract</h2>
        </div>
        <div className="contract-close">
          <a href="/computer">X</a>
        </div>
      </div>
      <div className="contract-body">
        <div className="contract-item">
          <Link to="/computer/internet/website">
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
            <img
              src={documentLogo}
              alt="unite logo"
              className="contract-item-icon"
            />
            <br />
            unite.mp4
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
        }`}
      >
        <div className={`contract-content-header ${headerClassName}`}>
          <div className="contract-content-title">
            <h2>{activeComponent.title}</h2>
          </div>
          <div className="contract-content-close">
            <button onClick={closeComponent}>X</button>
          </div>
        </div>

        <Routes>
          <Route path="contract-text" element={<ContractText />} />
          <Route path="unite" element={<Unite />} />
        </Routes>
      </div>

      {isContractVisible && (
        <div className="character-container">
          <img src={characterImage} alt="Helpful Character" className="character" />
          <div className="character-tooltip">Hi! Please read the contract_projects text file to better understand the content in this folder! </div>
        </div>
      )}
    </div>
  );
};

export default Contract;
