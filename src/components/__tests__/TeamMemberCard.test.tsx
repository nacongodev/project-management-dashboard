import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamMemberCard from '../TeamMemberCard';
import { User, UserRole } from '../../types/auth';

describe('TeamMemberCard', () => {
  const mockMember: User = {
    id: '1',
    email: 'test@example.com',
    role: 'member' as UserRole,
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_sign_in: new Date().toISOString(),
    status: 'active',
    permissions: ['view_analytics'],
  };

  it('renders member information correctly', () => {
    render(<TeamMemberCard member={mockMember} onStatusChange={() => {}} canManage={false} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Member')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows management options when canManage is true', () => {
    render(<TeamMemberCard member={mockMember} onStatusChange={() => {}} canManage={true} />);
    
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    
    expect(screen.getByText('Deactivate')).toBeInTheDocument();
    expect(screen.getByText('Suspend')).toBeInTheDocument();
  });

  it('does not show management options when canManage is false', () => {
    render(<TeamMemberCard member={mockMember} onStatusChange={() => {}} canManage={false} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
}); 