import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { authService } from '../services/auth';
import { User } from '../types/auth';
import TeamMemberCard from '../components/TeamMemberCard';

export const Team: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { user: currentUser, error: userError } = await authService.getCurrentUser();
        if (userError) throw userError;
        if (currentUser) {
          setUser(currentUser);
        }

        // Fetch team members (this would be replaced with actual API call)
        const mockTeamMembers: User[] = [
          {
            id: '1',
            email: 'john@example.com',
            role: 'project_manager',
            full_name: 'John Doe',
            avatar_url: 'https://ui-avatars.com/api/?name=John+Doe',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_sign_in: new Date().toISOString(),
            status: 'active',
            permissions: ['manage_team', 'manage_projects', 'view_analytics'],
          },
          {
            id: '2',
            email: 'jane@example.com',
            role: 'team_lead',
            full_name: 'Jane Smith',
            avatar_url: 'https://ui-avatars.com/api/?name=Jane+Smith',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_sign_in: new Date().toISOString(),
            status: 'active',
            permissions: ['manage_team', 'view_analytics'],
          },
          {
            id: '3',
            email: 'bob@example.com',
            role: 'member',
            full_name: 'Bob Johnson',
            avatar_url: 'https://ui-avatars.com/api/?name=Bob+Johnson',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_sign_in: new Date().toISOString(),
            status: 'active',
            permissions: ['view_analytics'],
          },
        ];
        setTeamMembers(mockTeamMembers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (memberId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      // This would be replaced with actual API call
      setTeamMembers(prevMembers =>
        prevMembers.map(member =>
          member.id === memberId ? { ...member, status: newStatus } : member
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all team members in your organization including their name, role, and status.
            </p>
          </div>
          {authService.isProjectManager(user) && (
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
              >
                Add team member
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onStatusChange={handleStatusChange}
              canManage={authService.isProjectManager(user)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Team; 