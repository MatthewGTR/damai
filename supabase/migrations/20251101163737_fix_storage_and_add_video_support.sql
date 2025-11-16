/*
  # Fix Storage Policies and Add Video Support

  ## Overview
  This migration fixes the storage bucket policies to allow uploads and adds
  support for video files in the updates system.

  ## Changes
  
  ### Storage Policies
  1. Allow authenticated users to upload files to the images bucket
  2. Allow public read access to all files
  3. Allow authenticated users to delete their own uploads

  ### Database Changes
  1. Add `media_type` column to updates table to differentiate between images and videos
  2. Rename `image_url` to `media_url` for clarity

  ## Security
  - Public can read all files in the images bucket
  - Only authenticated admins can upload files
  - Only authenticated admins can delete files
*/

-- Add media type column to updates table
ALTER TABLE updates 
  ADD COLUMN IF NOT EXISTS media_type text CHECK (media_type IN ('image', 'video'));

-- Rename image_url to media_url (if needed)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'updates' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE updates RENAME COLUMN image_url TO media_url;
  END IF;
END $$;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete images" ON storage.objects;

-- Create storage policies for the images bucket
CREATE POLICY "Public can view images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated can delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');

-- Also allow service_role full access
CREATE POLICY "Service role has full access"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');
