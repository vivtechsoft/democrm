import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredLeads } from '../../store/slices/leadSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import { LineChart, BarChart, PieChart } from '../../components/ui/Charts';

const Analytics = () => {
  const { user } = useSelector((state) => state.auth);
  const { contacts } = useSelector((state) => state.contacts);
  const leads = useSelector(selectFilteredLeads);
  
  const [dateRange, setDateRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Mock data for charts
  const [analyticsData, setAnalyticsData] = useState({
    revenueData: [],
    leadData: [],
    sourceData: [],
    statusData: [],
    topProducts: [],
    teamPerformance: [],
  });
  
  useEffect(() => {
    generateMockAnalyticsData();
  }, [dateRange, leads]);
  
  const generateMockAnalyticsData = () => {
    setLoading(true);
    
    // Generate revenue data based on date range
    const revenueData = [];
    const leadData = [];
    const today = new Date();
    
    let days = 30;
    if (dateRange === 'week') days = 7;
    if (dateRange === 'quarter') days = 90;
    if (dateRange === 'year') days = 365;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate revenue data
      const baseRevenue = 1000 + Math.random() * 5000;
      const revenue = baseRevenue + (Math.sin(i) * 1000);
      
      // Generate lead data
      const baseLeads = 5 + Math.random() * 15;
      const dailyLeads = Math.floor(baseLeads + (Math.cos(i) * 5));
      
      revenueData.push({
        date: date.toISOString(),
        revenue: Math.round(revenue),
      });
      
      leadData.push({
        date: date.toISOString(),
        leads: dailyLeads,
        conversions: Math.floor(dailyLeads * (0.1 + Math.random() * 0.3)),
      });
    }
    
    // Lead sources data
    const sources = ['Website', 'Social Media', 'Email', 'Referral', 'Events', 'Ads'];
    const sourceData = sources.map(source => ({
      source,
      count: Math.floor(10 + Math.random() * 50),
      conversionRate: 10 + Math.random() * 30,
    }));
    
    // Lead status distribution
    const statuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
    const statusData = statuses.map(status => ({
      status,
      count: Math.floor(5 + Math.random() * 25),
    }));
    
    // Top products/services
    const products = ['CRM Software', 'Consulting', 'Training', 'Support', 'Integration'];
    const topProducts = products.map(product => ({
      product,
      revenue: Math.floor(5000 + Math.random() * 20000),
      growth: -20 + Math.random() * 40,
    }));
    
    // Team performance
    const teamMembers = ['Alex Johnson', 'Maria Garcia', 'David Smith', 'Sarah Wilson', 'James Brown'];
    const teamPerformance = teamMembers.map(member => ({
      name: member,
      dealsClosed: Math.floor(5 + Math.random() * 15),
      revenue: Math.floor(10000 + Math.random() * 50000),
      target: 85 + Math.random() * 15,
    }));
    
    setAnalyticsData({
      revenueData,
      leadData,
      sourceData,
      statusData,
      topProducts,
      teamPerformance,
    });
    
    setTimeout(() => setLoading(false), 500);
  };
  
  // Calculate metrics
  const totalRevenue = analyticsData.revenueData.reduce((sum, day) => sum + day.revenue, 0);
  const totalLeads = analyticsData.leadData.reduce((sum, day) => sum + day.leads, 0);
  const totalConversions = analyticsData.leadData.reduce((sum, day) => sum + day.conversions, 0);
  const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
  const avgDealSize = leads.filter(l => l.status === 'won').length > 0
    ? leads.filter(l => l.status === 'won').reduce((sum, lead) => sum + lead.value, 0) / 
      leads.filter(l => l.status === 'won').length
    : 0;
  
  const StatCard = ({ title, value, change, icon, color, prefix = '', suffix = '' }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}% vs last period
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </Card>
  );
  
  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
  
  const DateRangeButton = ({ value, label }) => (
    <button
      onClick={() => setDateRange(value)}
      className={`px-3 py-1 rounded-full text-sm ${
        dateRange === value
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Data-driven insights for your sales performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <DateRangeButton value="week" label="7D" />
            <DateRangeButton value="month" label="1M" />
            <DateRangeButton value="quarter" label="3M" />
            <DateRangeButton value="year" label="1Y" />
          </div>
          <Button variant="outline">
            📥 Export Report
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <TabButton id="overview" label="Overview" icon="📊" />
        <TabButton id="leads" label="Leads" icon="📋" />
        <TabButton id="revenue" label="Revenue" icon="💰" />
        <TabButton id="team" label="Team" icon="👥" />
        <TabButton id="sources" label="Sources" icon="🔍" />
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={totalRevenue}
              change={12.5}
              icon="💰"
              color="bg-green-100 text-green-600"
              prefix="$"
            />
            <StatCard
              title="Total Leads"
              value={totalLeads}
              change={8.2}
              icon="📋"
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              title="Conversion Rate"
              value={conversionRate.toFixed(1)}
              change={2.3}
              icon="📈"
              color="bg-purple-100 text-purple-600"
              suffix="%"
            />
            <StatCard
              title="Avg Deal Size"
              value={avgDealSize}
              change={5.7}
              icon="💎"
              color="bg-teal-100 text-teal-600"
              prefix="$"
            />
          </div>
          
          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Revenue</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <LineChart
                  data={analyticsData.revenueData}
                  title="Revenue"
                  xAxisKey="date"
                  yAxisKey="revenue"
                  color="#3b82f6"
                />
              </div>
            </Card>
            
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Lead Generation</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Leads</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Conversions</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <LineChart
                  data={analyticsData.leadData.map((day, index) => ({
                    ...day,
                    leads: day.leads,
                    conversions: day.conversions,
                  }))}
                  title="Lead Activity"
                  xAxisKey="date"
                  yAxisKey="leads"
                  color="#10b981"
                />
              </div>
            </Card>
          </div>
          
          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Lead Sources</h3>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
              <div className="h-80">
                <PieChart
                  data={analyticsData.sourceData.map(s => s.count)}
                  labels={analyticsData.sourceData.map(s => s.source)}
                  title="Lead Source Distribution"
                  height={320}
                />
              </div>
            </Card>
            
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Conversion by Source</h3>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
              <div className="h-80">
                <BarChart
                  data={analyticsData.sourceData.map(s => s.conversionRate)}
                  labels={analyticsData.sourceData.map(s => s.source)}
                  title="Conversion Rate (%)"
                  height={320}
                  horizontal={true}
                  colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']}
                />
              </div>
            </Card>
          </div>
        </>
      )}
      
      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Lead Status Distribution</h3>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
            <div className="h-96">
              <BarChart
                data={analyticsData.statusData.map(s => s.count)}
                labels={analyticsData.statusData.map(s => s.status)}
                title="Lead Status"
                height={380}
                colors={['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#f97316', '#14b8a6', '#ef4444']}
              />
            </div>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Conversion Funnel</h3>
              <div className="space-y-4">
                {[
                  { stage: 'New Leads', count: 1200, conversion: 100 },
                  { stage: 'Contacted', count: 800, conversion: 66.7 },
                  { stage: 'Qualified', count: 450, conversion: 37.5 },
                  { stage: 'Proposal Sent', count: 280, conversion: 23.3 },
                  { stage: 'Negotiation', count: 180, conversion: 15.0 },
                  { stage: 'Closed Won', count: 110, conversion: 9.2 },
                ].map((stage, index) => (
                  <div key={stage.stage} className="flex items-center">
                    <div className="w-32 text-sm text-gray-600">{stage.stage}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{stage.count}</span>
                        <span className="text-sm text-gray-500">{stage.conversion}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 rounded-full"
                          style={{ width: `${stage.conversion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Quality Score</h3>
              <div className="space-y-6">
                {[
                  { source: 'Referral', score: 92, trend: 'up' },
                  { source: 'Website Form', score: 85, trend: 'up' },
                  { source: 'Social Media', score: 78, trend: 'down' },
                  { source: 'Email Campaign', score: 72, trend: 'up' },
                  { source: 'Events', score: 65, trend: 'stable' },
                ].map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-gray-600">📊</span>
                      </div>
                      <div>
                        <p className="font-medium">{item.source}</p>
                        <p className="text-sm text-gray-500">
                          Quality Score: <span className="font-medium">{item.score}/100</span>
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      item.trend === 'up' ? 'bg-green-100 text-green-800' :
                      item.trend === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.trend === 'up' ? '↗ Improving' :
                       item.trend === 'down' ? '↘ Declining' : '→ Stable'}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Product</h3>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product) => (
                  <div key={product.product} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.product}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      product.growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.growth >= 0 ? '+' : ''}{product.growth.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue Breakdown</h3>
              <div className="h-80">
                <BarChart
                  data={[45000, 52000, 48000, 61000, 72000, 68000, 75000, 82000, 78000, 85000, 92000, 98000]}
                  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
                  title="Monthly Revenue"
                  height={320}
                  colors={Array(12).fill('#3b82f6').map((color, i) => 
                    i >= 9 ? '#1e40af' : i >= 6 ? '#2563eb' : i >= 3 ? '#3b82f6' : '#60a5fa'
                  )}
                />
              </div>
            </Card>
          </div>
          
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Forecast</h3>
            <div className="h-80">
              <LineChart
                data={[
                  { date: '2024-01', revenue: 45000 },
                  { date: '2024-02', revenue: 52000 },
                  { date: '2024-03', revenue: 48000 },
                  { date: '2024-04', revenue: 61000 },
                  { date: '2024-05', revenue: 72000 },
                  { date: '2024-06', revenue: 68000 },
                  { date: '2024-07', revenue: 75000, forecast: true },
                  { date: '2024-08', revenue: 82000, forecast: true },
                  { date: '2024-09', revenue: 90000, forecast: true },
                  { date: '2024-10', revenue: 95000, forecast: true },
                  { date: '2024-11', revenue: 100000, forecast: true },
                  { date: '2024-12', revenue: 110000, forecast: true },
                ]}
                title="Revenue Forecast"
                xAxisKey="date"
                yAxisKey="revenue"
                color="#10b981"
              />
            </div>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Actual Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Forecast</span>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Team Member</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Deals Closed</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Revenue</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Target Achievement</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Conversion Rate</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.teamPerformance.map((member) => (
                    <tr key={member.name} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600">{member.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{member.dealsClosed}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{formatCurrency(member.revenue)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${member.target}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{member.target.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">
                          {(30 + Math.random() * 20).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.target >= 100 ? 'bg-green-100 text-green-800' :
                          member.target >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {member.target >= 100 ? 'Exceeding' :
                           member.target >= 80 ? 'On Track' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h3>
              <div className="space-y-4">
                {analyticsData.teamPerformance
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={member.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center mr-3">
                          <span className={`text-lg ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            index === 2 ? 'text-orange-500' : 'text-gray-600'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.dealsClosed} deals</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(member.revenue)}</p>
                        <p className="text-sm text-green-600">+{member.target - 85}% vs target</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Distribution</h3>
              <div className="h-64">
                <PieChart
                  data={[35, 25, 20, 15, 5]}
                  labels={['Prospecting', 'Meetings', 'Follow-ups', 'Proposals', 'Admin']}
                  title="Activity Distribution"
                  height={250}
                />
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Lead Source Performance</h3>
              <Button variant="primary">
                + Add Source
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Source</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Leads</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Conversion Rate</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Avg Deal Size</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Cost per Lead</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ROI</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { source: 'Website SEO', leads: 320, conversion: 15.2, dealSize: 12500, cost: 45, roi: 278, trend: 'up' },
                    { source: 'LinkedIn Ads', leads: 180, conversion: 12.8, dealSize: 18500, cost: 120, roi: 154, trend: 'up' },
                    { source: 'Email Marketing', leads: 240, conversion: 8.5, dealSize: 8500, cost: 25, roi: 340, trend: 'stable' },
                    { source: 'Referral Program', leads: 95, conversion: 32.6, dealSize: 22500, cost: 10, roi: 2250, trend: 'up' },
                    { source: 'Google Ads', leads: 280, conversion: 9.8, dealSize: 9500, cost: 85, roi: 112, trend: 'down' },
                    { source: 'Events & Webinars', leads: 75, conversion: 21.4, dealSize: 16500, cost: 200, roi: 82, trend: 'up' },
                    { source: 'Social Media', leads: 150, conversion: 6.3, dealSize: 7500, cost: 30, roi: 250, trend: 'stable' },
                  ].map((source) => (
                    <tr key={source.source} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-gray-600">🔗</span>
                          </div>
                          <span className="font-medium">{source.source}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{source.leads}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{source.conversion}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{formatCurrency(source.dealSize)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">${source.cost}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          source.roi >= 200 ? 'text-green-600' :
                          source.roi >= 100 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {source.roi}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`flex items-center ${
                          source.trend === 'up' ? 'text-green-600' :
                          source.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <span className="mr-1">
                            {source.trend === 'up' ? '↗' :
                             source.trend === 'down' ? '↘' : '→'}
                          </span>
                          <span className="text-sm capitalize">{source.trend}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Source ROI Comparison</h3>
              <div className="h-80">
                <BarChart
                  data={[278, 154, 340, 2250, 112, 82, 250]}
                  labels={['SEO', 'LinkedIn', 'Email', 'Referral', 'Google', 'Events', 'Social']}
                  title="ROI by Source (%)"
                  height={320}
                  colors={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6']}
                />
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Marketing Channel Efficiency</h3>
              <div className="space-y-6">
                {[
                  { channel: 'Organic Search', efficiency: 92, cost: 'Low' },
                  { channel: 'Referral', efficiency: 95, cost: 'Very Low' },
                  { channel: 'Email', efficiency: 78, cost: 'Low' },
                  { channel: 'Social Media', efficiency: 65, cost: 'Medium' },
                  { channel: 'Paid Ads', efficiency: 58, cost: 'High' },
                  { channel: 'Events', efficiency: 45, cost: 'Very High' },
                ].map((channel) => (
                  <div key={channel.channel} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{channel.channel}</span>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm px-2 py-1 rounded ${
                          channel.cost === 'Very Low' ? 'bg-green-100 text-green-800' :
                          channel.cost === 'Low' ? 'bg-green-50 text-green-700' :
                          channel.cost === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          channel.cost === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Cost: {channel.cost}
                        </span>
                        <span className="font-bold">{channel.efficiency}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          channel.efficiency >= 90 ? 'bg-green-500' :
                          channel.efficiency >= 70 ? 'bg-green-400' :
                          channel.efficiency >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${channel.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {/* Insights Card */}
      <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white text-xl mr-4">
            💡
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Insights & Recommendations</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-medium">Referral program</span> shows the highest ROI (2250%). 
                  Consider increasing incentives for referrals.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-medium">Paid ads performance</span> is declining. 
                  Review ad targeting and creative strategy.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-medium">Team productivity</span> peaks mid-week. 
                  Schedule important meetings on Wednesdays and Thursdays.
                </p>
              </div>
            </div>
            <Button variant="primary" className="mt-4">
              Generate Detailed Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;