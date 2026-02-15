-- TRM Recruitment Platform Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  experience INTEGER DEFAULT 0,
  education TEXT,
  current_company TEXT,
  expected_salary INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new',
  source TEXT DEFAULT 'Manual Entry',
  match_score INTEGER DEFAULT 0,
  applied_jobs TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_to TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  resume_url TEXT
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client_id TEXT,
  client_name TEXT,
  location TEXT,
  salary_min INTEGER DEFAULT 0,
  salary_max INTEGER DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  filled INTEGER DEFAULT 0,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'in-progress',
  deadline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT DEFAULT 'Manufacturing',
  skills TEXT[] DEFAULT '{}',
  experience_required INTEGER DEFAULT 0,
  assigned_to TEXT
);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  total_revenue INTEGER DEFAULT 0,
  total_placements INTEGER DEFAULT 0,
  assigned_to TEXT
);

-- Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id TEXT,
  candidate_name TEXT,
  job_title TEXT,
  client_name TEXT,
  date_time TEXT,
  type TEXT DEFAULT 'onsite',
  status TEXT DEFAULT 'scheduled',
  outcome TEXT,
  meeting_link TEXT
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'call',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  due_date TEXT,
  due_time TEXT,
  related_to TEXT,
  assigned_to TEXT
);

-- Deals Table
CREATE TABLE IF NOT EXISTS deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT,
  value INTEGER DEFAULT 0,
  stage TEXT DEFAULT 'lead',
  probability INTEGER DEFAULT 10,
  expected_close_date TEXT,
  assigned_to TEXT
);

-- Placements Table
CREATE TABLE IF NOT EXISTS placements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name TEXT NOT NULL,
  job_title TEXT,
  client_name TEXT,
  salary INTEGER DEFAULT 0,
  fee INTEGER DEFAULT 0,
  date TEXT,
  recruiter_id TEXT
);

-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo - in production, restrict this)
CREATE POLICY "Allow public read access" ON candidates FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON candidates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON candidates FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON jobs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON jobs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON jobs FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON clients FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON interviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON interviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON interviews FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON interviews FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON tasks FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON deals FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON deals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON deals FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON deals FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON placements FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON placements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON placements FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON placements FOR DELETE USING (true);

-- Insert initial demo data for clients
INSERT INTO clients (id, company_name, industry, contact_person, email, phone, status, total_revenue, total_placements, assigned_to) VALUES
('c1', 'MGS Beverage', 'Food & Beverage', 'U Thant Zin', 'thantzin@mgs.com', '+95 9 123 456 789', 'active', 45000000, 45, 'u3'),
('c2', 'Shwe Taung Group', 'Construction', 'Daw Mya Mya', 'myamya@shwetaung.com', '+95 9 234 567 890', 'active', 32000000, 32, 'u2'),
('c3', 'KBZ Bank', 'Banking', 'U Aung Ko', 'aungko@kbzbank.com', '+95 9 789 012 345', 'active', 97500000, 65, 'u3'),
('c4', 'Mandalay Garment', 'Manufacturing', 'Daw Khin Khin', 'khinkhin@mandalaygarment.com', '+95 9 456 789 012', 'active', 60000000, 120, 'u4'),
('c5', 'Grand Myanmar Hotel', 'Hospitality', 'U Myo Aung', 'myoaung@grandmyanmar.com', '+95 9 567 890 123', 'active', 28000000, 28, 'u5')
ON CONFLICT (id) DO NOTHING;
