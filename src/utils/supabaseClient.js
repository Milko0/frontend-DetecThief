// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores con los de tu proyecto de Supabase
const SUPABASE_URL = 'https://yvqpmfzdpzdrtczkcupv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cXBtZnpkcHpkcnRjemtjdXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjA5NjgsImV4cCI6MjA2MTczNjk2OH0.tlzDQwqOKYqQTCxKDb_mHn-tfizkBE7RnAnG_7z0l_o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
