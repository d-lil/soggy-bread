import React, { useState } from "react";
import "./css/Gallery.css";

const Gallery = ({ photos, onDelete }) => {
  const [enlargedImageIndex, setEnlargedImageIndex] = useState(null);
  const [selectedForDeletion, setSelectedForDeletion] = useState(null);

  if (!photos) {
    return <div>Loading photos...</div>; // Or any other placeholder content
  }

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
      onDelete(index);
    }
    setSelectedForDeletion(null); // Reset the selection whether confirmed or not
  };

  return (
    <div className="gallery-container">
      <h1>Gallery</h1>
      {enlargedImageIndex !== null && (
        <div className="enlarged-image-container">
          <img
            src={photos[enlargedImageIndex]}
            alt={`Enlarged captured`}
            className="enlarged-image"
             // Clicking the enlarged image closes it
          />
          <button className="enlarged-close-btn" onClick={() => setEnlargedImageIndex(null)}>X</button>
        </div>
      )}
      <div className={`gallery ${enlargedImageIndex !== null ? 'blur' : ''}`}>
        {photos.map((photo, index) => (
          <div className="gallery-item" key={index}>
            <img
              src={photo}
              alt={`Captured ${index}`}
              className="gallery-image"
              onClick={() => handleImageClick(index)} // Click to enlarge image
            />
            <button onClick={() => handleDeleteButtonClick(index)} className="delete-button">Delete</button>
            
            {selectedForDeletion === index && (
              <div className="delete-confirmation">
                Delete? 
                <button onClick={() => confirmDeletion(true, index)}>Yes</button>
                <button onClick={() => confirmDeletion(false)}>No</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
