import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl mb-8">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link to="/dashboard">
            <Button variant="primary" fullWidth>
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" fullWidth>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;