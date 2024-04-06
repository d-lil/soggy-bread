import React from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { useRef, useCallback } from "react";
import { useState, useEffect } from "react";
import Weather from "../../components/phone/Weather";
import Camera from "../../components/phone/Camera";
import Game from "../../components/phone/Game";
import Contacts from "../../components/phone/Contacts";
import SomeApp from "../../components/phone/Shopping";
import EmailPhone from "../../components/phone/EmailPhone";
import "./css/Phone.css";
import fiveBars from "./assets/5_bars.png";
import fourBars from "./assets/4_bars.png";
import threeBars from "./assets/3_bars.png";
import twoBars from "./assets/2_bars.png";
import oneBar from "./assets/1_bar.png";
import phoneCamera from "./assets/phone_camera.png";
import Gallery from "../../components/phone/Gallery";
import cameraIcon from "./assets/camera_logo.png";
import galleryIcon from "./assets/gallery_logo.png";
import weatherIcon from "./assets/weather_logo.png";

function PhoneClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const timeString = currentTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="phone-clock">
      <p>{timeString}</p>
    </div>
  );
}

const barImages = [fiveBars, fourBars, threeBars, twoBars, oneBar];

const RandomImage = () => {
  // State to store the index of the current image
  const [imageIndex, setImageIndex] = useState(Math.floor(Math.random() * barImages.length));

  useEffect(() => {
    // Set up an interval to change the image every 5 seconds
    const intervalId = setInterval(() => {
      // Update the image index with a new random number
      setImageIndex(Math.floor(Math.random() * barImages.length));
    }, 2000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="phone-header-right">
      <img className="bars-img" src={barImages[imageIndex]} alt={`${imageIndex + 1} bars`} />
      {/* Assuming PhoneClock is another component */}
      <PhoneClock />
    </div>
  );
};

const Phone = () => {
    const [photos, setPhotos] = useState([]);

    const handleDeletePhoto = (index) => {
        setPhotos((currentPhotos) => currentPhotos.filter((_, i) => i !== index));
      };

        // Example function to simulate photo addition
  const addPhoto = (newPhoto) => {
    setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
  };

  // Load photos from localStorage when component mounts
  useEffect(() => {
    const savedPhotos = localStorage.getItem('photos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  // Save photos to localStorage whenever photos state changes
  useEffect(() => {
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [photos]);

  return (
    <div className="phone-page">
    <div className="phone-container">
      <div className="phone-bezel">
        <div className="phone-screen">
          <div className="phone-header">
            <div className="phone-header-left">
              <p>DT&T</p>
            </div>
            <div className="phone-camera">
                <img src={phoneCamera} className="phone-camera" alt="phone camera" />
            </div>
            <RandomImage />
          </div>

          <div className="phone-app-container">
            <div className="phone-weather-app">
              <Link to="weather">
                <img src={weatherIcon} alt="weather app" className="weather-logo-phone" />
                <br />
                Weather
              </Link>
            </div>
            <div className="phone-camera-app">
              <Link to="camera">
                <img src={cameraIcon} alt="folder" className="camera-logo-phone" />
                <br />
                Camera
              </Link>
            </div>
            <div className="phone-gallery-app">
              <Link to="gallery">
                <img src={galleryIcon} alt="folder" className="gallery-logo-phone" />
                <br />
                Gallery
              </Link>
            </div>
            <div className="phone-game-app">
              <Link to="game">
                <img src="" alt="game logo" className="game-logo-phone" />
                <br />
                Game
              </Link>
            </div>
            <div className="phone-email-app">
              <Link to="emailphone">
                <img src="" alt="email logo" className="email-logo-phone" />
                <br />
                Email
              </Link>
            </div>

            <Routes>
              <Route
                path="weather/*"
                element={
                  <div className="overlay-component">
                    <Weather />
                  </div>
                }
              />
              {/* <Route path="home" element={<Home />} /> */}
              <Route
                path="camera/*"
                element={
                  <div className="overlay-component">
                    <Camera setPhotos={setPhotos} onDelete={handleDeletePhoto} photos={photos} />

                  </div>
                }
              />
              <Route
                path="gallery/*"
                element={
                    <div className="overlay-component">
                        <Gallery photos={photos} onDelete={handleDeletePhoto} setPhotos={setPhotos} />
                    </div>
                }
                />
              <Route
                path="game/*"
                element={
                  <div className="overlay-component">
                    <Game />
                  </div>
                }
              />
              <Route
                path="contacts/*"
                element={
                  <div className="overlay-component">
                    <Contacts />
                  </div>
                }
              />
              <Route
                path="someapp/*"
                element={
                  <div className="overlay-component">
                    <SomeApp />
                  </div>
                }
              />
              <Route
                path="emailphone/*"
                element={
                  <div className="overlay-component">
                    <EmailPhone />
                  </div>
                }
              />
            </Routes>
          </div>
          <div className="phone-footer">
            <Link to="">□</Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Phone;
