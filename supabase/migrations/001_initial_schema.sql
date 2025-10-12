-- Kentucky Sports Chronicle Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create articles table
CREATE TABLE articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    author_name TEXT NOT NULL DEFAULT 'Kentucky Sports Chronicle',
    author_id UUID REFERENCES auth.users(id),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    read_time INTEGER DEFAULT 5,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX idx_articles_published ON articles(is_published, published_at DESC);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_featured ON articles(is_featured);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Public can view published articles"
    ON articles
    FOR SELECT
    USING (is_published = true);

-- Policy: Authenticated users can view all articles (for admin)
CREATE POLICY "Authenticated users can view all articles"
    ON articles
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Authenticated users can create articles
CREATE POLICY "Authenticated users can create articles"
    ON articles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Authenticated users can update articles
CREATE POLICY "Authenticated users can update articles"
    ON articles
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Authenticated users can delete articles
CREATE POLICY "Authenticated users can delete articles"
    ON articles
    FOR DELETE
    TO authenticated
    USING (true);

-- Create a function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
    counter INTEGER := 0;
    temp_slug TEXT;
BEGIN
    -- Convert title to lowercase and replace spaces/special chars with hyphens
    slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
    -- Remove leading/trailing hyphens
    slug := trim(both '-' from slug);
    
    temp_slug := slug;
    
    -- Check if slug exists, if so, append a number
    WHILE EXISTS (SELECT 1 FROM articles WHERE articles.slug = temp_slug) LOOP
        counter := counter + 1;
        temp_slug := slug || '-' || counter;
    END LOOP;
    
    RETURN temp_slug;
END;
$$ LANGUAGE plpgsql;

-- Sample data (optional - you can delete this after testing)
INSERT INTO articles (
    title,
    slug,
    excerpt,
    content,
    category,
    is_published,
    published_at,
    read_time
) VALUES (
    'Welcome to Kentucky Sports Chronicle',
    'welcome-to-kentucky-sports-chronicle',
    'We''re excited to launch Kentucky Sports Chronicle, your new source for comprehensive UK athletics coverage and commentary.',
    '<h2>Welcome Big Blue Nation!</h2><p>We''re thrilled to launch Kentucky Sports Chronicle, your premier destination for in-depth coverage of University of Kentucky athletics and sports stories from across the Commonwealth.</p><p>Our mission is simple: provide you with the best analysis, breaking news, and insider perspectives on the teams and athletes you care about most.</p><h3>What to Expect</h3><p>From football to basketball, baseball to volleyball, we''ll be covering it all. Expect game recaps, recruiting updates, player profiles, and expert commentary that goes beyond the box score.</p><p>Thank you for being here from the beginning. Let''s go Cats!</p>',
    'Announcement',
    true,
    NOW(),
    3
);

-- Create a view for published articles with author info
CREATE VIEW published_articles AS
SELECT 
    a.*,
    u.email as author_email
FROM articles a
LEFT JOIN auth.users u ON a.author_id = u.id
WHERE a.is_published = true
ORDER BY a.published_at DESC;

COMMENT ON TABLE articles IS 'Stores all blog articles for Kentucky Sports Chronicle';
COMMENT ON COLUMN articles.slug IS 'URL-friendly version of the title';
COMMENT ON COLUMN articles.is_featured IS 'Whether this article should be featured on the homepage';
COMMENT ON COLUMN articles.read_time IS 'Estimated reading time in minutes';
