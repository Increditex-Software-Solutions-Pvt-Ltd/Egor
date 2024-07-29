import React from 'react';

const gridStyle = {
  backgroundImage: 
    'linear-gradient(to right, rgba(204, 204, 204, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(204, 204, 204, 0.5) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
  height: '100vh',
  position: 'fixed',
  width: '100%',
  zIndex: -1,
  opacity: 0.5, // Fading effect
};

const GridBackground = () => {
  return <div style={gridStyle}></div>;
};

export default GridBackground;