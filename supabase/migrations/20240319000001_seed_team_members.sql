-- Insert sample team members
INSERT INTO team_members (name, role, expertise, github_url, portfolio_url, avatar_url)
VALUES
  (
    'John Smith',
    'Frontend Developer',
    ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    'https://github.com/johnsmith',
    'https://johnsmith.dev',
    'https://ui-avatars.com/api/?name=John+Smith&background=random'
  ),
  (
    'Sarah Johnson',
    'Backend Developer',
    ARRAY['Node.js', 'Python', 'PostgreSQL', 'Docker'],
    'https://github.com/sarahj',
    'https://sarahj.dev',
    'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random'
  ),
  (
    'Michael Chen',
    'DevOps Engineer',
    ARRAY['AWS', 'Kubernetes', 'CI/CD', 'Terraform'],
    'https://github.com/michaelc',
    'https://michaelc.dev',
    'https://ui-avatars.com/api/?name=Michael+Chen&background=random'
  ),
  (
    'Emily Rodriguez',
    'UI/UX Designer',
    ARRAY['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    'https://github.com/emilyr',
    'https://emilyr.design',
    'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=random'
  ),
  (
    'David Kim',
    'Full Stack Developer',
    ARRAY['React', 'Node.js', 'MongoDB', 'GraphQL'],
    'https://github.com/davidk',
    'https://davidk.dev',
    'https://ui-avatars.com/api/?name=David+Kim&background=random'
  ),
  (
    'Lisa Wang',
    'Product Manager',
    ARRAY['Agile', 'Product Strategy', 'User Stories', 'Analytics'],
    'https://github.com/lisaw',
    'https://lisaw.product',
    'https://ui-avatars.com/api/?name=Lisa+Wang&background=random'
  ),
  (
    'Alex Thompson',
    'QA Engineer',
    ARRAY['Testing', 'Automation', 'Selenium', 'Jest'],
    'https://github.com/alext',
    'https://alext.qa',
    'https://ui-avatars.com/api/?name=Alex+Thompson&background=random'
  ),
  (
    'Rachel Martinez',
    'Security Engineer',
    ARRAY['Penetration Testing', 'Security Auditing', 'OWASP', 'Compliance'],
    'https://github.com/rachelm',
    'https://rachelm.security',
    'https://ui-avatars.com/api/?name=Rachel+Martinez&background=random'
  ); 