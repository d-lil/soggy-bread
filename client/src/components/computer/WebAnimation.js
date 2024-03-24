// import React, { useState, useEffect } from 'react';
// import spriteSheet from './path-to-your-spritesheet.png';
// import animationData from './path-to-your-animation-data.json';

// const WebAnimation = () => {
//   const [currentFrame, setCurrentFrame] = useState(0);

//   useEffect(() => {
//     const frameCount = animationData.frames.length;
//     const interval = setInterval(() => {
//       setCurrentFrame((currentFrame) => (currentFrame + 1) % frameCount);
//     }, 1000 / animationData.fps); // Update this based on your animation's FPS

//     return () => clearInterval(interval);
//   }, []);

//   const frame = animationData.frames[currentFrame];
//   const style = {
//     width: frame.sourceSize.w,
//     height: frame.sourceSize.h,
//     backgroundImage: `url(${spriteSheet})`,
//     backgroundPosition: `-${frame.frame.x}px -${frame.frame.y}px`,
//   };

//   return <div style={style} />;
// };

// export default WebAnimation;
