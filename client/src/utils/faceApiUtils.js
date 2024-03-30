import * as faceapi from 'face-api.js';

export const loadModels = async () => {
  const MODEL_URL = process.env.PUBLIC_URL + '/models';
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  // Load other models as needed
};
