import React, { useState } from "react";
import "./css/Gallery.css";

const Gallery = ({ photos, onDelete }) => {

  const [selectedForDeletion, setSelectedForDeletion] = useState(null);


  if (!photos) {
    return <div>Loading photos...</div>; // Or any other placeholder content
  }

  const handleImageClick = (index) => {
    // Set the selected image index
    setSelectedForDeletion(index);
  };

  const confirmDeletion = (confirm, index) => {
    if (confirm) {
      onDelete(index);
    }
    setSelectedForDeletion(null); // Reset the selection whether confirmed or not
  };

  return (
    <div>
      <h1>Gallery</h1>
      <div className="gallery">
        {photos.map((photo, index) => (
          <div className="gallery-item" key={index}>
            <img
              src={photo}
              alt={`Captured ${index}`}
              width="100"
              onClick={() => handleImageClick(index)} // Handle click to prompt for deletion
            />
            {selectedForDeletion === index && (
              <div className="photo-delete-confirmation">
                Delete? 
                <div className="photo-delete-confirmation-buttons">
                <button onClick={() => confirmDeletion(true, index)} className="yes-pic-delete">Yes</button>
                <button onClick={() => confirmDeletion(false)} className="no-pic-delete">No</button>
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
