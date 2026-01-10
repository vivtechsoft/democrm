import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentLead, updateLead, deleteLead } from '../../store/slices/leadSlice';
import { formatCurrency, formatDate, formatPhoneNumber } from '../../utils/formatters';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';
import Modal from '../../components/common/Modal/Modal';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentLead, leads } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    type: 'call',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const lead = leads.find(l => l.id === id);
    if (lead) {
      dispatch(setCurrentLead(lead));
      setEditForm({ ...lead });
    } else {
      navigate('/leads');
    }
  }, [id, leads, dispatch, navigate]);
  
  if (!currentLead) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }
  
  const handleSaveEdit = () => {
    dispatch(updateLead(editForm));
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditForm({ ...currentLead });
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    dispatch(deleteLead(currentLead.id));
    navigate('/leads');
  };
  
  const handleAddInteraction = () => {
    if (!newInteraction.notes.trim()) return;
    
    const updatedLead = {
      ...currentLead,
      interactions: [
        ...(currentLead.interactions || []),
        {
          id: Date.now().toString(),
          type: newInteraction.type,
          notes: newInteraction.notes,
          date: newInteraction.date,
          user: user?.name || 'System',
          timestamp: new Date().toISOString(),
        },
      ],
    };
    
    dispatch(updateLead(updatedLead));
    setNewInteraction({
      type: 'call',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
  };
  
  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      won: 'bg-teal-100 text-teal-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  
  const getStatusIcon = (status) => {
    const icons = {
      new: '🆕',
      contacted: '📞',
      qualified: '✅',
      proposal: '📄',
      negotiation: '🤝',
      won: '🏆',
      lost: '❌',
    };
    return icons[status] || '📋';
  };
  
  const getSourceIcon = (source) => {
    const icons = {
      website: '🌐',
      referral: '👥',
      social: '📱',
      email: '📧',
      event: '🎪',
      'cold-call': '📞',
      advertisement: '📢',
    };
    return icons[source] || '📋';
  };
  
  const handleStatusChange = (newStatus) => {
    const updatedLead = {
      ...currentLead,
      status: newStatus,
    };
    dispatch(updateLead(updatedLead));
  };
  
  const mockInteractions = [
    {
      id: '1',
      type: 'email',
      notes: 'Sent welcome email and product catalog',
      date: '2024-01-15',
      user: 'Alex Johnson',
      timestamp: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      type: 'call',
      notes: 'Discussed requirements and scheduled demo',
      date: '2024-01-16',
      user: 'Maria Garcia',
      timestamp: '2024-01-16T14:15:00Z',
    },
    {
      id: '3',
      type: 'meeting',
      notes: 'Product demonstration via Zoom',
      date: '2024-01-18',
      user: 'David Smith',
      timestamp: '2024-01-18T11:00:00Z',
    },
  ];
  
  const interactions = currentLead.interactions || mockInteractions;
  
  const TabButton = ({ id, label, icon, count }) => (
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
      {count && (
        <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Link to="/leads" className="text-gray-500 hover:text-gray-700">
              ← Back to Leads
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? (
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="text-2xl font-bold"
                />
              ) : (
                currentLead.name
              )}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">Lead ID:</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {currentLead.id.substring(0, 8)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">Created:</span>
              <span>{formatDate(currentLead.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:text-red-700"
              >
                🗑️ Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Lead
              </Button>
              <Button variant="secondary">
                📞 Log Activity
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4 ${getStatusColor(currentLead.status)}`}>
              {getStatusIcon(currentLead.status)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lead Status</h3>
              <p className="text-gray-600">
                Current stage: <span className="capitalize font-medium">{currentLead.status}</span>
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {LEAD_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentLead.status === status.value
                    ? 'bg-white border-2 border-blue-500 text-blue-600'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lead Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-2 border-b border-gray-200 pb-2">
            <TabButton id="overview" label="Overview" icon="📋" />
            <TabButton id="interactions" label="Interactions" icon="📞" count={interactions.length} />
            <TabButton id="documents" label="Documents" icon="📎" count={3} />
            <TabButton id="notes" label="Notes" icon="📝" />
            <TabButton id="timeline" label="Timeline" icon="⏳" />
          </div>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <Button variant="outline" size="sm">
                    📋 Copy Contact
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{currentLead.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center">
                          <span className="text-gray-900 font-medium">{currentLead.email}</span>
                          <a
                            href={`mailto:${currentLead.email}`}
                            className="ml-2 text-primary-600 hover:text-primary-700"
                          >
                            ✉️
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <Input
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center">
                          <span className="text-gray-900 font-medium">
                            {formatPhoneNumber(currentLead.phone)}
                          </span>
                          <a
                            href={`tel:${currentLead.phone}`}
                            className="ml-2 text-primary-600 hover:text-primary-700"
                          >
                            📞
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      {isEditing ? (
                        <Input
                          value={editForm.company}
                          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{currentLead.company}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      {isEditing ? (
                        <Input
                          value={editForm.jobTitle || ''}
                          onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {currentLead.jobTitle || 'Not specified'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Source
                      </label>
                      {isEditing ? (
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={editForm.source}
                          onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}
                        >
                          {LEAD_SOURCES.map((source) => (
                            <option key={source} value={source}>
                              {source.charAt(0).toUpperCase() + source.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center">
                          <span className="mr-2">{getSourceIcon(currentLead.source)}</span>
                          <span className="text-gray-900 font-medium capitalize">
                            {currentLead.source}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Lead Details */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lead Value
                      </label>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(currentLead.value)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">estimated</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Probability
                      </label>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${
                              currentLead.status === 'won' ? 'bg-green-500' :
                              currentLead.status === 'lost' ? 'bg-red-500' :
                              currentLead.status === 'negotiation' ? 'bg-orange-500' :
                              currentLead.status === 'proposal' ? 'bg-purple-500' :
                              currentLead.status === 'qualified' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}
                            style={{
                              width: currentLead.status === 'new' ? '10%' :
                                     currentLead.status === 'contacted' ? '25%' :
                                     currentLead.status === 'qualified' ? '50%' :
                                     currentLead.status === 'proposal' ? '65%' :
                                     currentLead.status === 'negotiation' ? '80%' :
                                     currentLead.status === 'won' ? '100%' : '0%'
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {currentLead.status === 'new' ? '10%' :
                           currentLead.status === 'contacted' ? '25%' :
                           currentLead.status === 'qualified' ? '50%' :
                           currentLead.status === 'proposal' ? '65%' :
                           currentLead.status === 'negotiation' ? '80%' :
                           currentLead.status === 'won' ? '100%' : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned To
                      </label>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600">
                            {currentLead.assignedTo?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {currentLead.assignedTo || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Contact
                      </label>
                      <p className="text-gray-900">
                        {interactions.length > 0
                          ? formatDate(interactions[0].date)
                          : 'No contact yet'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Notes */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notes</h3>
                {isEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Add notes about this lead..."
                  />
                ) : (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {currentLead.notes || 'No notes added yet.'}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}
          
          {/* Interactions Tab */}
          {activeTab === 'interactions' && (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Interactions</h3>
                <Button variant="outline" size="sm">
                  📥 Export History
                </Button>
              </div>
              
              {/* Add Interaction Form */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Log New Interaction</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={newInteraction.type}
                        onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value })}
                      >
                        <option value="call">Phone Call</option>
                        <option value="email">Email</option>
                        <option value="meeting">Meeting</option>
                        <option value="demo">Demo</option>
                        <option value="proposal">Proposal Sent</option>
                        <option value="follow-up">Follow-up</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={newInteraction.date}
                        onChange={(e) => setNewInteraction({ ...newInteraction, date: e.target.value })}
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        variant="primary"
                        onClick={handleAddInteraction}
                        disabled={!newInteraction.notes.trim()}
                        className="w-full"
                      >
                        Log Interaction
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      value={newInteraction.notes}
                      onChange={(e) => setNewInteraction({ ...newInteraction, notes: e.target.value })}
                      placeholder="Enter interaction details..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Interactions List */}
              <div className="space-y-4">
                {interactions.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                        interaction.type === 'call' ? 'bg-blue-100 text-blue-600' :
                        interaction.type === 'email' ? 'bg-green-100 text-green-600' :
                        interaction.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {interaction.type === 'call' ? '📞' :
                         interaction.type === 'email' ? '📧' :
                         interaction.type === 'meeting' ? '🤝' : '📝'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {interaction.type === 'call' ? 'Phone Call' :
                               interaction.type === 'email' ? 'Email' :
                               interaction.type === 'meeting' ? 'Meeting' :
                               interaction.type === 'demo' ? 'Product Demo' :
                               interaction.type === 'proposal' ? 'Proposal Sent' : 'Follow-up'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              by {interaction.user} • {formatDate(interaction.date)}
                            </p>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            ⋮
                          </button>
                        </div>
                        <p className="mt-2 text-gray-700">{interaction.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                <Button variant="primary" size="sm">
                  📁 Upload Document
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Proposal_2024.pdf', type: 'pdf', size: '2.4 MB', date: '2024-01-15' },
                  { name: 'Contract_Draft.docx', type: 'doc', size: '1.8 MB', date: '2024-01-14' },
                  { name: 'Meeting_Notes.txt', type: 'txt', size: '45 KB', date: '2024-01-13' },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-gray-600">
                          {doc.type === 'pdf' ? '📕' :
                           doc.type === 'doc' ? '📄' : '📝'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        <p className="text-sm text-gray-500">
                          {doc.size} • {formatDate(doc.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-primary-600">
                        👁️
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-600">
                        📥
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Private Notes</h3>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                rows={6}
                placeholder="Add private notes about this lead..."
                defaultValue={currentLead.privateNotes || ''}
              />
              <div className="flex justify-end">
                <Button variant="primary">
                  Save Notes
                </Button>
              </div>
            </Card>
          )}
          
          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Timeline</h3>
              <div className="space-y-6">
                {[
                  { date: '2024-01-18', event: 'Product Demo', status: 'completed', user: 'David Smith' },
                  { date: '2024-01-16', event: 'Initial Call', status: 'completed', user: 'Maria Garcia' },
                  { date: '2024-01-15', event: 'Lead Created', status: 'completed', user: 'System' },
                  { date: '2024-01-20', event: 'Proposal Review', status: 'scheduled', user: 'Alex Johnson' },
                  { date: '2024-01-25', event: 'Contract Signing', status: 'pending', user: 'David Smith' },
                ].map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      {index < 4 && (
                        <div className="w-0.5 h-12 bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.event}</h4>
                          <p className="text-sm text-gray-500">by {item.user}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-3">
                            {formatDate(item.date)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'completed' ? 'bg-green-100 text-green-800' :
                            item.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
        
        {/* Right Column - Actions & Quick Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" fullWidth className="justify-start">
                📧 Send Email
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                📞 Schedule Call
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                📅 Book Meeting
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                📄 Create Proposal
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                👥 Convert to Contact
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                📊 Add to Pipeline
              </Button>
            </div>
          </Card>
          
          {/* Lead Score */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Score</h3>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">78</div>
                    <div className="text-sm text-gray-500">/100</div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary-600 border-r-primary-500 border-b-primary-400 border-l-primary-500 transform -rotate-45"></div>
              </div>
              <p className="mt-4 text-gray-600">Good lead quality score</p>
            </div>
          </Card>
          
          {/* Related Contacts */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Related Contacts</h3>
              <Button variant="outline" size="sm">
                + Add
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'John Smith', role: 'CTO', email: 'john@company.com' },
                { name: 'Sarah Wilson', role: 'Marketing Head', email: 'sarah@company.com' },
              ].map((contact) => (
                <div key={contact.email} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600">{contact.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{contact.name}</h4>
                    <p className="text-sm text-gray-500">{contact.role}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    →
                  </button>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Lead Tags */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              <Button variant="outline" size="sm">
                + Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Enterprise', 'Hot Lead', 'Tech Industry', 'Priority', 'Follow-up'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Lead"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete {currentLead.name}?
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this lead? This action cannot be undone and will permanently remove all associated data.
          </p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleDelete}
            >
              Delete Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeadDetails;