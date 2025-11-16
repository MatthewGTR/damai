/*
  # Create gallery images table

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key)
      - `image_url` (text) - URL to the image in storage
      - `caption` (text, optional) - Optional caption for the image
      - `display_order` (integer) - Order in which images should be displayed
      - `created_at` (timestamptz) - When the image was uploaded
      - `created_by` (uuid) - Admin who uploaded the image
  
  2. Security
    - Enable RLS on `gallery_images` table
    - Add policy for public read access (anyone can view gallery)
    - Add policy for authenticated admins to insert/update/delete images
*/

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admins(id)
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery images"
  ON gallery_images
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert gallery images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can update gallery images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete gallery images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images(created_at DESC);