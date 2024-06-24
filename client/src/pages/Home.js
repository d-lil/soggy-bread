import React from "react";
import "./css/Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import certificate from "./assets/certificate.png";
import rain from "./assets/rain.mp4";
import phoneModel from "./assets/phone_model.png";
import computerModel from "./assets/laptop_model.png";
import stickyNotes from "./assets/sticky_notes2.png";
import notepadImg from "./assets/notepad_img2.png";
import photo1 from "./assets/photo1.jpg";
import photo2 from "./assets/photo2.jpg";
import pinkPin from "./assets/pink_pin.png";
import purplePin from "./assets/purple_pin.png";

// const Toast = ({ message, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000); // Toast will auto-close after 3 seconds

//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className="toast">
//       {message}
//     </div>
//   );
// };

const Home = () => {
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isEnlargedPhoto1, setIsEnlargedPhoto1] = useState(false);
  const [isEnlargedPhoto2, setIsEnlargedPhoto2] = useState(false);
  const [showScreenSaver, setShowScreenSaver] = useState(true);
  const [computerHover, setComputerHover] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const isToastShown = localStorage.getItem("isToastShown");
    if (!isToastShown) {
      setShowToast(true);
      localStorage.setItem("isToastShown", "true");

      setTimeout(() => {
        setShowToast(false);
      }, 2500); 
    }
  }, []);

  const handleMouseOver = () => {
    setShowScreenSaver(false);
  }

  const handleMouseOut = () => {
    if (!computerHover) {
      setShowScreenSaver(false);
    }
  }

  const handleMouseOverComputer = () => {
    setComputerHover(true);
    setShowScreenSaver(false); 
  };

  const handleMouseOutComputer = () => {
    setComputerHover(false);
    setShowScreenSaver(true);
  };

  const handleEnlarge = () => {
    if (isEnlargedPhoto1 || isEnlargedPhoto2) {
      setIsEnlargedPhoto1(false);
      setIsEnlargedPhoto2(false);
    }
    setIsEnlarged(!isEnlarged);
  }

  const handleEnlargePhoto = (e) => {
    if (e.target.src.includes('photo1')) {
      if (isEnlargedPhoto2 || isEnlarged) {
        setIsEnlargedPhoto2(false); 
        setIsEnlarged(false);
      }
      setIsEnlargedPhoto1(!isEnlargedPhoto1); 
    } else if (e.target.src.includes('photo2')) {
      if (isEnlargedPhoto1 || isEnlarged) {
        setIsEnlargedPhoto1(false);
        setIsEnlarged(false);
      }
      setIsEnlargedPhoto2(!isEnlargedPhoto2); 
    }
  }
  

  useEffect(() => {
    function handleClickOutside(event) {
        const target = event.target;

        if (!target.closest('.enlargeable') && (isEnlarged || isEnlargedPhoto1 || isEnlargedPhoto2)) {
            setIsEnlarged(false);
            setIsEnlargedPhoto1(false);
            setIsEnlargedPhoto2(false);
        }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [isEnlarged, isEnlargedPhoto1, isEnlargedPhoto2]);

  return (
    <div className="room-container">
      <div className={`toast ${!showToast ? "toast-hide" : ""}`}>
        <p>Please Note - This page and its contents are designed for desktop users</p>
      </div>
    <div className="room">
      <div className={`upper-room-container ${isEnlarged ? 'upper-room-container2' : ''}`}>
        <div className={`cert-container  enlargeable ${isEnlarged ? 'cert-enlarged' : ''}`}>
          <img
            src={certificate}
            className={`certificate`}
            alt="coding certificate"
            onClick={handleEnlarge}
          />
        </div>
        <div className={`enlarged-placeholder  enlargeable ${isEnlarged ? 'is-enlarged' : ''}`}></div>
        <div className="window-container">
          <div className="window-frame">
            <div className="window">
              <div className="window-video-wrapper">
                <video autoPlay loop muted>
                  <source src={rain} type="video/mp4" />
                </video>
              </div>
            </div>

          </div>
          <div className="window-sill-1"></div>
          <div className="window-sill-2"></div>
          <div className="window-sill-shadow"></div>
        </div>

      </div>
      <div className="photo-frame-container">
          <div className={`photo-frame1 enlargeable ${isEnlargedPhoto1 ? 'photo-enlarged' : ''}`}>
            <img src={pinkPin} alt="pink pin" className="pin" />
            <img src={photo1} alt="photo1" onClick={handleEnlargePhoto} className="photo" />
          </div>
          <div className={`photo-frame2 enlargeable ${isEnlargedPhoto2 ? 'photo-enlarged' : ''}`}>
            <img src={purplePin} alt="purple pin" className="pin" />
            <img src={photo2} alt="photo2" onClick={handleEnlargePhoto} className="photo" />
          </div>
        </div>
      <div className="lower-room-container">
      <div className="phone">
             <Link to ="/phone">
              <img src={phoneModel} alt="phone model" />
             </Link>
          </div>
          <div className="computer" onMouseOver={handleMouseOverComputer} onMouseOut={handleMouseOutComputer}>
            <Link to="computer">
              <img src={computerModel} alt="computer model" />
            </Link>
           
          </div>
          <div className={`screen-saver ${showScreenSaver ? '' : 'hidden'}`} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
              {/* <video autoPlay loop muted>
                <source src={screensaver} type="video/mp4" />
              </video> */}
          </div>
        <div className="desk-top">
        <div className="desk-left"></div>
        <div className="desk">
          <img src={stickyNotes} alt="sticky notes" className="sticky-notes" />
          <img src={notepadImg} alt="notepad" className="notepad-img" />
          <div className="window-video-reflection">
              <video autoPlay loop muted>
                <source src={rain} type="video/mp4" />
              </video>
            </div>
            <div className="computer-reflection"></div>
        </div>
        <div className="desk-right"></div>
      </div>
        <div className="desk-bottom"></div>
      </div>
    </div>
    
  </div>
  );
};

export default Home;
