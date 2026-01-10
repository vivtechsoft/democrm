// src/pages/settings/IntegrationSettings.jsx
import React, { useState } from 'react';

const IntegrationSettings = () => {
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Mailchimp', status: 'connected', description: 'Email marketing', icon: '📧' },
    { id: 2, name: 'HubSpot', status: 'disconnected', description: 'CRM platform', icon: '🚀' },
    { id: 3, name: 'Slack', status: 'pending', description: 'Team communication', icon: '💬' },
    { id: 4, name: 'Stripe', status: 'connected', description: 'Payment processing', icon: '💳' },
  ]);

  const handleConnect = (id) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id ? { ...integration, status: 'connected' } : integration
    ));
  };

  const handleDisconnect = (id) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id ? { ...integration, status: 'disconnected' } : integration
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integration Settings</h1>
        <p className="text-gray-600">Connect and manage third-party services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-2xl">{integration.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-600">{integration.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                integration.status === 'connected'
                  ? 'bg-green-100 text-green-800'
                  : integration.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {integration.status}
              </span>
            </div>

            <div className="flex space-x-2">
              {integration.status === 'connected' ? (
                <>
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Configure
                  </button>
                  <button 
                    onClick={() => handleDisconnect(integration.id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleConnect(integration.id)}
                  className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationSettings;