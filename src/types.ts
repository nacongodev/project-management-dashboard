export interface TeamMember {
  role: string;
  responsibilities: string[];
  icon: string;
  status: 'active' | 'idle' | 'busy';
  chatEnabled: boolean;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  needsHumanReview: boolean;
  reviewedBy?: string;
}

export interface Document {
  id: string;
  title: string;
  lastModified: Date;
  status: 'draft' | 'review' | 'approved';
  url: string;
  reviewers: string[];
  comments: Comment[];
}

export interface SprintInfo {
  number: number;
  startDate: Date;
  endDate: Date;
  goals: string[];
  ceremonies: {
    dailyStandup: string;
    review: Date;
    retrospective: Date;
  };
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'review' | 'feedback' | 'approval';
}

export interface ChatMessage {
  id: string;
  team_member_id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'human' | 'ai';
  created_at: Date;
}