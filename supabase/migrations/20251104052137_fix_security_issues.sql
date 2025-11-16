/*
  # Fix Database Security Issues

  ## Overview
  This migration addresses several security and performance issues identified in the database:
  
  ## Changes Made

  ### 1. Add Missing Foreign Key Indexes
  - Add index on `gallery_images.created_by` to improve foreign key lookup performance
  - Add index on `updates.admin_id` to improve foreign key lookup performance
  
  ### 2. Remove Unused Index
  - Drop `idx_gallery_images_created_at` which is not being used in queries
  
  ### 3. Fix Function Search Path Mutable Issues
  - Update `update_updated_at_column` function with explicit search_path
  - Update `verify_admin_login` function with explicit search_path
  - Update `verify_admin_password` function with explicit search_path
  - Update `update_admin_password` function with explicit search_path
  
  ## Security Impact
  - Prevents potential SQL injection vulnerabilities from search_path manipulation
  - Improves query performance with proper indexing
  - Removes unnecessary indexes that could slow down write operations
*/

-- Add missing foreign key indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_by 
  ON gallery_images(created_by);

CREATE INDEX IF NOT EXISTS idx_updates_admin_id 
  ON updates(admin_id);

-- Drop unused index
DROP INDEX IF EXISTS idx_gallery_images_created_at;

-- Fix function search_path issues by adding explicit search_path and schema qualification

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update verify_admin_login function
CREATE OR REPLACE FUNCTION verify_admin_login(
  p_username text,
  p_password text
)
RETURNS SETOF admins
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.admins
  WHERE username = p_username
    AND password = md5(p_password);
END;
$$;

-- Update verify_admin_password function
CREATE OR REPLACE FUNCTION verify_admin_password(
  p_admin_id uuid,
  p_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stored_password text;
BEGIN
  SELECT password INTO v_stored_password
  FROM public.admins
  WHERE id = p_admin_id;

  IF v_stored_password IS NULL THEN
    RETURN false;
  END IF;

  RETURN v_stored_password = md5(p_password);
END;
$$;

-- Update update_admin_password function
CREATE OR REPLACE FUNCTION update_admin_password(
  p_admin_id uuid,
  p_new_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.admins
  SET password = md5(p_new_password)
  WHERE id = p_admin_id;

  RETURN FOUND;
END;
$$;