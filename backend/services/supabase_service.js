import { createClient } from '@supabase/supabase-js';
import { config } from '../config/settings.js';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export const supabaseService = {
  async saveDocument(document) {
    const { data, error } = await supabase
      .from('documents')
      .insert([document]);
    
    if (error) throw error;
    return data;
  },

  async getDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async updateDocument(id, updates) {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .match({ id });
    
    if (error) throw error;
    return data;
  }
};