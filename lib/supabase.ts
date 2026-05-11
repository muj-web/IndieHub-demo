import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 1. STANDARDNÍ KLIENT (Pro běžné použití na webu a v adminu)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. ADMIN KLIENT (Pro systémové úkoly a Webhooky)
// Tato funkce používá Service Role Key a obchází veškerá RLS pravidla.
// Smí se volat POUZE v souborech běžících na serveru (API routy)!
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceKey);
};