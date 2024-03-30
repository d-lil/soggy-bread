import React, { useEffect } from 'react';
import { loadModels } from './utils/faceApiUtils';
import MyFaceOverlayComponent from './MyFaceOverlayComponent'; // Assuming you have this component

function Mirror() {
  useEffect(() => {
    loadModels().then(() => console.log("Models loaded"));
  }, []);

  return (
    <div className="App">
      <MyFaceOverlayComponent />
      {/* Other components */}
    </div>
  );
}

export default Mirror;
