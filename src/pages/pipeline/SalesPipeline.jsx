import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredLeads } from '../../store/slices/leadSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { BarChart, LineChart, PieChart } from '../../components/ui/Charts';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

const PipelineAnalytics = () => {
  const leads = useSelector(selectFilteredLeads);
  const { user } = useSelector((state) => state.auth);
  
  const [dateRange, setDateRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState({
    stagePerformance: [],
    conversionRates: [],
    velocityData: [],
    forecastData: [],
    sourcePerformance: [],
  });
  
  const pipelineStages = [
    { id: 'new', label: 'New Leads', color: '#3b82f6' },
    { id: 'contacted', label: 'Contacted', color: '#f59e0b' },
    { id: 'qualified', label: 'Qualified', color: '#10b981' },
    { id: 'proposal', label: 'Proposal', color: '#8b5cf6' },
    { id: 'negotiation', label: 'Negotiation', color: '#f97316' },
    { id: 'won', label: 'Closed Won', color: '#14b8a6' },
    { id: 'lost', label: 'Closed Lost', color: '#ef4444' },
  ];
  
  useEffect(() => {
    generateAnalyticsData();
  }, [dateRange, leads]);
  
  const generateAnalyticsData = () => {
    // Stage performance data
    const stagePerformance = pipelineStages.map(stage => ({
      stage: stage.label,
      count: leads.filter(lead => lead.status === stage.id).length,
      value: leads
        .filter(lead => lead.status === stage.id)
        .reduce((sum, lead) => sum + lead.value, 0),
      color: stage.color,
    }));
    
    // Conversion rates between stages
    const conversionRates = [
      { from: 'New', to: 'Contacted', rate: 40 },
      { from: 'Contacted', to: 'Qualified', rate: 30 },
      { from: 'Qualified', to: 'Proposal', rate: 60 },
      { from: 'Proposal', to: 'Negotiation', rate: 45 },
      { from: 'Negotiation', to: 'Won', rate: 70 },
    ];
    
    // Sales velocity data
    const velocityData = Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      avgDays: Math.floor(30 + Math.random() * 20),
      deals: Math.floor(5 + Math.random() * 10),
    }));
    
    // Forecast data
    const forecastData = Array.from({ length: 6 }, (_, i) => ({
      month: `Month ${i + 1}`,
      committed: 50000 + i * 10000,
      bestCase: 60000 + i * 12000,
      worstCase: 40000 + i * 8000,
    }));
    
    // Source performance
    const sources = ['Website', 'Referral', 'Social', 'Email', 'Events'];
    const sourcePerformance = sources.map(source => ({
      source,
      leads: Math.floor(10 + Math.random() * 50),
      value: Math.floor(50000 + Math.random() * 150000),
      conversion: 10 + Math.random() * 30,
    }));
    
    setAnalyticsData({
      stagePerformance,
      conversionRates,
      velocityData,
      forecastData,
      sourcePerformance,
    });
  };
  
  const calculateMetrics = () => {
    const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
    const wonLeads = leads.filter(lead => lead.status === 'won');
    const lostLeads = leads.filter(lead => lead.status === 'lost');
    const closedLeads = wonLeads.length + lostLeads.length;
    const winRate = closedLeads > 0 ? (wonLeads.length / closedLeads) * 100 : 0;
    
    // Average deal size
    const avgDealSize = leads.length > 0 ? totalValue / leads.length : 0;
    
    // Weighted pipeline value
    const weightedValue = leads.reduce((sum, lead) => {
      const probability = getProbability(lead.status);
      return sum + (lead.value * probability / 100);
    }, 0);
    
    // Sales cycle length (mock data)
    const avgSalesCycle = 45; // days
    
    return {
      totalValue,
      weightedValue,
      avgDealSize,
      winRate,
      avgSalesCycle,
      totalLeads: leads.length,
      wonValue: wonLeads.reduce((sum, lead) => sum + lead.value, 0),
    };
  };
  
  const getProbability = (status) => {
    switch (status) {
      case 'new': return 10;
      case 'contacted': return 25;
      case 'qualified': return 50;
      case 'proposal': return 65;
      case 'negotiation': return 80;
      case 'won': return 100;
      case 'lost': return 0;
      default: return 0;
    }
  };
  
  const metrics = calculateMetrics();
  
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
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline Analytics</h1>
          <p className="text-gray-600">Deep insights into your sales pipeline performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <DateRangeButton value="week" label="7D" />
            <DateRangeButton value="month" label="1M" />
            <DateRangeButton value="quarter" label="3M" />
            <DateRangeButton value="year" label="1Y" />
          </div>
          <Button variant="secondary">
            📥 Export Report
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Pipeline</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(metrics.totalValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">💰</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Weighted Pipeline</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(metrics.weightedValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">⚖️</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {metrics.winRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-600 text-xl">🏆</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Sales Cycle</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {metrics.avgSalesCycle} days
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">⏱️</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <TabButton id="overview" label="Overview" icon="📊" />
        <TabButton id="stages" label="Stage Analysis" icon="📋" />
        <TabButton id="conversion" label="Conversion" icon="🔄" />
        <TabButton id="forecast" label="Forecast" icon="🔮" />
        <TabButton id="velocity" label="Velocity" icon="⚡" />
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Pipeline Value by Stage</h3>
              <div className="h-80">
                <BarChart
                  data={analyticsData.stagePerformance.map(s => s.value)}
                  labels={analyticsData.stagePerformance.map(s => s.stage)}
                  title="Pipeline Value Distribution"
                  height={320}
                  colors={analyticsData.stagePerformance.map(s => s.color)}
                />
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Distribution</h3>
              <div className="h-80">
                <PieChart
                  data={analyticsData.stagePerformance.map(s => s.count)}
                  labels={analyticsData.stagePerformance.map(s => s.stage)}
                  title="Lead Count by Stage"
                  height={320}
                />
              </div>
            </Card>
          </div>
          
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Pipeline Health Score</h3>
            <div className="space-y-6">
              {[
                { metric: 'Stage Distribution', score: 85, status: 'good' },
                { metric: 'Conversion Rates', score: 72, status: 'average' },
                { metric: 'Sales Velocity', score: 90, status: 'excellent' },
                { metric: 'Pipeline Coverage', score: 65, status: 'needs-attention' },
                { metric: 'Forecast Accuracy', score: 78, status: 'good' },
              ].map((item) => (
                <div key={item.metric} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{item.metric}</span>
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm px-2 py-1 rounded ${
                        item.status === 'excellent' ? 'bg-green-100 text-green-800' :
                        item.status === 'good' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'average' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status.replace('-', ' ')}
                      </span>
                      <span className="font-bold">{item.score}/100</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.score >= 90 ? 'bg-green-500' :
                        item.score >= 80 ? 'bg-blue-500' :
                        item.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      
      {/* Stage Analysis Tab */}
      {activeTab === 'stages' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Stage Performance Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Stage</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Lead Count</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Total Value</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Avg. Value</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Avg. Days</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Conversion Rate</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Bottleneck Score</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.stagePerformance.map((stage) => {
                    const avgValue = stage.count > 0 ? stage.value / stage.count : 0;
                    const avgDays = Math.floor(5 + Math.random() * 15);
                    const conversionRate = Math.floor(30 + Math.random() * 40);
                    const bottleneckScore = Math.floor(20 + Math.random() * 80);
                    
                    return (
                      <tr key={stage.stage} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: stage.color }}
                            ></div>
                            <span className="font-medium">{stage.stage}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{stage.count}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{formatCurrency(stage.value)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{formatCurrency(avgValue)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span>{avgDays} days</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{conversionRate}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div
                                className={`h-2 rounded-full ${
                                  bottleneckScore >= 70 ? 'bg-green-500' :
                                  bottleneckScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${bottleneckScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{bottleneckScore}/100</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Stage Bottlenecks</h3>
            <div className="h-80">
              <BarChart
                data={[65, 42, 85, 30, 70, 90, 25]}
                labels={analyticsData.stagePerformance.map(s => s.stage)}
                title="Bottleneck Score by Stage"
                height={320}
                horizontal={true}
                colors={['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#0ea5e9', '#8b5cf6']}
              />
            </div>
          </Card>
        </div>
      )}
      
      {/* Conversion Tab */}
      {activeTab === 'conversion' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
            <div className="space-y-8">
              {analyticsData.conversionRates.map((conversion, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-32 text-sm text-gray-900 font-medium">{conversion.from}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-center">
                      <div className="flex-1 h-0.5 bg-gray-300"></div>
                      <div className="mx-4 flex flex-col items-center">
                        <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg">
                          {conversion.rate}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Conversion Rate</div>
                      </div>
                      <div className="flex-1 h-0.5 bg-gray-300"></div>
                    </div>
                  </div>
                  <div className="w-32 text-sm text-gray-900 font-medium text-right">{conversion.to}</div>
                </div>
              ))}
            </div>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Source Conversion Rates</h3>
              <div className="h-80">
                <BarChart
                  data={analyticsData.sourcePerformance.map(s => s.conversion)}
                  labels={analyticsData.sourcePerformance.map(s => s.source)}
                  title="Conversion Rate by Source (%)"
                  height={320}
                  horizontal={true}
                />
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Insights</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900">Best Converting Stage</h4>
                      <p className="text-sm text-green-700">
                        Negotiation to Won has the highest conversion rate at 70%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                      ⚠️
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-900">Conversion Bottleneck</h4>
                      <p className="text-sm text-yellow-700">
                        Contacted to Qualified stage needs improvement (30% conversion)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                      📊
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Top Performing Source</h4>
                      <p className="text-sm text-blue-700">
                        Referral leads convert at 45% vs website leads at 22%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {/* Forecast Tab */}
      {activeTab === 'forecast' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Forecast</h3>
            <div className="h-80">
              <LineChart
                data={analyticsData.forecastData}
                title="Revenue Forecast"
                xAxisKey="month"
                yAxisKey="committed"
                color="#3b82f6"
              />
            </div>
            <div className="mt-4 flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Committed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Best Case</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Worst Case</span>
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h4 className="font-medium text-gray-900 mb-4">Forecast Accuracy</h4>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">78%</div>
                <p className="text-sm text-gray-600 mt-2">Historical accuracy rate</p>
              </div>
            </Card>
            
            <Card>
              <h4 className="font-medium text-gray-900 mb-4">Quarterly Target</h4>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {formatCurrency(250000)}
                </div>
                <p className="text-sm text-gray-600 mt-2">Q1 2024 Target</p>
              </div>
            </Card>
            
            <Card>
              <h4 className="font-medium text-gray-900 mb-4">Pipeline Coverage</h4>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">3.2x</div>
                <p className="text-sm text-gray-600 mt-2">Pipeline to quota ratio</p>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {/* Velocity Tab */}
      {activeTab === 'velocity' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Velocity Trends</h3>
            <div className="h-80">
              <LineChart
                data={analyticsData.velocityData}
                title="Average Sales Cycle (Days)"
                xAxisKey="month"
                yAxisKey="avgDays"
                color="#8b5cf6"
              />
            </div>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <h4 className="font-medium text-gray-900 mb-4">Average Sales Cycle</h4>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">45 days</div>
                <p className="text-sm text-gray-600 mt-2">From lead to closed won</p>
              </div>
            </Card>
            
            <Card>
              <h4 className="font-medium text-gray-900 mb-4">Deal Velocity</h4>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">12 deals</div>
                <p className="text-sm text-gray-600 mt-2">Closed per month average</p>
              </div>
            </Card>
            
            <Card>
              <h4 className="font-medium text-gray-900 mb-4">Velocity Improvement</h4>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">+15%</div>
                <p className="text-sm text-gray-600 mt-2">Faster than last quarter</p>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {/* Action Items */}
      <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white text-xl mr-4">
            💡
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Pipeline Recommendations</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-medium">Bottleneck detected</span> in Contacted → Qualified stage. 
                  Consider improving qualification criteria.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-medium">Forecast accuracy</span> can be improved by updating 
                  stage probabilities based on historical data.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-medium">Referral source</span> shows highest conversion rate. 
                  Consider expanding referral program.
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <Button variant="outline">
                Generate Action Plan
              </Button>
              <Button variant="primary">
                Schedule Pipeline Review
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PipelineAnalytics;