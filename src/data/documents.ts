import { Document } from '../types';

export const documents: Document[] = [
  {
    id: '1',
    title: 'System Architecture Overview',
    lastModified: new Date('2024-03-10T14:30:00'),
    status: 'approved',
    url: 'https://docs.google.com/document/d/architecture',
    reviewers: ['Software Engineer', 'Product Owner'],
    comments: []
  },
  {
    id: '2',
    title: 'Frontend Technical Specification',
    lastModified: new Date('2024-03-11T09:15:00'),
    status: 'review',
    url: 'https://docs.google.com/document/d/frontend-spec',
    reviewers: ['Frontend Developer', 'Software Engineer'],
    comments: []
  },
  {
    id: '3',
    title: 'API Documentation',
    lastModified: new Date('2024-03-11T16:45:00'),
    status: 'draft',
    url: 'https://docs.google.com/document/d/api-docs',
    reviewers: ['Backend Developer', 'QA Tester'],
    comments: []
  }
];