import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/Unite.css";

const Unite = ({ handleOpenComponent, handleCloseComponent }) => {
    useEffect(() => {
        handleOpenComponent('Unite', true); // or 'ContractText', true
      
        return () => {
            handleCloseComponent('Unite');
        };
      }, [handleOpenComponent, handleCloseComponent]);
  return (
    <div className="unite-container">
        <div className="video">
          <iframe
            src="https://player.vimeo.com/video/826604412?h=387a47e31c&badge=0&autopause=0&player_id=0&app_id=58479"
            width="640"
            height="360"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        </div>

    </div>
  );
};

export default Unite;
