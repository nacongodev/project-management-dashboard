export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  team_id?: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  budget?: number;
  start_date?: string;
  end_date?: string;
  tags?: string[];
  attachments?: string[];
  members?: string[];
}

export interface CreateProjectInput {
  name: string;
  description: string;
  status: ProjectStatus;
  due_date: string;
  team_id?: string;
  priority: 'low' | 'medium' | 'high';
  budget?: number;
  start_date?: string;
  end_date?: string;
  tags?: string[];
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
} 