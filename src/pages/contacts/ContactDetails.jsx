import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentContact, updateContact, deleteContact } from '../../store/slices/contactSlice';
import { formatPhoneNumber, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';
import Modal from '../../components/common/Modal/Modal';

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentContact, contacts } = useSelector((state) => state.contacts);
  const { user } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      dispatch(setCurrentContact(contact));
      setEditForm({ ...contact });
    } else {
      navigate('/contacts');
    }
  }, [id, contacts, dispatch, navigate]);
  
  if (!currentContact) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact details...</p>
        </div>
      </div>
    );
  }
  
  const handleSaveEdit = () => {
    dispatch(updateContact(editForm));
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditForm({ ...currentContact });
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    dispatch(deleteContact(currentContact.id));
    navigate('/contacts');
  };
  
  const toggleFavorite = () => {
    const updatedContact = {
      ...currentContact,
      isFavorite: !currentContact.isFavorite,
    };
    dispatch(updateContact(updatedContact));
  };
  
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
  
  const mockInteractions = [
    { id: 1, type: 'email', notes: 'Sent product updates', date: '2024-01-15', user: 'Alex' },
    { id: 2, type: 'call', notes: 'Follow-up call about project', date: '2024-01-12', user: 'Maria' },
    { id: 3, type: 'meeting', notes: 'Quarterly review meeting', date: '2024-01-10', user: 'David' },
  ];
  
  const mockDocuments = [
    { id: 1, name: 'Contract_Agreement.pdf', type: 'pdf', size: '2.1 MB', date: '2024-01-05' },
    { id: 2, name: 'Meeting_Notes.docx', type: 'doc', size: '45 KB', date: '2024-01-03' },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={() => navigate('/contacts')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back to Contacts
            </button>
            <span className="text-gray-300">/</span>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? (
                <div className="flex space-x-2">
                  <Input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    placeholder="First Name"
                    className="w-32"
                  />
                  <Input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    placeholder="Last Name"
                    className="w-32"
                  />
                </div>
              ) : (
                `${currentContact.firstName} ${currentContact.lastName}`
              )}
            </h1>
            {currentContact.isFavorite && (
              <span className="text-yellow-500 text-xl">★</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">Contact ID:</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {currentContact.id.substring(0, 8)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentContact.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {currentContact.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-lg ${currentContact.isFavorite ? 'text-yellow-500 bg-yellow-50' : 'text-gray-500 hover:bg-gray-100'}`}
            title={currentContact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {currentContact.isFavorite ? '★' : '☆'}
          </button>
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
                ✏️ Edit Contact
              </Button>
              <Button variant="secondary">
                📞 Contact Now
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-2 border-b border-gray-200 pb-2">
            <TabButton id="overview" label="Overview" icon="📋" />
            <TabButton id="interactions" label="Interactions" icon="📞" count={mockInteractions.length} />
            <TabButton id="documents" label="Documents" icon="📎" count={mockDocuments.length} />
            <TabButton id="activity" label="Activity" icon="📊" />
            <TabButton id="notes" label="Notes" icon="📝" />
          </div>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{currentContact.firstName}</p>
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
                          <span className="text-gray-900 font-medium">{currentContact.email}</span>
                          <a
                            href={`mailto:${currentContact.email}`}
                            className="ml-2 text-primary-600 hover:text-primary-700"
                          >
                            ✉️
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      {isEditing ? (
                        <Input
                          value={editForm.jobTitle}
                          onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{currentContact.jobTitle}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{currentContact.lastName}</p>
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
                            {formatPhoneNumber(currentContact.phone)}
                          </span>
                          <a
                            href={`tel:${currentContact.phone}`}
                            className="ml-2 text-primary-600 hover:text-primary-700"
                          >
                            📞
                          </a>
                        </div>
                      )}
                    </div>
                    
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
                        <p className="text-gray-900 font-medium">{currentContact.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Additional Information */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <p className="text-gray-900">{currentContact.department || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Contacted
                      </label>
                      <p className="text-gray-900">
                        {formatDate(currentContact.lastContacted, 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Source
                      </label>
                      <p className="text-gray-900 capitalize">
                        {currentContact.source || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created Date
                      </label>
                      <p className="text-gray-900">
                        {formatDate(currentContact.createdAt, 'MMM dd, yyyy')}
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
                    placeholder="Add notes about this contact..."
                  />
                ) : (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {currentContact.notes || 'No notes added yet.'}
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
                <Button variant="primary" size="sm">
                  + Log Interaction
                </Button>
              </div>
              
              <div className="space-y-4">
                {mockInteractions.map((interaction) => (
                  <div key={interaction.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                        interaction.type === 'call' ? 'bg-blue-100 text-blue-600' :
                        interaction.type === 'email' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {interaction.type === 'call' ? '📞' :
                         interaction.type === 'email' ? '📧' : '🤝'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {interaction.type}
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
                {mockDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-gray-600">
                          {doc.type === 'pdf' ? '📕' : '📄'}
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
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
        
        {/* Right Column - Actions & Quick Info */}
        <div className="space-y-6">
          {/* Contact Profile */}
          <Card className="text-center">
            <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-4xl font-bold mx-auto mb-4">
              {currentContact.firstName?.charAt(0)}{currentContact.lastName?.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {currentContact.firstName} {currentContact.lastName}
            </h3>
            <p className="text-gray-600">{currentContact.jobTitle}</p>
            <p className="text-gray-500 text-sm mt-2">{currentContact.company}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${
                  currentContact.status === 'active' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {currentContact.status === 'active' ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Score</p>
                <p className="font-medium text-blue-600">85/100</p>
              </div>
            </div>
          </Card>
          
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
                📝 Create Task
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                🎁 Send Gift
              </Button>
            </div>
          </Card>
          
          {/* Contact Tags */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              <Button variant="outline" size="sm">
                + Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['VIP', 'Client', 'Partner', 'Follow-up', 'Newsletter'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
          
          {/* Related Leads */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Related Leads</h3>
              <Button variant="outline" size="sm">
                + Add
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'CRM Implementation', status: 'In Progress', value: '$25,000' },
                { name: 'Training Program', status: 'Completed', value: '$8,500' },
              ].map((lead) => (
                <div key={lead.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{lead.name}</h4>
                    <p className="text-sm text-gray-500">{lead.status}</p>
                  </div>
                  <span className="font-medium">{lead.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contact"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete {currentContact.firstName} {currentContact.lastName}?
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this contact? This action cannot be undone and will remove all associated data.
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
              Delete Contact
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactDetails;