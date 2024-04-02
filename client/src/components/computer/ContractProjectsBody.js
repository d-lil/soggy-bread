import React, { useState } from 'react';
import TextToolbar from './TextToolbar';

const ContractProjectsBody = () => {
  const [style, setStyle] = useState({
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    fontSize: '14px'
  });

  const [fontWeight, setFontWeight] = useState('normal');

  const handleStyleChange = (styleKey, value) => {
    // value will be the new state for the styleKey, either true or false
    switch (styleKey) {
      case 'bold':
        setFontWeight(prevWeight => prevWeight === 'bold' ? 'normal' : 'bold');
        break;
      case 'italic':
        setStyle({ ...style, fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' });
        break;
      case 'underline':
        setStyle({ ...style, textDecoration: style.textDecoration === 'underline' ? 'none' : 'underline' });
        break;
      case 'justifyLeft':
        setStyle({ ...style, textAlign: 'left' });
        break;
      case 'justifyCenter':
        setStyle({ ...style, textAlign: 'center' });
        break;
      case 'justifyRight':
        setStyle({ ...style, textAlign: 'right' });
        break;
      default:
        break;
    }
  };

  const handleFontSizeChange = (fontSize) => {
    setStyle({ ...style, fontSize });
  };

  return (
    <div className="contract_projects-body">
      <TextToolbar onStyleChange={handleStyleChange} onFontSizeChange={handleFontSizeChange} />
      <div style={style} className="contract_projects-body-text">
      <p style={{ fontWeight: fontWeight }}>
            <span className='red-text'>This folder contains some of the projects that I have worked on under contract, but does not include all of them.</span>
            <br />
            <br />
            The actual projects and code I am not able to share since they are owned by the company I worked for and are paid products.
            <br />
            <br />
            However, I can share the following about the projects that I have worked on under contract and/or a preview of the product:
            <br />
            <br />
            <span className='blue-title'>LetzChat Website Redesign</span>
            <br />
            <br />
            This is a redesign of the company website, and I have also included a side-by-side comparison of the old and new website.
            <br />
            <br />
            <span className='blue-title'>unite.mp4</span>
            <br />
            <br />
            This is a video of the chat app I worked on, which is a one-to-many app that allows a presenter to speak into their microphone and it would be able to translate their speech into text and display it on the viewer's screen translated into whatever language they selected in real-time.
            <br />
            <br />
            <span className='red-text'>The products I am not able to show, since it they are backend only and are not a visual product:</span>
            <br />
            <br />
            <span className='blue-title'>Real-time phone translation app:</span>
            <br />
            <br />
            - This app translates phone calls using speech-to-text and text-to-speech APIs.
            <br />
            <br />
            - The app would both speak the translation on the call, as well as record the conversation real-time on a transcript available for view/download.
            <br />
            <br />
            - The call can hold multiple people, but the translation is only between two of ~8 languages.
            <br />
            <br />
            - I am aware Samsung has this available this year on the new phones; however, I built this last year by myself before I knew that was in the works at Samsung.
            <br />
            <br />
            <span className='blue-title'>Translation Web Extension:</span>
            <br />
            <br />
            - This is a web extension that translates the text on the page into the language you have selected.
            <br />
            <br />
            - The extension is available to work with Chrome, Edge, Safari, and Firefox.
        </p>
      </div>
    </div>
  );
};

export default ContractProjectsBody;
