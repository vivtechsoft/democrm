import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/slices/uiSlice';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // Check for token in URL (simulating token validation)
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      // Simulate token validation
      const isValid = urlToken.includes('reset-');
      setIsTokenValid(isValid);
      
      if (!isValid) {
        setTimeout(() => {
          navigate('/forgot-password');
        }, 3000);
      }
    } else {
      setIsTokenValid(false);
      setTimeout(() => {
        navigate('/forgot-password');
      }, 3000);
    }
  }, [searchParams, navigate]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    dispatch(setLoading(true));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would call your reset password API
      console.log('Resetting password for token:', token);
      console.log('New password:', formData.password);
      
      // Mock success response
      setSuccess(true);
      
      // Auto redirect after success
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setErrors({ submit: 'Failed to reset password. Please try again.' });
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };
  
  // Invalid token screen
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid or Expired Link
            </h2>
            <p className="text-gray-600 mb-8">
              The password reset link is invalid or has expired. 
              Please request a new password reset link.
            </p>
            <Link to="/forgot-password">
              <Button variant="primary" fullWidth>
                Request New Reset Link
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }
  
  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Password Reset Successful!
            </h2>
            <p className="text-gray-600 mb-8">
              Your password has been successfully reset. 
              You will be redirected to the login page shortly.
            </p>
            <div className="space-y-3">
              <Link to="/login">
                <Button variant="primary" fullWidth>
                  Go to Login Now
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Redirecting in 3 seconds...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  // Main reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            CRM
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Create a new password for your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="New Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoFocus
            />
            
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Password Requirements:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{formData.password.length >= 8 ? '✓' : '○'}</span>
                  At least 8 characters
                </li>
                <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{/(?=.*[a-z])/.test(formData.password) ? '✓' : '○'}</span>
                  One lowercase letter
                </li>
                <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{/(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'}</span>
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{/(?=.*\d)/.test(formData.password) ? '✓' : '○'}</span>
                  One number
                </li>
              </ul>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            Reset Password
          </Button>
          
          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              ← Back to Login
            </Link>
          </div>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Security Tips:
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Use a unique password not used elsewhere</li>
                <li>• Consider using a password manager</li>
                <li>• Enable two-factor authentication in settings</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;