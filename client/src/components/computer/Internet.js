import React from "react";
import "./css/Internet.css"
import { Link } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import internetLogo from "./assets/internet_logo.png";
import Github from "./Github";
import FakeVirus from "./FakeVirus";

import Email from "./Email";
import EmbeddedWebsite from "./Website";

function ExternalContent() {
  const [url, setUrl] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const allowedLinks = [
      'https://example.com/somepage',
      'https://news.example.com/article',
      'https://info.example.com/contact'
  ];

  const fetchContent = () => {
      fetch(`/api/content?url=${encodeURIComponent(url)}`)
          .then(res => res.text())
          .then(setHtmlContent)
          .catch(error => console.error('Failed to fetch content', error));
  };

  return (
      <div>
          <select value={url} onChange={e => setUrl(e.target.value)}>
              <option value="">Select a URL</option>
              {allowedLinks.map(link => (
                  <option key={link} value={link}>
                      {link}
                  </option>
              ))}
          </select>
          <button onClick={fetchContent}>Fetch Content</button>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
  );
}

const InternetHome = () => {
    return (
        <div className="home-page">
        <h1>Welcome to the Internet</h1>
        <ExternalContent />
        {/* <FakeVirus /> */}
        </div>
    );
    }



const Internet = ({ handleMinimizeComponent, isMinimized, handleCloseComponent }) => {

  
  return (
    <div className={`internet-window-border ${isMinimized ? 'hidden' : ''}`}>
    <div className="internet-window">
      <div className="nav">
        <div className="internet-title">
        <div className="nav-links">
          <Link to="">Home</Link>
          <Link to="email">Email</Link>
          <Link to="github">GitHub</Link>
          {/* <Link to="/call">Call</Link> */}
        </div>
        <div className="right-buttons">
        <button  className="minimize-button-internet" onClick={() => handleMinimizeComponent('internet')}>_</button>
        <div className="internet-close">
            <Link to="/computer" onClick={() => handleCloseComponent('internet')}>X</Link>
        </div>
        </div>
        </div>
      </div>
      <div className="computer-logo">
        <img src={internetLogo} alt="internet" />
      </div>
      <div className="content">
        <Routes>
          <Route index element={<InternetHome />} />
          <Route path="email" element={<Email />} />
          <Route path="website" element={<EmbeddedWebsite src="https://gravel-sandwich-cdd2ca40b2a9.herokuapp.com/" height="100%" width="100%" />} />
          <Route path="github" element={<Github />} />
        </Routes>
      </div>
    </div>
    </div>
  );
};

export default Internet;