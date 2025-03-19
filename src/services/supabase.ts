import { createClient } from '@supabase/supabase-js';
import { ChatMessage, TeamMember, Document } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials:', { supabaseUrl, supabaseKey });
  throw new Error('Missing Supabase credentials');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper function to handle Supabase errors
const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase error during ${operation}:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  });
  throw new Error(`Failed to ${operation}: ${error.message}`);
};

export const supabaseService = {
  // Chat Messages
  async getChatMessages(teamMemberId: string, page: number = 1, limit: number = 20): Promise<ChatMessage[]> {
    try {
      console.log('Fetching chat messages for team member:', teamMemberId, 'page:', page);
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('team_member_id', teamMemberId)
        .order('timestamp', { ascending: false })
        .range(start, end);

      if (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
      }
      
      console.log('Successfully fetched chat messages:', data.length);
      return data.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        created_at: new Date(msg.created_at)
      }));
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
      handleSupabaseError(error, 'fetch chat messages');
      return [];
    }
  },

  async saveChatMessage(message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> {
    try {
      console.log('Saving chat message:', message);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([message])
        .select()
        .single();

      if (error) {
        console.error('Error saving chat message:', error);
        throw error;
      }
      
      console.log('Successfully saved chat message:', data);
      return {
        ...data,
        timestamp: new Date(data.timestamp)
      };
    } catch (error) {
      console.error('Failed to save chat message:', error);
      handleSupabaseError(error, 'save chat message');
      throw error;
    }
  },

  // Add new function for batch saving messages
  async saveChatMessages(messages: Omit<ChatMessage, 'id'>[]): Promise<ChatMessage[]> {
    try {
      console.log('Saving chat messages:', messages.length);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(messages)
        .select();

      if (error) {
        console.error('Error saving chat messages:', error);
        throw error;
      }
      
      console.log('Successfully saved chat messages:', data.length);
      return data.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Failed to save chat messages:', error);
      handleSupabaseError(error, 'save chat messages');
      throw error;
    }
  },

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      console.log('Fetching team members');
      const { data, error } = await supabase
        .from('team_members')
        .select('*');

      if (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }
      
      console.log('Successfully fetched team members:', data.length);
      return data.map(member => ({
        ...member,
        chatEnabled: member.chat_enabled
      }));
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      handleSupabaseError(error, 'fetch team members');
      return [];
    }
  },

  async updateTeamMemberStatus(role: string, status: 'active' | 'busy' | 'idle'): Promise<void> {
    try {
      // Validate status before making the update
      if (!status || !['active', 'busy', 'idle'].includes(status)) {
        console.warn('Attempted to update team member status with invalid value:', status);
        return;
      }

      console.log('Updating team member status:', { role, status });
      const { error } = await supabase
        .from('team_members')
        .update({ status })
        .eq('role', role);

      if (error) {
        console.error('Error updating team member status:', error);
        throw error;
      }
      
      console.log('Successfully updated team member status');
    } catch (error) {
      console.error('Failed to update team member status:', error);
      handleSupabaseError(error, 'update team member status');
      throw error;
    }
  },

  // Documents
  async getDocuments(): Promise<Document[]> {
    try {
      console.log('Fetching documents');
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('last_modified', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
      
      console.log('Successfully fetched documents:', data.length);
      return data.map(doc => ({
        ...doc,
        lastModified: new Date(doc.last_modified)
      }));
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      handleSupabaseError(error, 'fetch documents');
      return [];
    }
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<void> {
    try {
      console.log('Updating document:', { id, updates });
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating document:', error);
        throw error;
      }
      
      console.log('Successfully updated document');
    } catch (error) {
      console.error('Failed to update document:', error);
      handleSupabaseError(error, 'update document');
      throw error;
    }
  },

  // Real-time subscriptions
  subscribeToChatMessages(teamMemberId: string, callback: (message: ChatMessage) => void) {
    console.log('Subscribing to chat messages for team member:', teamMemberId);
    const channel = supabase
      .channel(`chat_messages:${teamMemberId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `team_member_id=eq.${teamMemberId}`
        },
        (payload) => {
          console.log('Received new chat message:', payload);
          const newMessage = payload.new as ChatMessage;
          callback({
            ...newMessage,
            timestamp: new Date(newMessage.timestamp)
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to chat messages');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to chat messages');
        }
      });

    return {
      unsubscribe: () => {
        channel.unsubscribe();
      }
    };
  },

  subscribeToTeamMemberStatus(callback: (member: TeamMember) => void) {
    console.log('Subscribing to team member status updates');
    const channel = supabase
      .channel('team_member_status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'team_members'
        },
        (payload) => {
          console.log('Received team member status update:', payload);
          const updatedMember = payload.new as TeamMember;
          callback({
            ...updatedMember,
            chatEnabled: updatedMember.chatEnabled
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to team member status updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to team member status updates');
        }
      });

    return {
      unsubscribe: () => {
        channel.unsubscribe();
      }
    };
  },

  async generateAIResponse(message: string): Promise<string> {
    try {
      console.log('Generating AI response for message:', message);
      const { data, error } = await supabase.functions.invoke('generate-ai-response', {
        body: { message }
      });

      if (error) {
        console.error('Error generating AI response:', error);
        throw error;
      }

      return data.content;
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      handleSupabaseError(error, 'generate AI response');
      throw error;
    }
  }
};

export default supabaseService; 