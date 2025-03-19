import { Crew } from 'crewai';
import { createAgents } from '../domain/agents.js';
import { createTasks } from '../domain/tasks.js';
import { supabaseService } from '../services/supabase_service.js';
import { llmService } from '../services/llm_service.js';

export class CrewManager {
  constructor() {
    this.agents = createAgents();
    this.tasks = createTasks(this.agents);
    this.crew = new Crew({
      agents: Object.values(this.agents),
      tasks: Object.values(this.tasks)
    });
  }

  async handleChatMessage(role, message) {
    try {
      const agent = this.agents[this.getAgentKey(role)];
      if (!agent) throw new Error('Agent not found');

      const response = await llmService.generateResponse(message);
      return response;
    } catch (error) {
      console.error('Chat Error:', error);
      throw error;
    }
  }

  async reviewDocument(document) {
    try {
      const result = await this.crew.executeTask(this.tasks.designTask);
      await supabaseService.updateDocument(document.id, {
        status: result.approved ? 'approved' : 'review',
        comments: [...document.comments, {
          content: result.feedback,
          author: 'AI Reviewer',
          timestamp: new Date()
        }]
      });
      return result;
    } catch (error) {
      console.error('Review Error:', error);
      throw error;
    }
  }

  getAgentKey(role) {
    const roleMap = {
      'Software Engineer': 'softwareEngineer',
      'Frontend Developer': 'frontendDev',
      'Backend Developer': 'backendDev',
      'QA Tester': 'qaTester'
    };
    return roleMap[role];
  }
}