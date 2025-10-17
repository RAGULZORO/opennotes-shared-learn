// App constants
export const APP_NAME = "OpenNotes";
export const APP_DESCRIPTION = "Free Academic Notes for Everyone";

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Routes
export const ROUTES = {
  HOME: '/',
  BROWSE: '/browse',
  AUTH: '/auth',
  UPLOAD: '/upload',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
} as const;

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin',
} as const;

// Note categories
export const NOTE_CATEGORIES = {
  STUDY_MATERIAL: 'study_material',
  QUESTION_PAPER: 'question_paper',
  LAB_MANUAL: 'lab_manual',
} as const;

// Note status
export const NOTE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

