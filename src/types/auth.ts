export type UserRole = 'project_manager' | 'team_lead' | 'member';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in?: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export interface UserProfile {
  full_name?: string;
  avatar_url?: string;
  role?: UserRole;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface PasswordReset {
  email: string;
}

export interface PasswordUpdate {
  password: string;
} 