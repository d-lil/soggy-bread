import React, { useState } from "react";
import { useEffect } from "react";
import "./css/ContractText.css";
import TextToolbar from "./TextToolbar";
import ContractProjectsBody from "./ContractProjectsBody";

const ContractText = ({ handleOpenComponent, handleCloseComponent }) => {
    useEffect(() => {
        handleOpenComponent('contract_projects', true); // or 'ContractText', true
      
        return () => {
            handleCloseComponent('contract_projects');
        };
      }, [handleOpenComponent, handleCloseComponent]);

    return (
    <div className="contract_projects-container">
      <ContractProjectsBody />
    </div>
  );
};

export default ContractText;