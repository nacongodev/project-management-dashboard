import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'project_manager' | 'team_lead' | 'member';

export interface User extends SupabaseUser {
  full_name: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
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
  role?: UserRole;
  status?: 'active' | 'inactive' | 'pending';
  avatar_url?: string;
  permissions?: string[];
}

export interface PasswordReset {
  email: string;
}

export interface PasswordUpdate {
  password: string;
} 