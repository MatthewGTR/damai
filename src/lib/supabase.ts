import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DonationType {
  id: string;
  name: string;
  slug: string;
  amount: number;
  description: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  donation_type: string;
  is_monthly: boolean;
  message?: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}
