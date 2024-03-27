import React, { useState } from "react";
import { useEffect } from "react";
import "./css/ContractText.css";

const ContractText = ({ handleOpenComponent, handleCloseComponent }) => {
    useEffect(() => {
        handleOpenComponent('contract_projects', true); // or 'ContractText', true
      
        return () => {
            handleCloseComponent('contract_projects');
        };
      }, [handleOpenComponent, handleCloseComponent]);

    return (
    <div className="contract_projects-container">

      <div className="whatever">
        <h1>LOL</h1>
        </div>

    </div>
  );
};

export default ContractText;