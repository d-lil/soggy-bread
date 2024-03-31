import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/Screenshot.css";
import screenshot from "./assets/website_redesign.png";

const Screenshot = ({ handleOpenComponent, handleCloseComponent }) => {
    useEffect(() => {
        handleOpenComponent('Screenshot', true); // or 'ContractText', true
      
        return () => {
            handleCloseComponent('Screenshot');
        };
      }, [handleOpenComponent, handleCloseComponent]);
  return (
    <div className="screenshot-container">
        <img src={screenshot} alt="Screenshot of website redesign" className="screenshot" />
    </div>
  );
};

export default Screenshot;
