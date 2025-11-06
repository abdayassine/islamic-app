import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://osplcgjegfybrzwpdfny.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zcGxjZ2plZ2Z5YnJ6d3BkZm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE3NjgsImV4cCI6MjA3Nzc1Nzc2OH0.YNmbkmLbOZ5zVvGFBEEY6LeXuEH4r_1oc66z44U76KA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
