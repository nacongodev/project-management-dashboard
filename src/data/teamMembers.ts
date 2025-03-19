import { TeamMember } from '../types';

export const teamMembers: TeamMember[] = [
  {
    role: 'Software Engineer (Architect)',
    responsibilities: [
      'Define system architecture',
      'Write design documents',
      'Specify requirements'
    ],
    icon: 'Code2',
    status: 'active',
    chatEnabled: true
  },
  {
    role: 'Frontend Developer',
    responsibilities: [
      'Build user interface',
      'Implement designs',
      'API integration'
    ],
    icon: 'Layout',
    status: 'busy',
    chatEnabled: true
  },
  {
    role: 'Backend Developer',
    responsibilities: [
      'Develop APIs',
      'Server-side logic',
      'Data management'
    ],
    icon: 'Database',
    status: 'active',
    chatEnabled: true
  },
  {
    role: 'QA Tester',
    responsibilities: [
      'Write automated tests',
      'Run test suites',
      'Report issues'
    ],
    icon: 'TestTube',
    status: 'idle',
    chatEnabled: true
  },
  {
    role: 'CI/CD Engineer',
    responsibilities: [
      'Manage deployment pipeline',
      'Automate processes',
      'Monitor systems'
    ],
    icon: 'GitBranch',
    status: 'active',
    chatEnabled: true
  },
  {
    role: 'Product Owner',
    responsibilities: [
      'Define product backlog',
      'Prioritize tasks',
      'Align business goals'
    ],
    icon: 'Target',
    status: 'busy',
    chatEnabled: true
  },
  {
    role: 'Scrum Master',
    responsibilities: [
      'Facilitate ceremonies',
      'Remove blockers',
      'Ensure collaboration'
    ],
    icon: 'Users',
    status: 'active',
    chatEnabled: true
  }
];