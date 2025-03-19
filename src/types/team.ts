export interface TeamMember {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  github_url?: string;
  portfolio_url?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
} 