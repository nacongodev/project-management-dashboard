import React from 'react';
import {
  Users,
  FolderKanban,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  FileText,
} from 'lucide-react';

interface DashboardOverviewProps {
  user: {
    role: string;
    full_name: string;
  };
}

const stats = [
  {
    name: 'Total Team Members',
    value: '24',
    change: '+2',
    changeType: 'increase',
    icon: Users,
  },
  {
    name: 'Active Projects',
    value: '12',
    change: '+1',
    changeType: 'increase',
    icon: FolderKanban,
  },
  {
    name: 'Completed Tasks',
    value: '156',
    change: '+12',
    changeType: 'increase',
    icon: CheckCircle,
  },
  {
    name: 'Pending Tasks',
    value: '23',
    change: '-5',
    changeType: 'decrease',
    icon: Clock,
  },
];

const recentProjects = [
  {
    name: 'Website Redesign',
    status: 'In Progress',
    progress: 75,
    team: 8,
    dueDate: '2024-04-15',
  },
  {
    name: 'Mobile App Development',
    status: 'Planning',
    progress: 25,
    team: 5,
    dueDate: '2024-05-01',
  },
  {
    name: 'Database Migration',
    status: 'Completed',
    progress: 100,
    team: 3,
    dueDate: '2024-03-20',
  },
];

const upcomingEvents = [
  {
    title: 'Team Meeting',
    date: '2024-03-25',
    time: '10:00 AM',
    type: 'meeting',
  },
  {
    title: 'Project Deadline',
    date: '2024-03-28',
    time: '5:00 PM',
    type: 'deadline',
  },
  {
    title: 'Client Presentation',
    date: '2024-03-30',
    time: '2:00 PM',
    type: 'presentation',
  },
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user.full_name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent projects and upcoming events */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent projects */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Projects</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {recentProjects.map((project) => (
                <li key={project.name} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FolderKanban className="h-5 w-5 text-gray-400" />
                      <p className="ml-3 text-sm font-medium text-gray-900">{project.name}</p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          project.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <p>{project.team} team members</p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Calendar className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <p>Due {new Date(project.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            Progress
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-blue-600">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div
                          style={{ width: `${project.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Upcoming events */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Events</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {upcomingEvents.map((event) => (
                <li key={event.title} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {event.type === 'meeting' && <Users className="h-5 w-5 text-blue-500" />}
                      {event.type === 'deadline' && <AlertCircle className="h-5 w-5 text-red-500" />}
                      {event.type === 'presentation' && <FileText className="h-5 w-5 text-green-500" />}
                      <p className="ml-3 text-sm font-medium text-gray-900">{event.title}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <p>{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <p>{event.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 