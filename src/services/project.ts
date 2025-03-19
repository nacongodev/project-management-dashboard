import { supabase } from '../config/supabaseClient';
import { Project, CreateProjectInput, UpdateProjectInput } from '../types/project';

class ProjectService {
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getProject(id: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...input,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProject(input: UpdateProjectInput): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateProjectProgress(id: string, progress: number): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        progress,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async addProjectMember(projectId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('project_members')
      .insert([{
        project_id: projectId,
        user_id: userId,
        joined_at: new Date().toISOString(),
      }]);

    if (error) throw error;
  }

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
  }
}

export const projectService = new ProjectService(); 