export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const LEAD_STATUSES = [
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'contacted', label: 'Contacted', color: 'yellow' },
  { value: 'qualified', label: 'Qualified', color: 'green' },
  { value: 'proposal', label: 'Proposal', color: 'purple' },
  { value: 'negotiation', label: 'Negotiation', color: 'orange' },
  { value: 'won', label: 'Won', color: 'teal' },
  { value: 'lost', label: 'Lost', color: 'red' },
];

export const LEAD_SOURCES = [
  'website',
  'referral',
  'social',
  'email',
  'event',
  'cold-call',
  'advertisement',
  'other',
];

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

export const PERMISSIONS = {
  VIEW_LEADS: 'view_leads',
  EDIT_LEADS: 'edit_leads',
  DELETE_LEADS: 'delete_leads',
  VIEW_CONTACTS: 'view_contacts',
  EDIT_CONTACTS: 'edit_contacts',
  DELETE_CONTACTS: 'delete_contacts',
  VIEW_REPORTS: 'view_reports',
  MANAGE_USERS: 'manage_users',
  SYSTEM_SETTINGS: 'system_settings',
};

export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.EDIT_LEADS,
    PERMISSIONS.DELETE_LEADS,
    PERMISSIONS.VIEW_CONTACTS,
    PERMISSIONS.EDIT_CONTACTS,
    PERMISSIONS.VIEW_REPORTS,
  ],
  user: [
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.EDIT_LEADS,
    PERMISSIONS.VIEW_CONTACTS,
  ],
};

export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM dd, yyyy',
  DISPLAY_DATETIME: 'MMM dd, yyyy HH:mm',
  API_DATE: 'yyyy-MM-dd',
  API_DATETIME: 'yyyy-MM-dd HH:mm:ss',
};