export interface ChatMessage {
  id: string;
  team_member_id: string;
  sender: string;
  content: string;
  type: 'human' | 'ai';
  timestamp: Date;
  created_at: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: 'active' | 'busy' | 'idle';
  description: string;
  responsibilities: string[];
  chatEnabled: boolean;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
} 