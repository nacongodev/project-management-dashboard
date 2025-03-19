import { Agent } from 'crewai';

export const createAgents = () => {
  const softwareEngineer = new Agent({
    name: 'Software Engineer',
    role: 'System Architect',
    goalDescription: 'Design and maintain system architecture, create technical specifications',
    backstory: 'Expert software architect with extensive experience in system design',
    allowDelegation: true
  });

  const frontendDev = new Agent({
    name: 'Frontend Developer',
    role: 'UI Developer',
    goalDescription: 'Implement user interfaces and integrate with backend APIs',
    backstory: 'Specialized in React and modern frontend technologies',
    allowDelegation: true
  });

  const backendDev = new Agent({
    name: 'Backend Developer',
    role: 'API Developer',
    goalDescription: 'Develop robust APIs and manage data flow',
    backstory: 'Expert in backend development and database management',
    allowDelegation: true
  });

  const qaTester = new Agent({
    name: 'QA Tester',
    role: 'Quality Assurance',
    goalDescription: 'Ensure software quality through automated testing',
    backstory: 'Experienced in test automation and quality assurance',
    allowDelegation: true
  });

  return {
    softwareEngineer,
    frontendDev,
    backendDev,
    qaTester
  };
};