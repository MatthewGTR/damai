/*
  # Create Storage Bucket and Posts System

  ## Storage Bucket
  Creates a public storage bucket for images used throughout the website.

  ## New Tables
  
  ### `posts`
  Stores announcements, events, and special donation appeals
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Post title
  - `content` (text) - Post content/description
  - `post_type` (text) - Type: 'event', 'announcement', 'special_donation'
  - `image_url` (text, nullable) - Optional featured image
  - `priority` (integer) - Display priority (higher = more important)
  - `is_published` (boolean) - Whether post is visible to public
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `images`
  Tracks uploaded images for management
  - `id` (uuid, primary key) - Unique identifier
  - `filename` (text) - Original filename
  - `storage_path` (text) - Path in storage bucket
  - `url` (text) - Public URL
  - `alt_text` (text, nullable) - Alt text for accessibility
  - `uploaded_by` (uuid, nullable) - User who uploaded (future use)
  - `created_at` (timestamptz) - Upload timestamp

  ## Security
  - Enable RLS on all tables
  - Public can read published posts
  - Only authenticated users can create/update posts
  - Public can view images
  - Only authenticated users can upload images
*/

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images bucket
CREATE POLICY "Public can view images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update their images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  post_type text NOT NULL CHECK (post_type IN ('event', 'announcement', 'special_donation')),
  image_url text,
  priority integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts"
  ON posts
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create images tracking table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL,
  url text NOT NULL,
  alt_text text,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view images metadata"
  ON images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create image records"
  ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update image records"
  ON images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete image records"
  ON images
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS posts_published_priority_idx 
  ON posts (is_published, priority DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS images_created_at_idx 
  ON images (created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for posts table
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
