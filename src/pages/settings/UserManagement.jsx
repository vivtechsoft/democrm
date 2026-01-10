import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/formatters';
import { USER_ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';
import Modal from '../../components/common/Modal/Modal';

const UserManagement = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [permissionSettings, setPermissionSettings] = useState({});
  
  // Mock user data
  const mockUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@indo-crm.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-20T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      avatar: 'https://i.pravatar.cc/150?img=1',
      department: 'Administration',
      phone: '+62123456789',
    },
    {
      id: '2',
      name: 'Sales Manager',
      email: 'manager@indo-crm.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-19T14:15:00Z',
      createdAt: '2024-01-02T00:00:00Z',
      avatar: 'https://i.pravatar.cc/150?img=2',
      department: 'Sales',
      phone: '+62123456788',
    },
    {
      id: '3',
      name: 'Sales Representative',
      email: 'sales@indo-crm.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-18T09:45:00Z',
      createdAt: '2024-01-03T00:00:00Z',
      avatar: 'https://i.pravatar.cc/150?img=3',
      department: 'Sales',
      phone: '+62123456787',
    },
    {
      id: '4',
      name: 'Marketing Specialist',
      email: 'marketing@indo-crm.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2024-01-10T11:20:00Z',
      createdAt: '2024-01-04T00:00:00Z',
      avatar: 'https://i.pravatar.cc/150?img=4',
      department: 'Marketing',
      phone: '+62123456786',
    },
    {
      id: '5',
      name: 'Support Agent',
      email: 'support@indo-crm.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-20T08:15:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      avatar: 'https://i.pravatar.cc/150?img=5',
      department: 'Support',
      phone: '+62123456785',
    },
  ];
  
  // Mock roles data
  const mockRoles = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access and management',
      userCount: 1,
      permissions: ROLE_PERMISSIONS.admin,
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Team management and reporting access',
      userCount: 1,
      permissions: ROLE_PERMISSIONS.manager,
    },
    {
      id: 'user',
      name: 'User',
      description: 'Standard user access for daily operations',
      userCount: 3,
      permissions: ROLE_PERMISSIONS.user,
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access for reporting',
      userCount: 0,
      permissions: [PERMISSIONS.VIEW_LEADS, PERMISSIONS.VIEW_CONTACTS, PERMISSIONS.VIEW_REPORTS],
    },
  ];
  
  // Mock permission groups
  const permissionGroups = [
    {
      category: 'Leads Management',
      permissions: [
        PERMISSIONS.VIEW_LEADS,
        PERMISSIONS.EDIT_LEADS,
        PERMISSIONS.DELETE_LEADS,
      ],
    },
    {
      category: 'Contacts Management',
      permissions: [
        PERMISSIONS.VIEW_CONTACTS,
        PERMISSIONS.EDIT_CONTACTS,
        PERMISSIONS.DELETE_CONTACTS,
      ],
    },
    {
      category: 'Reports & Analytics',
      permissions: [
        PERMISSIONS.VIEW_REPORTS,
      ],
    },
    {
      category: 'System Administration',
      permissions: [
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.SYSTEM_SETTINGS,
      ],
    },
  ];
  
  useEffect(() => {
    setUsers(mockUsers);
    // Initialize permission settings
    const initialSettings = {};
    mockRoles.forEach(role => {
      initialSettings[role.id] = [...role.permissions];
    });
    setPermissionSettings(initialSettings);
  }, []);
  
  const filteredUsers = users.filter(user => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.department.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
      );
    }
    return true;
  });
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };
  
  const handleAddUser = () => {
    setSelectedUser({
      id: '',
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      department: '',
      phone: '',
    });
    setEditMode(false);
    setShowUserModal(true);
  };
  
  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setEditMode(true);
    setShowUserModal(true);
  };
  
  const handleSaveUser = () => {
    if (editMode) {
      // Update existing user
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    } else {
      // Add new user
      const newUser = {
        ...selectedUser,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        avatar: `https://i.pravatar.cc/150?img=${users.length + 6}`,
      };
      setUsers([...users, newUser]);
    }
    setShowUserModal(false);
  };
  
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };
  
  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };
  
  const handleEditRole = (role) => {
    setSelectedRole({ ...role });
    setShowRoleModal(true);
  };
  
  const handleTogglePermission = (roleId, permission) => {
    setPermissionSettings(prev => {
      const rolePermissions = prev[roleId] || [];
      const newPermissions = rolePermissions.includes(permission)
        ? rolePermissions.filter(p => p !== permission)
        : [...rolePermissions, permission];
      
      return {
        ...prev,
        [roleId]: newPermissions,
      };
    });
  };
  
  const handleSaveRole = () => {
    // Update role permissions
    setShowRoleModal(false);
  };
  
  const renderUserModal = () => (
    <Modal
      isOpen={showUserModal}
      onClose={() => setShowUserModal(false)}
      title={editMode ? 'Edit User' : 'Add New User'}
      size="lg"
    >
      {selectedUser && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={selectedUser.name}
              onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
            
            <Input
              label="Email Address"
              type="email"
              value={selectedUser.email}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              placeholder="user@example.com"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                {mockRoles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedUser.status}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <Input
              label="Department"
              value={selectedUser.department}
              onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
              placeholder="Enter department"
            />
            
            <Input
              label="Phone Number"
              value={selectedUser.phone}
              onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
              placeholder="+62XXXXXXXXXX"
            />
          </div>
          
          {editMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                  ⚠️
                </div>
                <div>
                  <p className="text-sm text-yellow-800">
                    Changing user role will affect their permissions and access levels.
                    The user will need to log out and log back in for changes to take effect.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowUserModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleSaveUser}
            >
              {editMode ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
  
  const renderRoleModal = () => (
    <Modal
      isOpen={showRoleModal}
      onClose={() => setShowRoleModal(false)}
      title="Edit Role Permissions"
      size="lg"
    >
      {selectedRole && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Role Name"
              value={selectedRole.name}
              onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
              placeholder="Enter role name"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                value={selectedRole.description}
                onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                placeholder="Enter role description"
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Permissions</h4>
            <div className="space-y-6">
              {permissionGroups.map((group) => (
                <div key={group.category} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">{group.category}</h5>
                  <div className="space-y-3">
                    {group.permissions.map((permission) => (
                      <div key={permission} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-500">
                            {getPermissionDescription(permission)}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={(permissionSettings[selectedRole.id] || []).includes(permission)}
                            onChange={() => handleTogglePermission(selectedRole.id, permission)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowRoleModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleSaveRole}
            >
              Save Permissions
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
  
  const getPermissionDescription = (permission) => {
    const descriptions = {
      [PERMISSIONS.VIEW_LEADS]: 'View and access leads information',
      [PERMISSIONS.EDIT_LEADS]: 'Create, edit, and update leads',
      [PERMISSIONS.DELETE_LEADS]: 'Delete leads from the system',
      [PERMISSIONS.VIEW_CONTACTS]: 'View and access contacts information',
      [PERMISSIONS.EDIT_CONTACTS]: 'Create, edit, and update contacts',
      [PERMISSIONS.DELETE_CONTACTS]: 'Delete contacts from the system',
      [PERMISSIONS.VIEW_REPORTS]: 'Access reports and analytics',
      [PERMISSIONS.MANAGE_USERS]: 'Manage users and permissions',
      [PERMISSIONS.SYSTEM_SETTINGS]: 'Configure system settings',
    };
    return descriptions[permission] || '';
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
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage users, roles, and permissions for your CRM
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setActiveTab(activeTab === 'users' ? 'roles' : 'users')}
          >
            {activeTab === 'users' ? '⚙️ View Roles' : '👥 View Users'}
          </Button>
          {activeTab === 'users' ? (
            <Button variant="secondary" onClick={handleAddUser}>
              + Add User
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setShowRoleModal(true)}>
              + Add Role
            </Button>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <TabButton 
          id="users" 
          label="Users" 
          icon="👥" 
          count={users.length} 
        />
        <TabButton 
          id="roles" 
          label="Roles & Permissions" 
          icon="⚙️" 
          count={mockRoles.length} 
        />
        <TabButton 
          id="activity" 
          label="Activity Log" 
          icon="📋" 
        />
      </div>
      
      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder={`Search ${activeTab === 'users' ? 'users' : 'roles'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon="🔍"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {activeTab === 'users' && (
              <>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Roles</option>
                  {mockRoles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </>
            )}
            
            <Button variant="outline">
              📥 Export {activeTab === 'users' ? 'Users' : 'Roles'}
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="relative">
                {/* Status indicator */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {/* User Info */}
                <div className="flex items-center mb-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleColor(user.role)}`}>
                      {mockRoles.find(r => r.id === user.role)?.name || user.role}
                    </span>
                  </div>
                </div>
                
                {/* User Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">🏢</span>
                    <span>{user.department || 'No department'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📱</span>
                    <span>{user.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">🕒</span>
                    <span>Last login: {user.lastLogin ? formatDate(user.lastLogin, 'relative') : 'Never'}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleEditUser(user)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.status === 'active' ? '⏸️ Deactivate' : '▶️ Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.id === currentUser?.id}
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <Card className="text-center py-12">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Get started by adding your first user'
                }
              </p>
              <Button variant="primary" onClick={handleAddUser}>
                + Add Your First User
              </Button>
            </Card>
          )}
        </>
      )}
      
      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <>
          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockRoles.map((role) => (
              <Card key={role.id} className="relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-gray-600">{role.description}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {role.userCount} user{role.userCount !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {/* Permissions Preview */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.slice(0, 4).map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {permission.split('_')[0]}
                      </span>
                    ))}
                    {role.permissions.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                        +{role.permissions.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleEditRole(role)}
                    disabled={role.id === 'admin' && currentUser?.role !== 'admin'}
                  >
                    ⚙️ Edit Permissions
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    disabled={role.userCount > 0}
                    className={role.userCount > 0 ? 'text-gray-400' : 'text-red-600 hover:text-red-700'}
                  >
                    🗑️ Delete Role
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Permission Matrix */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Permission Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-sm font-medium text-gray-700 text-left">Permission</th>
                    {mockRoles.map((role) => (
                      <th key={role.id} className="py-3 px-4 text-sm font-medium text-gray-700 text-center">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.values(PERMISSIONS).map((permission) => (
                    <tr key={permission} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-500">
                            {getPermissionDescription(permission)}
                          </p>
                        </div>
                      </td>
                      {mockRoles.map((role) => (
                        <td key={`${role.id}-${permission}`} className="py-3 px-4 text-center">
                          {role.permissions.includes(permission) ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-400 rounded-full">
                              ✗
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
      
      {/* Activity Log Tab */}
      {activeTab === 'activity' && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Activity Log</h3>
            <Button variant="outline">
              📥 Export Logs
            </Button>
          </div>
          
          <div className="space-y-4">
            {[
              { user: 'Admin User', action: 'created new user', target: 'Support Agent', time: '2 hours ago' },
              { user: 'Sales Manager', action: 'updated lead status', target: 'Lead #245', time: '4 hours ago' },
              { user: 'Sales Representative', action: 'added new contact', target: 'John Doe', time: '6 hours ago' },
              { user: 'Marketing Specialist', action: 'exported report', target: 'Q4 Sales Report', time: '1 day ago' },
              { user: 'Admin User', action: 'updated role permissions', target: 'Manager Role', time: '2 days ago' },
              { user: 'Support Agent', action: 'viewed contact details', target: 'Jane Smith', time: '3 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600">👤</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  ⋮
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900">{users.length}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {new Set(users.map(u => u.role)).size}
          </div>
          <div className="text-sm text-gray-600">Roles in Use</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600">
            {mockRoles.reduce((sum, role) => sum + role.userCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Role Assignments</div>
        </Card>
      </div>
      
      {/* User Management Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl mr-4">
            💡
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Best Practices</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-medium">Principle of least privilege:</span> Assign only the permissions users need to perform their tasks.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-medium">Regular audits:</span> Review user permissions quarterly to ensure they're still appropriate.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <p className="text-gray-700">
                  <span className="font-medium">Role-based access:</span> Use roles instead of individual permissions for easier management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Modals */}
      {renderUserModal()}
      {renderRoleModal()}
    </div>
  );
};

export default UserManagement;