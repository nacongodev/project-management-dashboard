import { SprintInfo } from '../types';

export const currentSprint: SprintInfo = {
  number: 12,
  startDate: new Date('2024-03-11'),
  endDate: new Date('2024-03-24'),
  goals: [
    'Implement real-time collaboration features',
    'Set up automated testing pipeline',
    'Integrate Scrum automation tools'
  ],
  ceremonies: {
    dailyStandup: '10:00 AM EST',
    review: new Date('2024-03-24T14:00:00'),
    retrospective: new Date('2024-03-24T15:30:00')
  }
};