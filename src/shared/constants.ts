export const ROUTES = {
  HOME: '/',
  BROWSE: '/browse',
  AUTH: '/auth',
  UPLOAD: '/upload',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
} as const;

export const USER_ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin',
} as const;

export const NOTE_CATEGORIES = {
  LECTURE_NOTES: 'Lecture Notes',
  QUESTION_PAPERS: 'Question Papers',
  ASSIGNMENTS: 'Assignments',
  LAB_MANUALS: 'Lab Manuals',
  REFERENCE_BOOKS: 'Reference Books',
  OTHER: 'Other',
} as const;

export const NOTE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;
