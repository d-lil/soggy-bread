import React, { useRef, useState, useEffect } from 'react';
import './css/Camera.css';

const Camera = ({ setPhotos }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [localPhotos, setLocalPhotos] = useState([]);
  const [selectedForDeletion, setSelectedForDeletion] = useState(null);

  useEffect(() => {
    const enableStream = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    if (!stream) {
      enableStream();
    } else {
      return () => stream.getTracks().forEach(track => track.stop());
    }
  }, [stream]);

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/png');
      setLocalPhotos(prev => [...prev, imageUrl]);
      setPhotos(prev => [...prev, imageUrl]);
    }
  };

  const handleImageClick = index => setSelectedForDeletion(index);

  const confirmDeletion = (confirm, index) => {
    if (confirm) {
      setLocalPhotos(localPhotos.filter((_, i) => i !== index));
      // Optionally update the main photos state
    }
    setSelectedForDeletion(null);
  };

  return (
    <div className='camera-container'>
      <video ref={videoRef} autoPlay playsInline width="380" height="300" />
      <button onClick={takePhoto}>Take Photo</button>
      <canvas ref={canvasRef} width="380" height="300" style={{ display: 'none' }} />

      <div className="local-photos-display">
        {localPhotos.map((photo, index) => (
          <div key={index} className="local-photo-item">
            <img src={photo} alt={`Captured ${index}`} width="100" onClick={() => handleImageClick(index)} />
            {selectedForDeletion === index && (
            <div className="local-photo-delete-confirmation">
              Delete? 
              <div className="confirmation-buttons">
              <button onClick={() => confirmDeletion(true, index)} className='yes-pic-delete'>Yes</button>
              <button onClick={() => confirmDeletion(false, index)} className='no-pic-delete'>No</button>
              </div>
            </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Camera;
