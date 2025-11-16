/*
  # Add Admin Login Verification Function

  ## Overview
  Creates a PostgreSQL function to verify admin login credentials by comparing
  the provided password with the stored MD5 hash in the database.

  ## New Functions
  
  ### `verify_admin_login`
  - Parameters:
    - `p_username` (text) - The username to verify
    - `p_password` (text) - The plain text password to verify
  - Returns: A record from the admins table if credentials are valid
  - Security: Uses MD5 hash comparison for password verification

  ## Purpose
  This function allows the frontend to verify admin credentials by sending
  plain text password and username. The function handles the MD5 hashing
  internally and returns the admin record if credentials match.
*/

-- Create function to verify admin login
CREATE OR REPLACE FUNCTION verify_admin_login(
  p_username text,
  p_password text
)
RETURNS SETOF admins
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM admins
  WHERE username = p_username
    AND password = md5(p_password);
END;
$$;
