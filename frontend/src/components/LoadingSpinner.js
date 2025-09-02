import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="text-center my-4">
    <Spinner animation="border" role="status" className="me-2" />
    <span>{text}</span>
  </div>
);

export default LoadingSpinner;