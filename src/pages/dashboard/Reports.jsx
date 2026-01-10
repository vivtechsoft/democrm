import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');
  
  const reports = [
    {
      id: 'sales',
      title: 'Sales Performance Report',
      description: 'Monthly sales performance with trends and forecasts',
      lastGenerated: '2024-01-15',
      schedule: 'Monthly',
      icon: '📊',
    },
    {
      id: 'leads',
      title: 'Lead Generation Report',
      description: 'Lead sources, conversion rates, and pipeline analysis',
      lastGenerated: '2024-01-14',
      schedule: 'Weekly',
      icon: '📋',
    },
    {
      id: 'team',
      title: 'Team Performance Report',
      description: 'Individual and team performance metrics',
      lastGenerated: '2024-01-13',
      schedule: 'Monthly',
      icon: '👥',
    },
    {
      id: 'revenue',
      title: 'Revenue Analysis Report',
      description: 'Revenue breakdown by product, region, and customer',
      lastGenerated: '2024-01-12',
      schedule: 'Quarterly',
      icon: '💰',
    },
    {
      id: 'marketing',
      title: 'Marketing ROI Report',
      description: 'Marketing channel performance and ROI analysis',
      lastGenerated: '2024-01-11',
      schedule: 'Monthly',
      icon: '🎯',
    },
    {
      id: 'customers',
      title: 'Customer Health Report',
      description: 'Customer satisfaction, retention, and churn analysis',
      lastGenerated: '2024-01-10',
      schedule: 'Quarterly',
      icon: '❤️',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and manage analytical reports</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            ⚙️ Report Settings
          </Button>
          <Button variant="primary">
            📄 Generate New Report
          </Button>
        </div>
      </div>
      
      {/* Report Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card
            key={report.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              activeReport === report.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setActiveReport(report.id)}
          >
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-xl mr-3">
                {report.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-600">Last generated:</p>
                <p className="font-medium">{report.lastGenerated}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Schedule:</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {report.schedule}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Generating ${report.title}...`);
                }}
              >
                Generate Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Report Preview */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {reports.find(r => r.id === activeReport)?.title} Preview
          </h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              📥 Download PDF
            </Button>
            <Button variant="outline" size="sm">
              📊 Export Data
            </Button>
            <Button variant="primary" size="sm">
              ✏️ Customize
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">📈</div>
          <h4 className="text-xl font-medium text-gray-900 mb-2">
            Report Preview
          </h4>
          <p className="text-gray-600 mb-6">
            This is a preview of the selected report. Click "Generate Now" to create the full report.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary-600">42%</div>
              <div className="text-sm text-gray-600">Growth</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">$125K</div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-gray-600">Target</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-900">Report Details</h4>
              <p className="text-sm text-gray-600">
                Generated automatically based on your schedule
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                🗑️ Delete Report
              </Button>
              <Button variant="primary">
                🔄 Schedule Report
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;