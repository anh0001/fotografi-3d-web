import React from 'react';
import PropTypes from 'prop-types';
import { LoadScript } from '@react-google-maps/api';

function GoogleMapWrapper(props) {
  const { children } = props;
  return (
    <LoadScript
      {...props}
      googleMapsApiKey="AIzaSyBFoBKkjJgxwE74vzE2Jeag1dl03cNFrKA"
    >
      {children}
    </LoadScript>
  );
}

GoogleMapWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default GoogleMapWrapper;
