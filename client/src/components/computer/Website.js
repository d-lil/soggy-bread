import React from 'react';

function EmbeddedWebsite({ src, height, width }) {
  return (
    <iframe
      src={src}
      height={height}
      width={width}
      frameBorder="0"
      allowFullScreen
    ></iframe>
  );
}

export default EmbeddedWebsite;
