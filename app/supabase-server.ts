import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { Database } from '@/types_db'; // Ensure this import is correct and available
import supabase from '@/utils/supabaseClient';

// Create a server-side Supabase client
export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies })
);

async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'example@email.com',
    password: 'example-password',
  });
  // Handle the response and errors
}

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
export async function getUserName() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: userDetails } = await supabase.from('users').select('full_name').single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Function to retrieve user details from Supabase
export async function getUserDetails(user_id: string) {
  try {
    // Pridobi podrobnosti uporabnika iz baze podatkov
    const { data, error } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
export async function getUserImage(user_id: string) {
  try {
    // Pridobi podrobnosti uporabnika iz baze podatkov
    const { data, error } = await supabase
      .from('users')
      .select('pfp_url')
      .eq('id', user_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
