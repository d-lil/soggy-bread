// import React, { useRef, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import * as faceapi from 'face-api.js';

// const MyFaceOverlayComponent = () => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);

//   const handleVideoOnPlay = () => {
//     setInterval(async () => {
//       if (
//         webcamRef.current &&
//         webcamRef.current.video.readyState === 4
//       ) {
//         const video = webcamRef.current.video;
//         const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

//         // Get the context of the canvas
//         const ctx = canvasRef.current.getContext('2d');
//         canvasRef.current.width = video.videoWidth;
//         canvasRef.current.height = video.videoHeight;

//         // Clear the canvas
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//         // Draw detections or overlay image based on detections
//         detections.forEach(detection => {
//           // Example: draw a rectangle around detected faces
//           // You would replace this with drawing your face image
//           const { x, y, width, height } = detection.detection.box;
//           ctx.strokeStyle = "#ff0000";
//           ctx.lineWidth = 2;
//           ctx.strokeRect(x, y, width, height);
//         });
//       }
//     }, 100);
//   };

//   useEffect(() => {
//     loadModels();
//   }, []);

//   return (
//     <div>
//       <Webcam ref={webcamRef} onPlay={handleVideoOnPlay} style={{display: 'none'}} />
//       <canvas ref={canvasRef} style={{position: 'absolute', top: 0, left: 0}} />
//     </div>
//   );
// };

// export default MyFaceOverlayComponent;
