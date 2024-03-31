import React, { useState, useEffect } from 'react';
import leftLogo from './assets/left_logo.png';
import rightLogo from './assets/right_logo.png';
import centerLogo from './assets/center_logo.png';
import readOnlyLogo from './assets/read_only_logo.png';

const TextToolbar = ({ onStyleChange, onFontSizeChange }) => {
    const [activeStyles, setActiveStyles] = useState({
      bold: false,
      italic: false,
      underline: false,
      justify: 'justifyLeft'
    });
  
    const toggleStyle = (style) => {
        // Handle justify separately to ensure only one can be active
        if (style.includes('justify')) {
          setActiveStyles({ ...activeStyles, justify: activeStyles.justify === style ? null : style });
        } else {
          // Toggle other styles independently
          setActiveStyles({ ...activeStyles, [style]: !activeStyles[style] });
        }
        onStyleChange(style);
      };
  
    return (
      <div className="contract_projects-toolbar">
        <select onChange={(e) => onFontSizeChange(e.target.value)} className='font-deco size-selector'>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        </select>
      <button 
        onClick={() => toggleStyle('bold')} 
        className={`font-deco ${activeStyles.bold ? 'active' : ''}`}
      >
        <b>B</b>
      </button>
      <button 
        onClick={() => toggleStyle('italic')} 
        className={`font-deco ${activeStyles.italic ? 'active' : ''}`}
      >
        <i>I</i>
      </button>
      <button 
        onClick={() => toggleStyle('underline')} 
        className={`font-deco ${activeStyles.underline ? 'active' : ''}`}
      >
        <u>U</u>
      </button>
      <button 
        onClick={() => toggleStyle('justifyLeft')} 
        className={`font-deco ${activeStyles.justify === 'justifyLeft' ? 'active' : ''}`}
      >
        <img src={leftLogo} alt="left justify" className='justify-icon' />
      </button>
      <button 
        onClick={() => toggleStyle('justifyCenter')} 
        className={`font-deco ${activeStyles.justify === 'justifyCenter' ? 'active' : ''}`}
      >
        <img src={centerLogo} alt="center justify" className='justify-icon' />
      </button>
      <button 
        onClick={() => toggleStyle('justifyRight')} 
        className={`font-deco ${activeStyles.justify === 'justifyRight' ? 'active' : ''}`}
      >
        <img src={rightLogo} alt="right justify" className='justify-icon'/>
      </button>
      <button className='font-deco' disabled>
        <img src={readOnlyLogo} alt="read only" className='justify-icon'/>
        </button>
    </div>
  );
};

export default TextToolbar;
