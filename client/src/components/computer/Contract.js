import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Contract.css';
import folderLogo from './assets/folder.png';
import webLogo from './assets/web_logo.png';
import documentLogo from './assets/document_logo.png';
import textLogo from './assets/text_logo.png';

const Contract = () => {


  return (
    <div className="contract-container">
      <div className="contract-header">
        <div className="contract-title">
          <img src={folderLogo} alt="folder" className="folder-logo"/>
        <h2>Contract</h2>
        </div>
        <div className="contract-close">
          <a href="/computer">X</a>
        </div>
      </div>
      <div className="contract-body">
        <div className="contract-item">
        <Link to="/computer/internet/website">
          <img src={webLogo} alt="web logo" classname="contract-item-icon" />
        <br/>LetzChat Website Redesign
        </Link>
        </div>
        <div className="contract-item">
          <Link to="">
        <img src={textLogo} alt="document logo" classname="contract-item-icon" />
        <br/>contract_
        <br/>projects.txt
        </Link>
        </div>
        </div>

    </div>
  );
}

export default Contract;