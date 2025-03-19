-- Create team_members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    expertise TEXT[],
    github_url TEXT,
    portfolio_url TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create chat_messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to team_members
CREATE POLICY "Allow public read access to team_members"
    ON team_members FOR SELECT
    USING (true);

-- Allow authenticated users to insert chat messages
CREATE POLICY "Allow authenticated users to insert chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (true);

-- Allow authenticated users to read chat messages
CREATE POLICY "Allow authenticated users to read chat messages"
    ON chat_messages FOR SELECT
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for team_members
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 