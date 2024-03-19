import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { Database } from '@/types_db'; // Ensure this import is correct and available

// Create a server-side Supabase client
export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies })
);

// Function to retrieve the session from Supabase
export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Function to retrieve the user ID from Supabase
export async function getUserId() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: userDetails } = await supabase.from('users').select('user_id').single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Function to retrieve user details from Supabase
export async function getUserDetails() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: userDetails } = await supabase.from('users').select('*').single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
