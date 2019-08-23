import React from 'react';
import loaderSvg from '../../assets/loader.svg';

const containerStyles = {
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const Loader = () => {
  return (
    <div style={containerStyles}>
      <img src={loaderSvg} style={{ width: '48px' }} alt="Loading" />
    </div>
  );
};

export default Loader;