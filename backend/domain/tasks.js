import { Task } from 'crewai';

export const createTasks = (agents) => {
  const designTask = new Task({
    description: 'Create system architecture and technical specifications',
    agent: agents.softwareEngineer,
    context: 'Design the overall system architecture and document technical requirements'
  });

  const frontendTask = new Task({
    description: 'Implement user interface components',
    agent: agents.frontendDev,
    context: 'Develop React components based on technical specifications'
  });

  const backendTask = new Task({
    description: 'Develop API endpoints and database schema',
    agent: agents.backendDev,
    context: 'Create REST APIs and manage data persistence'
  });

  const testingTask = new Task({
    description: 'Create and execute test cases',
    agent: agents.qaTester,
    context: 'Write automated tests for frontend and backend components'
  });

  return {
    designTask,
    frontendTask,
    backendTask,
    testingTask
  };
};