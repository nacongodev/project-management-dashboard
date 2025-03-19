import React from 'react';
import { SprintInfo } from '../types';
import { Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

interface SprintOverviewProps {
  sprint: SprintInfo;
}

const SprintOverview: React.FC<SprintOverviewProps> = ({ sprint }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Sprint #{sprint.number}</h2>
        <div className="flex items-center text-gray-500">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{format(sprint.startDate, 'MMM d')} - {format(sprint.endDate, 'MMM d')}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Sprint Goals</h3>
          <ul className="list-disc pl-5 space-y-1">
            {sprint.goals.map((goal, index) => (
              <li key={index} className="text-gray-600">{goal}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Ceremonies</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-gray-600">Daily Standup: {sprint.ceremonies.dailyStandup}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-gray-600">Sprint Review: {format(sprint.ceremonies.review, 'MMM d, HH:mm')}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-gray-600">Retrospective: {format(sprint.ceremonies.retrospective, 'MMM d, HH:mm')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintOverview;