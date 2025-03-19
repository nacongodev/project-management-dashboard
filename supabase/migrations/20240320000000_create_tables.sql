-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    icon TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle',
    description TEXT,
    responsibilities TEXT[],
    chat_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow public read access to team_members
CREATE POLICY "Allow public read access to team_members"
    ON public.team_members FOR SELECT
    TO public
    USING (true);

-- Allow public read access to chat_messages
CREATE POLICY "Allow public read access to chat_messages"
    ON public.chat_messages FOR SELECT
    TO public
    USING (true);

-- Allow public insert access to chat_messages
CREATE POLICY "Allow public insert access to chat_messages"
    ON public.chat_messages FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow public read access to documents
CREATE POLICY "Allow public read access to documents"
    ON public.documents FOR SELECT
    TO public
    USING (true);

-- Insert initial team members
INSERT INTO public.team_members (name, role, icon, status, description, responsibilities, chat_enabled)
VALUES
    ('Product Manager', 'product_manager', 'User', 'idle', 'Oversees product development and strategy', ARRAY['Product Strategy', 'User Research', 'Feature Planning'], true),
    ('UX Designer', 'ux_designer', 'Palette', 'idle', 'Creates user-centered design solutions', ARRAY['User Research', 'Wireframing', 'Prototyping'], true),
    ('Frontend Developer', 'frontend_developer', 'Code', 'idle', 'Builds responsive and interactive UIs', ARRAY['UI Development', 'Component Design', 'Performance Optimization'], true),
    ('Backend Developer', 'backend_developer', 'Server', 'idle', 'Develops server-side applications', ARRAY['API Development', 'Database Design', 'System Architecture'], true),
    ('DevOps Engineer', 'devops_engineer', 'Settings', 'idle', 'Manages infrastructure and deployment', ARRAY['CI/CD', 'Infrastructure', 'Monitoring'], true),
    ('QA Engineer', 'qa_engineer', 'CheckCircle', 'idle', 'Ensures software quality', ARRAY['Testing', 'Quality Assurance', 'Bug Tracking'], true),
    ('Technical Writer', 'technical_writer', 'FileText', 'idle', 'Creates technical documentation', ARRAY['Documentation', 'User Guides', 'API Documentation'], true),
    ('Scrum Master', 'scrum_master', 'Users', 'idle', 'Facilitates agile processes', ARRAY['Agile Facilitation', 'Team Coordination', 'Process Improvement'], true)
ON CONFLICT DO NOTHING; 