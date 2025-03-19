# Project Management Dashboard

A modern web application for project management with role-based access control, team management, and real-time collaboration features.

## Features

- 🔐 Authentication and Authorization
- 👥 Team Management
- 📊 Dashboard Overview
- 💬 Real-time Chat
- 📝 Document Management
- 📅 Project Calendar
- 📈 Analytics
- 🔒 Security Settings

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Supabase (Backend & Authentication)
- React Router
- Lucide Icons

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-bolt
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API and service integrations
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 