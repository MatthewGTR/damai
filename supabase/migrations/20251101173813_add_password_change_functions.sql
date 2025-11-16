/*
  # Add Password Change Functions for Admins

  ## Overview
  Creates PostgreSQL functions to verify admin passwords and update them.

  ## New Functions

  ### `verify_admin_password`
  - Parameters:
    - `p_admin_id` (uuid) - The admin ID to verify
    - `p_password` (text) - The plain text password to verify
  - Returns: boolean - true if password matches, false otherwise
  - Security: Uses MD5 hash comparison for password verification

  ### `update_admin_password`
  - Parameters:
    - `p_admin_id` (uuid) - The admin ID to update
    - `p_new_password` (text) - The new plain text password
  - Returns: boolean - true if update successful
  - Security: Hashes the password using MD5 before storing

  ## Purpose
  These functions allow admins to change their passwords securely by handling
  MD5 hashing internally on the database side.
*/

-- Function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(
  p_admin_id uuid,
  p_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stored_password text;
BEGIN
  SELECT password INTO v_stored_password
  FROM admins
  WHERE id = p_admin_id;

  IF v_stored_password IS NULL THEN
    RETURN false;
  END IF;

  RETURN v_stored_password = md5(p_password);
END;
$$;

-- Function to update admin password
CREATE OR REPLACE FUNCTION update_admin_password(
  p_admin_id uuid,
  p_new_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE admins
  SET password = md5(p_new_password)
  WHERE id = p_admin_id;

  RETURN FOUND;
END;
$$;