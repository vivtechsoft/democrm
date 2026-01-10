import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await dispatch(login(credentials));
    
    if (result?.success) {
      navigate('/dashboard');
    }
  };
  
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };
  
  const demoAccounts = [
    { email: 'admin@indo-crm.com', password: 'admin123', role: 'Admin' },
    { email: 'manager@indo-crm.com', password: 'manager123', role: 'Manager' },
    { email: 'user@indo-crm.com', password: 'user123', role: 'User' },
  ];
  
  const useDemoAccount = (email, password) => {
    setCredentials({ email, password });
    setTimeout(() => {
      document.getElementById('login-form').dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-stretch">
        {/* Left side - Branding */}
        <div className="hidden md:block">
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden h-full">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">CRM</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">IndoCRM</h1>
                    <p className="text-gray-300 text-sm">Enterprise Edition</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  PREMIUM
                </div>
              </div>
            </div>
            
            {/* Banner Tagline */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Elevate Your Customer Relationships to New Heights
              </h2>
            </div>
            
            {/* Content Area */}
            <div className="p-8 h-[calc(100%-136px)] flex flex-col">
              {/* Logo Section */}
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    CRM
                  </span>
                </div>
                <div className="ml-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Indo<span className="text-gray-700">CRM</span>
                  </h1>
                  <p className="text-gray-500 text-sm">All-in-One CRM Solution</p>
                </div>
              </div>
              
              {/* Features */}
              <div className="space-y-6 flex-grow">
                <div className="flex items-start p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Intelligent Lead Management</h3>
                    <p className="text-sm text-gray-600 mt-1">Automated lead scoring and intelligent routing</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Advanced Analytics</h3>
                    <p className="text-sm text-gray-600 mt-1">Real-time insights with predictive analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Team Collaboration</h3>
                    <p className="text-sm text-gray-600 mt-1">Seamless communication and workflow management</p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Trusted by 5000+ businesses
                  </div>
                  <div className="flex items-center">
                    <div className="flex space-x-1 mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Login Form */}
        <div className="flex justify-center">
          <div className="relative max-w-md w-full h-full">
            {/* Floating card effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white rounded-3xl shadow-xl transform rotate-1 -z-10"></div>
            
            <Card className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden h-full flex flex-col">
              {/* Card header with gradient */}
              <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 px-10 pt-10 pb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      CRM
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600 font-light">
                    Enter your credentials to access your dashboard
                  </p>
                </div>
              </div>
              
              {/* Card body */}
              <div className="px-10 py-8 flex-grow">
                <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={handleChange}
                      error={errors.email}
                      className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
                      icon={
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      }
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={handleChange}
                      error={errors.password}
                      className="bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
                      icon={
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      }
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="remember"
                          className="w-4 h-4 text-gray-700 border-gray-300 rounded focus:ring-gray-200"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                          Remember me
                        </label>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isLoading}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Link
                        to="/register"
                        className="font-semibold text-gray-900 hover:text-gray-700 transition-colors border-b border-transparent hover:border-gray-900"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                </form>
                
                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Demo Accounts
                    </span>
                  </div>
                </div>
                
                {/* Demo Accounts */}
                <div className="space-y-3">
                  {demoAccounts.map((account, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => useDemoAccount(account.email, account.password)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-gray-300 rounded-xl hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                          index === 0 ? 'bg-blue-50 text-blue-600' :
                          index === 1 ? 'bg-green-50 text-green-600' :
                          'bg-purple-50 text-purple-600'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900 group-hover:text-gray-700">
                            {account.role} Account
                          </p>
                          <p className="text-sm text-gray-500 group-hover:text-gray-600">
                            {account.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Click any demo account to auto-fill and login instantly
                </p>
              </div>
            </Card>
            
            {/* Security note */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center text-xs text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Enterprise-grade security & encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;