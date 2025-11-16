/*
  # Create donations tracking system

  1. New Tables
    - `donations`
      - `id` (uuid, primary key) - Unique donation identifier
      - `donor_name` (text) - Name of the donor
      - `donor_email` (text) - Email address of the donor
      - `donor_phone` (text, optional) - Phone number of the donor
      - `amount` (decimal) - Donation amount in RM
      - `donation_type` (text) - Type: 'rice', 'pampers', 'custom', 'monthly'
      - `is_monthly` (boolean) - Whether this is a recurring monthly donation
      - `message` (text, optional) - Optional message from donor
      - `status` (text) - Payment status: 'pending', 'completed', 'cancelled'
      - `created_at` (timestamptz) - When donation was created
      - `updated_at` (timestamptz) - When donation was last updated

    - `donation_types`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Display name (e.g., "Rice Supply")
      - `slug` (text) - URL-friendly identifier
      - `amount` (decimal) - Fixed amount in RM (0 for custom amounts)
      - `description` (text) - Description of what this donation provides
      - `icon` (text) - Icon name for UI display
      - `is_active` (boolean) - Whether this donation type is currently available
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow public read access to donation_types (to display options)
    - Allow public insert to donations (to accept donations)
    - Only authenticated admins can view donation records (for privacy)

  3. Important Notes
    - Donation records are kept private for donor privacy
    - Public can only insert donations, not view them
    - Donation types are publicly readable to display options
*/

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  donor_phone text,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  donation_type text NOT NULL,
  is_monthly boolean DEFAULT false,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donation_types table
CREATE TABLE IF NOT EXISTS donation_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount >= 0),
  description text NOT NULL,
  icon text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_types ENABLE ROW LEVEL SECURITY;

-- Policies for donations table
-- Allow anyone to insert donations (public donation form)
CREATE POLICY "Anyone can submit donations"
  ON donations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users (admins) can view donations
CREATE POLICY "Only authenticated users can view donations"
  ON donations FOR SELECT
  TO authenticated
  USING (true);

-- Policies for donation_types table
-- Allow anyone to view active donation types
CREATE POLICY "Anyone can view active donation types"
  ON donation_types FOR SELECT
  TO anon
  USING (is_active = true);

-- Only authenticated users can manage donation types
CREATE POLICY "Authenticated users can manage donation types"
  ON donation_types FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default donation types
INSERT INTO donation_types (name, slug, amount, description, icon, is_active) VALUES
  ('Rice Supply', 'rice', 10.00, 'Provide essential rice for elderly residents', 'Wheat', true),
  ('Pampers & Diapers', 'pampers', 10.00, 'Supply adult diapers for elderly care', 'Baby', true),
  ('Medical Supplies', 'medical', 20.00, 'Support medical needs and healthcare', 'HeartPulse', true),
  ('Monthly Support', 'monthly', 50.00, 'Regular monthly contribution for ongoing care', 'Calendar', true),
  ('Custom Amount', 'custom', 0.00, 'Choose your own donation amount', 'Heart', true)
ON CONFLICT (slug) DO NOTHING;
