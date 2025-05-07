
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roles: string; // Comma-separated string of roles
  jobTitle?: string;
  createdDate: string; // ISO date string
  updatedDate: string; // ISO date string
  lastLoginDate?: string | null; // ISO date string or null
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
}

export type UserStatus = 'Active' | 'Disabled';

export const ALL_ROLES = [
  "ROLE_USER",
  "ROLE_ADMIN",
  "ROLE_MANAGER",
  "ROLE_EDITOR",
  "ROLE_GUEST",
  "ROLE_SUPPORT",
  "ROLE_AUDITOR"
];

export interface AuditLog {
  id: string;
  timestamp: string; // ISO date string
  user: string; // email or 'system'
  action: string; // e.g., LOGIN_SUCCESS, USER_UPDATE
  details: string;
  entity: string; // e.g., User, Role
}

export interface NotificationMessage {
  id: string;
  timestamp: string; // ISO date string
  title: string;
  message: string;
  read: boolean;
  type: 'security' | 'announcement' | 'system' | 'info'; // Example types
}
