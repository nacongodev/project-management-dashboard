import { createClient } from '@supabase/supabase-js';
import { User, UserRole, SignUpCredentials } from '../types/auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const authService = {
  async signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Email not confirmed') {
          // If email is not confirmed, try to resend the confirmation email
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email,
          });
          if (resendError) throw resendError;
        }
        throw error;
      }

      const user = data.user as User;
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  async signUp(credentials: SignUpCredentials): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name,
            role: credentials.role || 'member',
          },
        },
      });

      if (error) throw error;

      const user = data.user as User;
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async getCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        return { user: null, error: null };
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      return { user: user as User, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { user: data as User, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async resendConfirmationEmail(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Handle email confirmation and automatic login
  async handleEmailConfirmation(): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        return { user: null, error: new Error('No active session found') };
      }

      // If we have a session, the user is already logged in after email confirmation
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      return { user: user as User, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  },

  // Role-based access control
  hasPermission(user: User | null, requiredRole: UserRole): boolean {
    if (!user) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      'project_manager': 3,
      'team_lead': 2,
      'member': 1,
    };

    const userRole = user.role as UserRole;
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  },

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as User || null);
    });
  },

  isProjectManager: (user: User): boolean => {
    return user.role === 'project_manager';
  },

  isTeamLead: (user: User): boolean => {
    return user.role === 'team_lead';
  },

  isMember: (user: User): boolean => {
    return user.role === 'member';
  },
};

export default authService; 