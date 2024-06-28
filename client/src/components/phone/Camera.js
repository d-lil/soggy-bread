import React, { useRef, useState, useEffect } from "react";
import "./css/Camera.css";
import { addPhoto } from "./cameraUtils/indexedDBUtils";

const filters = [
  { name: "None", value: "none", className: "filter-none" },
  { name: "Grayscale", value: "grayscale(100%)", className: "filter-grayscale" },
  { name: "Sepia", value: "sepia(100%)", className: "filter-sepia" },
  { name: "Invert", value: "invert(100%)", className: "filter-invert" },
  { name: "Contrast", value: "contrast(200%)", className: "filter-contrast" },
  { name: "Bright", value: "brightness(150%)", className: "filter-bright" },
  { name: "Blur", value: "blur(2px)", className: "filter-blur" },
  { name: "Hue 1", value: "hue-rotate(90deg)", className: "filter-hue1" },
  { name: "Hue 2", value: "hue-rotate(120deg)", className: "filter-hue2" },
  { name: "Hue 3", value: "hue-rotate(240deg)", className: "filter-hue3" },
  { name: "Hue 4", value: "hue-rotate(300deg)", className: "filter-hue4" },
  { name: "Saturate", value: "saturate(200%)", className: "filter-saturate" },
];

const FilterNavigator = ({ filters, setFilter, selectedFilter }) => {
  const filterContainerRef = useRef();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScrollButtons = () => {
      const container = filterContainerRef.current;
      setCanScrollLeft(container.scrollLeft > 1);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
    };

    checkScrollButtons();

    const container = filterContainerRef.current;
    container.addEventListener('scroll', checkScrollButtons, { passive: true });

    return () => container.removeEventListener('scroll', checkScrollButtons);
  }, []);

  const scroll = (direction) => {
    const container = filterContainerRef.current;
    const scrollAmount = direction === 'left' ? -100 : 100;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="filter-navigator">
      <button
        className={`scroll-arrow left ${!canScrollLeft ? 'inactive' : ''}`}
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
      >
        ◀
      </button>
      <div ref={filterContainerRef} className="filter-container">
        {filters.map((filter, index) => (
          <button
            key={index}
            className={`filter-btn ${selectedFilter === filter.value ? 'active' : ''}`}
            onClick={() => setFilter(filter.value)}
          >
            {filter.name}
          </button>
        ))}
      </div>
      <button
        className={`scroll-arrow right ${!canScrollRight ? 'inactive' : ''}`}
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
      >
        ▶
      </button>
    </div>
  );
};

const Camera = ({ setPhotos }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [localPhotos, setLocalPhotos] = useState([]);
  const [selectedForDeletion, setSelectedForDeletion] = useState(null);
  const [filter, setFilter] = useState("none");
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const enableStream = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(newStream);
        setPermissionDenied(false);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (err) {
        console.error(err);
        setPermissionDenied(true);
      }
    };

    if (!stream) {
      enableStream();
    } else {
      return () => stream.getTracks().forEach((track) => track.stop());
    }
  }, [stream]);

  const applyFilterToCanvas = (context) => {
    context.filter = filter;
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      applyFilterToCanvas(context);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/png");
      addPhoto(imageUrl);
      setLocalPhotos((prev) => [...prev, imageUrl]);
      setPhotos((prev) => [...prev, imageUrl]);
    }
  };

  const handleImageClick = (index) => setSelectedForDeletion(index);

  const confirmDeletion = (confirm, index) => {
    if (confirm) {
      setLocalPhotos(localPhotos.filter((_, i) => i !== index));
    }
    setSelectedForDeletion(null);
  };

  return (
    <div className="camera-container">
      {permissionDenied ? (
        <div className="permission-denied-message">
          You must give camera access for this component to work properly.
        </div>
      ) : (
        <>
          <video
            style={{ filter: filter }}
            ref={videoRef}
            autoPlay
            playsInline
            width="380"
            height="300"
          />
          <button onClick={takePhoto} className="take-photo-btn">
            📷
          </button>
          <FilterNavigator filters={filters} setFilter={setFilter} selectedFilter={filter} />
          <canvas ref={canvasRef} width="380" height="300" style={{ display: "none" }} />
          <div className="local-photos-display">
            {localPhotos.map((photo, index) => (
              <div key={index} className="local-photo-item">
                <img
                  src={photo}
                  alt={`Captured ${index}`}
                  width="100"
                  onClick={() => handleImageClick(index)}
                />
                {selectedForDeletion === index && (
                  <div className="local-photo-delete-confirmation">
                    Delete?
                    <div className="confirmation-buttons">
                      <button onClick={() => confirmDeletion(true, index)} className="yes-pic-delete">
                        Yes
                      </button>
                      <button onClick={() => confirmDeletion(false, index)} className="no-pic-delete">
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Camera;
