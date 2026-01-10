import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';

const CompanySettings = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Indo-CRM Inc.',
    email: 'info@indo-crm.com',
    phone: '+62123456789',
    address: 'Jl. Sudirman No. 123',
    city: 'Jakarta',
    country: 'Indonesia',
    website: 'https://indo-crm.com',
    taxId: '123456789012345',
    industry: 'Software & Technology',
    founded: '2023',
    employees: '50-100',
  });
  
  const [branding, setBranding] = useState({
    logo: 'https://via.placeholder.com/150x50',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    fontFamily: 'Inter',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    currency: 'IDR',
    language: 'id',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = () => {
    setIsEditing(false);
    // In real app, save to backend
    alert('Settings saved successfully!');
  };
  
  const handleReset = () => {
    // Reset to original values
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
          <p className="text-gray-600">Manage your company information and branding</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              ✏️ Edit Settings
            </Button>
          )}
        </div>
      </div>
      
      {/* Company Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            value={companyInfo.name}
            onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
            disabled={!isEditing}
          />
          
          <Input
            label="Email Address"
            type="email"
            value={companyInfo.email}
            onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
            disabled={!isEditing}
          />
          
          <Input
            label="Phone Number"
            value={companyInfo.phone}
            onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
            disabled={!isEditing}
          />
          
          <Input
            label="Website"
            value={companyInfo.website}
            onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
            disabled={!isEditing}
          />
          
          <Input
            label="Address"
            value={companyInfo.address}
            onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
            disabled={!isEditing}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={companyInfo.city}
              onChange={(e) => setCompanyInfo({ ...companyInfo, city: e.target.value })}
              disabled={!isEditing}
            />
            
            <Input
              label="Country"
              value={companyInfo.country}
              onChange={(e) => setCompanyInfo({ ...companyInfo, country: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          
          <Input
            label="Tax ID"
            value={companyInfo.taxId}
            onChange={(e) => setCompanyInfo({ ...companyInfo, taxId: e.target.value })}
            disabled={!isEditing}
          />
          
          <Input
            label="Industry"
            value={companyInfo.industry}
            onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </Card>
      
      {/* Branding & Preferences */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Branding & Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <img
                  src={branding.logo}
                  alt="Company Logo"
                  className="max-w-full max-h-full"
                />
              </div>
              <Button variant="outline" disabled={!isEditing}>
                Upload New Logo
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    disabled={!isEditing}
                    className="w-10 h-10 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-700">{branding.primaryColor}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                    disabled={!isEditing}
                    className="w-10 h-10 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-700">{branding.secondaryColor}</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={branding.timezone}
                onChange={(e) => setBranding({ ...branding, timezone: e.target.value })}
                disabled={!isEditing}
              >
                <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Format
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={branding.dateFormat}
              onChange={(e) => setBranding({ ...branding, dateFormat: e.target.value })}
              disabled={!isEditing}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={branding.currency}
              onChange={(e) => setBranding({ ...branding, currency: e.target.value })}
              disabled={!isEditing}
            >
              <option value="IDR">Indonesian Rupiah (IDR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="SGD">Singapore Dollar (SGD)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={branding.language}
              onChange={(e) => setBranding({ ...branding, language: e.target.value })}
              disabled={!isEditing}
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={branding.fontFamily}
              onChange={(e) => setBranding({ ...branding, fontFamily: e.target.value })}
              disabled={!isEditing}
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Company Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900">{companyInfo.founded}</div>
          <div className="text-sm text-gray-600">Year Founded</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600">{companyInfo.employees}</div>
          <div className="text-sm text-gray-600">Employees</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600">5</div>
          <div className="text-sm text-gray-600">Active Departments</div>
        </Card>
      </div>
      
      {/* Export Settings */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Export Company Data</h3>
            <p className="text-gray-600">Download your company information and settings</p>
          </div>
          <Button variant="outline">
            📥 Export Company Data
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CompanySettings;