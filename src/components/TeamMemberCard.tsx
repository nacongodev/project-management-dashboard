import React from 'react';
import { User } from '../types/auth';
import { UserCircle, MoreVertical, CheckCircle, XCircle, PauseCircle } from 'lucide-react';

interface TeamMemberCardProps {
  member: User;
  onStatusChange: (memberId: string, newStatus: 'active' | 'inactive' | 'suspended') => void;
  canManage: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onStatusChange, canManage }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'inactive':
        return 'text-red-500';
      case 'suspended':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'suspended':
        return <PauseCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <UserCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.full_name}
              className="h-12 w-12 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}`;
              }}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{member.full_name}</h3>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
        </div>
        {canManage && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu">
                  <button
                    onClick={() => {
                      onStatusChange(member.id, member.status === 'active' ? 'inactive' : 'active');
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {member.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => {
                      onStatusChange(member.id, 'suspended');
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center">
          {getStatusIcon(member.status)}
          <span className={`ml-2 text-sm font-medium ${getStatusColor(member.status)}`}>
            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
          </span>
        </div>
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {member.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;