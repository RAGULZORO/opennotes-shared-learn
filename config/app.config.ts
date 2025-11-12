import { ROUTES, USER_ROLES, NOTE_CATEGORIES, NOTE_STATUS } from '../src/shared/constants';

export const appConfig = {
  name: 'OpenNotes',
  description: 'Free Academic Notes for Everyone',
  version: '1.0.0',
  routes: ROUTES,
  userRoles: USER_ROLES,
  noteCategories: NOTE_CATEGORIES,
  noteStatus: NOTE_STATUS,
  features: {
    authentication: true,
    fileUpload: true,
    adminPanel: true,
    roleManagement: true,
  },
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt'],
    maxNotesPerUser: 100,
  },
} as const;

