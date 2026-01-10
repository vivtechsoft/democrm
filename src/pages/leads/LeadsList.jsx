import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteLead, setFilters } from '../../store/slices/leadSlice';
import { selectFilteredLeads } from '../../store/slices/leadSlice';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';

const LeadsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leads = useSelector(selectFilteredLeads);
  const { filters } = useSelector((state) => state.leads);
  
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Won' },
  ];
  
  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social', label: 'Social Media' },
    { value: 'email', label: 'Email' },
    { value: 'event', label: 'Event' },
  ];
  
  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };
  
  const handleDeleteClick = (leadId) => {
    setLeadToDelete(leadId);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (leadToDelete) {
      dispatch(deleteLead(leadToDelete));
      setSelectedLeads(selectedLeads.filter(id => id !== leadToDelete));
    }
    setShowDeleteModal(false);
    setLeadToDelete(null);
  };
  
  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };
  
  const handleBulkDelete = () => {
    selectedLeads.forEach(id => {
      dispatch(deleteLead(id));
    });
    setSelectedLeads([]);
  };
  
  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      won: 'bg-teal-100 text-teal-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600">Manage and track your sales leads</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/leads/import')}
          >
            📥 Import Leads
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/leads/new')}
          >
            + Add New Lead
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search leads..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
            >
              {sourceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => dispatch(setFilters({ status: '', source: '', search: '' }))}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-800">!</span>
              </div>
              <span className="text-yellow-800">
                {selectedLeads.length} lead(s) selected
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLeads([])}
              >
                Deselect All
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Leads Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={selectedLeads.length === leads.length && leads.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Lead</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Company</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Status</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Source</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Value</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Created</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/leads/${lead.id}`)}
                    >
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{lead.company}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize">{lead.source}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">
                      ${lead.value.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        className="p-1 text-gray-500 hover:text-primary-600"
                        title="View"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => navigate(`/leads/edit/${lead.id}`)}
                        className="p-1 text-gray-500 hover:text-green-600"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(lead.id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {leads.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.status || filters.source
                ? 'Try adjusting your filters'
                : 'Get started by adding your first lead'
              }
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/leads/new')}
            >
              + Add Your First Lead
            </Button>
          </div>
        )}
      </Card>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Lead
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete this lead? This action cannot be undone.
              </p>
            </div>
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
                Delete Lead
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
    
  );
};

export default LeadsList;