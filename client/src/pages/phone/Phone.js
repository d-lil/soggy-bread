import React from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
// import { useRef, useCallback } from "react";
import { useState, useEffect } from "react";
import Weather from "../../components/phone/Weather";
import Camera from "../../components/phone/Camera";
import GameLoading from "../../components/phone/game/GameLoading";
import Telephone from "../../components/phone/Telephone";
import Instagram from "../../components/phone/Instagram";
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
import instagramIcon from "./assets/instagram.png";
import gameIcon from "./assets/game_logo.png";
import phoneIcon from "./assets/phone_icon.png";

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
  const [imageIndex, setImageIndex] = useState(
    Math.floor(Math.random() * barImages.length)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex(Math.floor(Math.random() * barImages.length));
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="phone-header-right">
      <img
        className="bars-img"
        src={barImages[imageIndex]}
        alt={`${imageIndex + 1} bars`}
      />
      <PhoneClock />
    </div>
  );
};

const Phone = () => {
  const [photos, setPhotos] = useState([]);

  const location = useLocation();
  const isGameRoute = location.pathname.includes("/game");

  const handleDeletePhoto = (index) => {
    setPhotos((currentPhotos) => currentPhotos.filter((_, i) => i !== index));
  };

  const addPhoto = (newPhoto) => {
    setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
  };

  useEffect(() => {
    const savedPhotos = localStorage.getItem("photos");
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("photos", JSON.stringify(photos));
  }, [photos]);

  return (
    <div className={`phone-page ${isGameRoute ? "phone-landscape" : ""}`}>
      <div className="phone-container">
        <Link to="/">
          <div className="phone-power-button"> </div>
        </Link>

        <div className="phone-bezel">
          <div className="phone-screen">
            <div className="phone-header">
              <div className="phone-header-left">
                <p>DT&T</p>
              </div>
              <div className="phone-camera">
                <img
                  src={phoneCamera}
                  className="phone-camera"
                  alt="phone camera"
                />
              </div>
              <RandomImage />
            </div>

            <div
              className={`phone-app-container ${
                isGameRoute ? "no-overflow" : ""
              }`}
            >
              <div></div>
              <div></div>
              <div></div>
              <div></div>

              <div className="phone-game-app">
                <Link to="game-loading">
                  <img
                    src={gameIcon}
                    alt="game logo"
                    className="game-logo-phone"
                  />
                  <br />
                  Hanabi's
                  <br />
                  Stalker
                </Link>
              </div>

              <div className="phone-camera-app">
                <Link to="camera">
                  <img
                    src={cameraIcon}
                    alt="folder"
                    className="camera-logo-phone"
                  />
                  <br />
                  Camera
                </Link>
              </div>

              <div className="phone-gallery-app">
                <Link to="gallery">
                  <img
                    src={galleryIcon}
                    alt="folder"
                    className="gallery-logo-phone"
                  />
                  <br />
                  Gallery
                </Link>
              </div>

              <div className="phone-telephone-app">
                <Link to="telephone">
                <div className="phone-telephone-app-img">
                  <img src={phoneIcon} alt="email logo" className="email-logo-phone" />
                </div>
                  <br />
                  Phone
                </Link>
              </div>

              <div className="phone-weather-app">
                <Link to="weather">
                  <img
                    src={weatherIcon}
                    alt="weather app"
                    className="weather-logo-phone"
                  />
                  <br />
                  Weather
                </Link>
              </div>

              <div className="phone-instagram-app">
                <Link to="instagram">
                  <img
                    src={instagramIcon}
                    alt="instagram logo"
                    className="instagram-logo-phone"
                  />
                  <br />
                  Instagram
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
                      <Camera
                        setPhotos={setPhotos}
                        onDelete={handleDeletePhoto}
                        photos={photos}
                      />
                    </div>
                  }
                />
                <Route
                  path="gallery/*"
                  element={
                    <div className="overlay-component">
                      <Gallery
                        photos={photos}
                        onDelete={handleDeletePhoto}
                        setPhotos={setPhotos}
                      />
                    </div>
                  }
                />
                <Route
                  path="game-loading/*"
                  element={
                    <div className="overlay-component">
                      <GameLoading />
                    </div>
                  }
                />

                <Route
                  path="telephone/*"
                  element={
                    <div className="overlay-component">
                      <Telephone />
                    </div>
                  }
                />
                <Route
                  path="instagram/*"
                  element={
                    <div className="overlay-component">
                      <Instagram />
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
      <div
        className={`game-instructions ${
          isGameRoute ? "show-instructions" : ""
        }`}
      >
        <h2>Instructions</h2>
        <div className="instructions-container">
        <div className="left-instructions">
          <p>"D" Key = Punch</p>
          <p>"A" Key = Kick</p>
        </div>
        <div className="right-instructions">
          <p>Space Bar = Jump</p>
          <p>Use the arrow keys to move <br /> the player left and right</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Phone;
