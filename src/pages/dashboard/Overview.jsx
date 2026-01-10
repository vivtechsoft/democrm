import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredLeads } from '../../store/slices/leadSlice';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

const Overview = () => {
  const { user } = useSelector((state) => state.auth);
  const { contacts } = useSelector((state) => state.contacts);
  const leads = useSelector(selectFilteredLeads);
  
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    totalContacts: 0,
    conversionRate: 0,
  });
  
  useEffect(() => {
    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const wonLeads = leads.filter(lead => lead.status === 'won').length;
    const conversionRate = leads.length > 0 ? (wonLeads / leads.length) * 100 : 0;
    
    setStats({
      totalLeads: leads.length,
      newLeads,
      totalContacts: contacts.length,
      conversionRate: parseFloat(conversionRate.toFixed(1)),
    });
  }, [leads, contacts]);
  
  const StatCard = ({ title, value, change, icon, color }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </Card>
  );
  
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'added a new lead', time: '2 minutes ago', icon: '➕' },
    { id: 2, user: 'Jane Smith', action: 'updated contact details', time: '15 minutes ago', icon: '✏️' },
    { id: 3, user: 'Bob Johnson', action: 'closed a deal', time: '1 hour ago', icon: '✅' },
    { id: 4, user: 'Alice Brown', action: 'scheduled a meeting', time: '2 hours ago', icon: '📅' },
    { id: 5, user: 'Charlie Wilson', action: 'imported contacts', time: '3 hours ago', icon: '📥' },
  ];
  
  const leadStatusData = [
    { status: 'New', count: leads.filter(l => l.status === 'new').length, color: 'bg-blue-500' },
    { status: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: 'bg-yellow-500' },
    { status: 'Qualified', count: leads.filter(l => l.status === 'qualified').length, color: 'bg-green-500' },
    { status: 'Proposal', count: leads.filter(l => l.status === 'proposal').length, color: 'bg-purple-500' },
    { status: 'Negotiation', count: leads.filter(l => l.status === 'negotiation').length, color: 'bg-orange-500' },
    { status: 'Won', count: leads.filter(l => l.status === 'won').length, color: 'bg-teal-500' },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Here's what's happening with your sales today.</p>
        </div>
        <Button variant="primary">
          + Add Lead
        </Button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          change={12.5}
          icon="📋"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          change={8.2}
          icon="🆕"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          change={5.7}
          icon="👥"
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change={2.3}
          icon="📈"
          color="bg-teal-100 text-teal-600"
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Status Chart */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Lead Status Distribution</h3>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
          <div className="space-y-4">
            {leadStatusData.map((item) => (
              <div key={item.status} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{item.status}</div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{
                        width: `${(item.count / leads.length) * 100 || 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-10 text-right font-medium">{item.count}</div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Button variant="outline" size="sm">
              See All
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <span>{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Recent Leads */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
          <Button variant="outline" size="sm">
            View All Leads
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Company</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Value</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Last Contact</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{lead.company}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                      ${lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${lead.status === 'qualified' ? 'bg-green-100 text-green-800' : ''}
                      ${lead.status === 'won' ? 'bg-teal-100 text-teal-800' : ''}
                    `}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">
                      ${lead.value.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Overview;    