/*
  # Simplified Admin System and Posts

  ## Overview
  Creates a simple admin system with direct username/password authentication
  and a Facebook-style posting system for sharing updates.

  ## New Tables
  
  ### `admins`
  Stores admin credentials for simple authentication
  - `id` (uuid, primary key) - Unique identifier
  - `username` (text, unique) - Admin username
  - `password` (text) - Hashed password
  - `name` (text) - Admin display name
  - `created_at` (timestamptz) - Account creation timestamp

  ### `updates`
  Stores Facebook-style posts/updates
  - `id` (uuid, primary key) - Unique identifier
  - `admin_id` (uuid) - Admin who created the post
  - `content` (text) - Post content/message
  - `image_url` (text, nullable) - Optional attached image
  - `created_at` (timestamptz) - Post creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Public can read updates
  - Only authenticated admins can create/update/delete updates
  - Admin table is protected from public access

  ## Initial Data
  - Creates default admin account (username: admin, password: admin123)
  - Password should be changed after first login
*/

-- Drop old tables if they exist
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS images CASCADE;

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to admins"
  ON admins
  FOR ALL
  TO public
  USING (false);

-- Create updates table (Facebook-style posts)
CREATE TABLE IF NOT EXISTS updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admins(id) ON DELETE SET NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view updates"
  ON updates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage updates"
  ON updates
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS updates_created_at_idx 
  ON updates (created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updates table
DROP TRIGGER IF EXISTS update_updates_updated_at ON updates;
CREATE TRIGGER update_updates_updated_at
  BEFORE UPDATE ON updates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin (username: admin, password: admin123)
-- Using simple MD5 hash for demonstration (should use better hashing in production)
INSERT INTO admins (username, password, name)
VALUES ('admin', md5('admin123'), 'Administrator')
ON CONFLICT (username) DO NOTHING;
