import React, { useState, useRef, useEffect } from "react";
import "./css/Gallery.css";
import { getPhotos, deletePhoto } from "./cameraUtils/indexedDBUtils";
import ghost from "./assets/ghost.png";
import noPictures from "./assets/no_pictures_text.png";

const Gallery = () => {
  const [enlargedImageIndex, setEnlargedImageIndex] = useState(null);
  const [selectedForDeletion, setSelectedForDeletion] = useState(null);
  const [photos, setPhotos] = useState([]);
  const rainContainerRef = useRef(null);
  

  useEffect(() => {
      getPhotos().then(setPhotos);
  }, []);

  useEffect(() => {
    let cleanup;
    if (!photos.length) {
      const rainContainer = rainContainerRef.current;
      if (rainContainer) {
        cleanup = startRain(rainContainer);
      }
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, [photos.length]);

  const handleImageClick = (index) => {
    setEnlargedImageIndex(index); 
    setSelectedForDeletion(null); 
  };

  const handleDeleteButtonClick = (index) => {
    setSelectedForDeletion(index); 
    setEnlargedImageIndex(null); 
  };

  const confirmDeletion = (confirm, index) => {
    if (confirm) {
      deletePhoto(photos[index].id).then(() => {
        getPhotos().then(setPhotos);
      });
    }
    setSelectedForDeletion(null); 
  };


  const startRain = (container) => {
    const raindrops = [];
    for (let i = 0; i < 50; i++) {
      const raindrop = document.createElement('div');
      raindrop.className = 'raindrop';
      raindrop.style.left = `${Math.random() * 100}%`;
      raindrop.style.animationDuration = `${Math.random() * 1 + .5}s`;
      raindrop.style.animationDelay = `${Math.random() * .5}s`;
      container.appendChild(raindrop);
      raindrops.push(raindrop);
    }

    return () => {
      raindrops.forEach(raindrop => container.removeChild(raindrop));
    };
  };

  if (!photos.length) {
    return (
      <div className="gallery-container no-images">
        <h1 className="gallery-h1">Gallery</h1>
        <div className="gallery rain">
        <div className="rain-container" ref={rainContainerRef}></div>
          {/* <div className="ghost-div"> */}
          <img src={ghost} className="ghost-img" alt="ghost image"></img>        
          {/* </div> */}
          <img src={noPictures} className="no-pic-img" alt="No pictures text"></img>
          </div>
      </div>
    );
  }

  const renderBubbles = () => {
    const bubbles = [];
    for (let i = 0; i < 50; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 1 + 3}s`,
        animationDelay: `${Math.random() * 5}s`
      };
      bubbles.push(<div key={i} className="bubble" style={style}></div>);
    }
    return bubbles;
  };

  return (
    <div className="gallery-container images-present">
      <h1 className="gallery-h1">Gallery</h1>
      {enlargedImageIndex !== null && (
        <div className="enlarged-image-container">
          <img
            src={photos[enlargedImageIndex].data}
            alt={`Enlarged capture`}
            className="enlarged-image"
          />
          <button onClick={() => setEnlargedImageIndex(null)}>&lt;</button>
        </div>
      )}
      <div className={`gallery images ${enlargedImageIndex !== null ? 'blur' : ''}`}>
        <div className="bubble-container">{renderBubbles()}</div>
        {photos.map((photo, index) => (
          <div className="gallery-item" key={index}>
            <img
              src={photo.data}
              alt={`Captured ${index}`}
              className={`gallery-image ${enlargedImageIndex !== null ? 'hidden' : ''}`}
              onClick={() => handleImageClick(index)}
            />
            <button onClick={() => handleDeleteButtonClick(index)} className="gallery-delete-button">🗑</button>
            {selectedForDeletion === index && (
              <div className="gallery-delete-confirmation">
                Delete?
                <div>
                  <button onClick={() => confirmDeletion(true, index)} className="gallery-delete-yes">Yes</button>
                  <button onClick={() => confirmDeletion(false)} className="gallery-delete-no">No</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;