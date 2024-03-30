import React from "react";
import ResumeDL from "./pdf/Resume.pdf";
import "./css/Resume.css";
import documentLogo from "./assets/document_logo.png";

const Resume = ({ handleMinimizeComponent }) => {
    const zoomLevel = '75';
    // Append the zoom level to the PDF URL
    const pdfWithZoom = `${ResumeDL}#zoom=${zoomLevel}`;
  return (
    <div className="resume-container">
      <div className="resume-header">
        <div className="resume-title">
          <img
            src={documentLogo}
            alt="document icon"
            className="document-logo"
          />
          <h2>Resume</h2>
        </div>

        <div className="right-buttons">
          <button
            className="minimize-button"
            onClick={() => handleMinimizeComponent("resume")}
          >
            _
          </button>

          <div className="resume-close">
            <a href="/computer">X</a>
          </div>
        </div>
      </div>
      <a href={ResumeDL} className="resume-download-btn" download>
      <span className="blue-arrow">➡</span> Download Resume <span className="blue-arrow">⬅</span>
      </a>
      <div className="resume-preview">
      <iframe src={pdfWithZoom} width="100%" height="100%"></iframe>
      </div>
    </div>
  );
};

export default Resume;
