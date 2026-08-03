// Supabase 연결 설정
const SUPABASE_URL = 'https://rbkipjrmyigvkwdxtpge.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJia2lwanJteWlndmt3ZHh0cGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTMwOTEsImV4cCI6MjEwMTMyOTA5MX0.RXunWQCJFpZKi9aBfVEXFCCIj-S_HWSp5MiEdb-LiEA';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
