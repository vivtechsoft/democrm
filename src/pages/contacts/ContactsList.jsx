import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteContact, setCurrentContact } from '../../store/slices/contactSlice';
import { formatPhoneNumber, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';
import Modal from '../../components/common/Modal/Modal';

const ContactsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { contacts } = useSelector((state) => state.contacts);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filters
  const filters = [
    { id: 'all', label: 'All Contacts', count: contacts.length },
    { id: 'active', label: 'Active', count: contacts.filter(c => c.status === 'active').length },
    { id: 'inactive', label: 'Inactive', count: contacts.filter(c => c.status === 'inactive').length },
    { id: 'favorites', label: 'Favorites', count: contacts.filter(c => c.isFavorite).length },
    { id: 'recent', label: 'Recent', count: contacts.filter(c => 
      new Date(c.lastContacted) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length },
  ];
  
  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          contact.firstName?.toLowerCase().includes(search) ||
          contact.lastName?.toLowerCase().includes(search) ||
          contact.email?.toLowerCase().includes(search) ||
          contact.company?.toLowerCase().includes(search) ||
          contact.jobTitle?.toLowerCase().includes(search)
        );
      }
      
      // Status filter
      if (activeFilter === 'active') return contact.status === 'active';
      if (activeFilter === 'inactive') return contact.status === 'inactive';
      if (activeFilter === 'favorites') return contact.isFavorite;
      if (activeFilter === 'recent') {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(contact.lastContacted) > weekAgo;
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'company':
          aValue = a.company?.toLowerCase() || '';
          bValue = b.company?.toLowerCase() || '';
          break;
        case 'lastContacted':
          aValue = new Date(a.lastContacted);
          bValue = new Date(b.lastContacted);
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  
  const handleDeleteClick = (contactId) => {
    setContactToDelete(contactId);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (contactToDelete) {
      dispatch(deleteContact(contactToDelete));
      setSelectedContacts(selectedContacts.filter(id => id !== contactToDelete));
    }
    setShowDeleteModal(false);
    setContactToDelete(null);
  };
  
  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };
  
  const handleBulkDelete = () => {
    selectedContacts.forEach(id => {
      dispatch(deleteContact(id));
    });
    setSelectedContacts([]);
  };
  
  const handleBulkFavorite = () => {
    // In a real app, this would dispatch an action to update multiple contacts
    selectedContacts.forEach(id => {
      const contact = contacts.find(c => c.id === id);
      if (contact) {
        // Dispatch update action
      }
    });
    setSelectedContacts([]);
  };
  
  const handleExportContacts = () => {
    const selectedData = contacts.filter(contact => selectedContacts.includes(contact.id));
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Job Title', 'Status', 'Last Contacted'],
      ...selectedData.map(contact => [
        `${contact.firstName} ${contact.lastName}`,
        contact.email,
        contact.phone,
        contact.company,
        contact.jobTitle,
        contact.status,
        formatDate(contact.lastContacted),
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const handleViewContact = (contact) => {
    dispatch(setCurrentContact(contact));
    navigate(`/contacts/${contact.id}`);
  };
  
  const toggleFavorite = (contactId, e) => {
    e.stopPropagation();
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      // Dispatch update action to toggle favorite
      dispatch({
        type: 'contacts/updateContact',
        payload: { id: contactId, isFavorite: !contact.isFavorite },
      });
    }
  };
  
  // Grid View Card
  const ContactCard = ({ contact }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow relative group"
      onClick={() => handleViewContact(contact)}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => toggleFavorite(contact.id, e)}
        className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100"
      >
        <span className={`text-xl ${contact.isFavorite ? 'text-yellow-500' : 'text-gray-300'}`}>
          {contact.isFavorite ? '★' : '☆'}
        </span>
      </button>
      
      {/* Contact Avatar */}
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mr-4">
          {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {contact.firstName} {contact.lastName}
          </h3>
          <p className="text-gray-600">{contact.jobTitle}</p>
        </div>
      </div>
      
      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📧</span>
          <span className="truncate">{contact.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📱</span>
          <span>{formatPhoneNumber(contact.phone)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">🏢</span>
          <span className="truncate">{contact.company}</span>
        </div>
      </div>
      
      {/* Status & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          contact.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {contact.status === 'active' ? 'Active' : 'Inactive'}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/contacts/${contact.id}`);
            }}
            className="p-1 text-gray-500 hover:text-primary-600"
            title="View"
          >
            👁️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/contacts/edit/${contact.id}`);
            }}
            className="p-1 text-gray-500 hover:text-green-600"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(contact.id);
            }}
            className="p-1 text-gray-500 hover:text-red-600"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </Card>
  );
  
  // List View Row
  const ContactRow = ({ contact, index }) => (
    <tr 
      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
      onClick={() => handleViewContact(contact)}
    >
      <td className="py-3 px-4">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          checked={selectedContacts.includes(contact.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleSelectContact(contact.id);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-3">
            {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center">
              <p className="font-medium text-gray-900">
                {contact.firstName} {contact.lastName}
              </p>
              {contact.isFavorite && (
                <span className="ml-2 text-yellow-500">★</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{contact.jobTitle}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <span className="mr-2">📧</span>
          <span className="text-gray-900">{contact.email}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <span className="mr-2">🏢</span>
          <span className="text-gray-900">{contact.company}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <span className="mr-2">📱</span>
          <span className="text-gray-900">{formatPhoneNumber(contact.phone)}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          contact.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {contact.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {formatDate(contact.lastContacted, 'relative')}
      </td>
      <td className="py-3 px-4">
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(contact.id, e);
            }}
            className={`p-1 ${contact.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
            title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {contact.isFavorite ? '★' : '☆'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/contacts/${contact.id}`);
            }}
            className="p-1 text-gray-400 hover:text-primary-600"
            title="View"
          >
            👁️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/contacts/edit/${contact.id}`);
            }}
            className="p-1 text-gray-400 hover:text-green-600"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(contact.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">
            Manage your business contacts ({contacts.length} total)
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/contacts/import')}
          >
            📥 Import Contacts
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/contacts/new')}
          >
            + Add New Contact
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeFilter === filter.id
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
            <span className="ml-2 bg-white text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {filter.count}
            </span>
          </button>
        ))}
      </div>
      
      {/* Search and Controls */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search contacts by name, email, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon="🔍"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
                title="Grid View"
              >
                ⏹️
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
                title="List View"
              >
                📋
              </button>
            </div>
            
            {/* Sort Dropdown */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="company">Sort by Company</option>
              <option value="lastContacted">Sort by Last Contact</option>
              <option value="created">Sort by Created Date</option>
            </select>
            
            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </Card>
      
      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-800">!</span>
              </div>
              <span className="text-yellow-800">
                {selectedContacts.length} contact(s) selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedContacts([])}
              >
                Deselect All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkFavorite}
              >
                ⭐ Toggle Favorite
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportContacts}
              >
                📥 Export Selected
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleBulkDelete}
              >
                🗑️ Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Contacts Grid/List */}
      {viewMode === 'grid' ? (
        // Grid View
        filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          // Empty State for Grid
          <Card className="text-center py-12">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first contact'}
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/contacts/new')}
            >
              + Add Your First Contact
            </Button>
          </Card>
        )
      ) : (
        // List View
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Contact</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Email</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Company</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Phone</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Status</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Last Contact</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, index) => (
                  <ContactRow key={contact.id} contact={contact} index={index} />
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State for List */}
          {filteredContacts.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || activeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first contact'}
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/contacts/new')}
              >
                + Add Your First Contact
              </Button>
            </div>
          )}
        </Card>
      )}
      
      {/* Stats Summary */}
      {filteredContacts.length > 0 && (
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
              <div className="text-sm text-gray-600">Total Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {contacts.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {contacts.filter(c => c.isFavorite).length}
              </div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(contacts.map(c => c.company)).size}
              </div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl mr-4">
              📥
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Bulk Import</h4>
              <p className="text-sm text-gray-600">Import contacts from CSV</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => navigate('/contacts/import')}
          >
            Start Import
          </Button>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl mr-4">
              📧
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Email Campaign</h4>
              <p className="text-sm text-gray-600">Send emails to contacts</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => alert('Email campaign feature coming soon!')}
          >
            Create Campaign
          </Button>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl mr-4">
              📊
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Contact Reports</h4>
              <p className="text-sm text-gray-600">Generate contact insights</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => navigate('/reports/contacts')}
          >
            View Reports
          </Button>
        </Card>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contact"
        size="md"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Contact?
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this contact? This action cannot be undone.
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
              onClick={confirmDelete}
            >
              Delete Contact
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactsList;