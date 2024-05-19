import React, { useState, useEffect } from "react";
import "./css/Gallery.css";
import { getPhotos, deletePhoto } from "./cameraUtils/indexedDBUtils";

const Gallery = () => {
  const [enlargedImageIndex, setEnlargedImageIndex] = useState(null);
  const [selectedForDeletion, setSelectedForDeletion] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
      getPhotos().then(setPhotos);
  }, []);

  const handleImageClick = (index) => {
    setEnlargedImageIndex(index); // Enlarge the image
    setSelectedForDeletion(null); // Reset delete selection
  };

  const handleDeleteButtonClick = (index) => {
    setSelectedForDeletion(index); // Set for deletion confirmation
    setEnlargedImageIndex(null); // Reset enlarged image
  };

  const confirmDeletion = (confirm, index) => {
    if (confirm) {
      deletePhoto(photos[index].id).then(() => {
        getPhotos().then(setPhotos); // Refresh photos from IndexedDB
      });
    }
    setSelectedForDeletion(null); // Reset the selection whether confirmed or not
  };

  if (!photos.length) {
    return
  }

  return (
    <div className="gallery-container">
      <h1 className="gallery-h1">Gallery</h1>
      {enlargedImageIndex !== null && (
        <div className="enlarged-image-container">
          <img
            src={photos[enlargedImageIndex].data}
            alt={`Enlarged capture`}
            className="enlarged-image"
          />
          <button className="enlarged-close-btn" onClick={() => setEnlargedImageIndex(null)}>X</button>
        </div>
      )}
      <div className={`gallery ${enlargedImageIndex !== null ? 'blur' : ''}`}>
        {photos.map((photo, index) => (
          <div className="gallery-item" key={index}>
            <img
              src={photo.data}
              alt={`Captured ${index}`}
              className="gallery-image"
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
