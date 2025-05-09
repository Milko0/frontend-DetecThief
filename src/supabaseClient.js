// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvqpmfzdpzdrtczkcupv.supabase.co'; // reemplaza
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cXBtZnpkcHpkcnRjemtjdXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjA5NjgsImV4cCI6MjA2MTczNjk2OH0.tlzDQwqOKYqQTCxKDb_mHn-tfizkBE7RnAnG_7z0l_o'; // reemplaza

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
