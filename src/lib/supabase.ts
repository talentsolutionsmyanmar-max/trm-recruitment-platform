import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using localStorage fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DBCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: number;
  education: string;
  current_company: string;
  expected_salary: number;
  status: string;
  source: string;
  match_score: number;
  applied_jobs: string[];
  created_at: string;
  assigned_to: string;
  notes: string;
  tags: string[];
  resume_url?: string;
}

export interface DBJob {
  id: string;
  title: string;
  client_id: string;
  client_name: string;
  location: string;
  salary_min: number;
  salary_max: number;
  quantity: number;
  filled: number;
  priority: string;
  status: string;
  deadline: string;
  created_at: string;
  category: string;
  skills: string[];
  experience_required: number;
  assigned_to: string;
}

export interface DBClient {
  id: string;
  company_name: string;
  industry: string;
  contact_person: string;
  email: string;
  phone: string;
  status: string;
  total_revenue: number;
  total_placements: number;
  assigned_to: string;
}

export interface DBInterview {
  id: string;
  candidate_id: string;
  candidate_name: string;
  job_title: string;
  client_name: string;
  date_time: string;
  type: string;
  status: string;
  outcome?: string;
  meeting_link?: string;
}

export interface DBTask {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  due_date: string;
  due_time: string;
  related_to: string;
  assigned_to: string;
}

export interface DBDeal {
  id: string;
  title: string;
  client_name: string;
  value: number;
  stage: string;
  probability: number;
  expected_close_date: string;
  assigned_to: string;
}

export interface DBPlacement {
  id: string;
  candidate_name: string;
  job_title: string;
  client_name: string;
  salary: number;
  fee: number;
  date: string;
  recruiter_id: string;
}

// Helper functions for database operations
export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

// Candidates
export const fetchCandidates = async () => {
  const { data, error } = await supabase.from('candidates').select('*');
  if (error) throw error;
  return data;
};

export const insertCandidate = async (candidate: Omit<DBCandidate, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('candidates').insert(candidate).select();
  if (error) throw error;
  return data[0];
};

export const updateCandidate = async (id: string, updates: Partial<DBCandidate>) => {
  const { data, error } = await supabase.from('candidates').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteCandidate = async (id: string) => {
  const { error } = await supabase.from('candidates').delete().eq('id', id);
  if (error) throw error;
};

// Jobs
export const fetchJobs = async () => {
  const { data, error } = await supabase.from('jobs').select('*');
  if (error) throw error;
  return data;
};

export const insertJob = async (job: Omit<DBJob, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('jobs').insert(job).select();
  if (error) throw error;
  return data[0];
};

export const updateJob = async (id: string, updates: Partial<DBJob>) => {
  const { data, error } = await supabase.from('jobs').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteJob = async (id: string) => {
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) throw error;
};

// Clients
export const fetchClients = async () => {
  const { data, error } = await supabase.from('clients').select('*');
  if (error) throw error;
  return data;
};

// Deals
export const fetchDeals = async () => {
  const { data, error } = await supabase.from('deals').select('*');
  if (error) throw error;
  return data;
};

export const insertDeal = async (deal: Omit<DBDeal, 'id'>) => {
  const { data, error } = await supabase.from('deals').insert(deal).select();
  if (error) throw error;
  return data[0];
};

export const updateDeal = async (id: string, updates: Partial<DBDeal>) => {
  const { data, error } = await supabase.from('deals').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

// Tasks
export const fetchTasks = async () => {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) throw error;
  return data;
};

export const insertTask = async (task: Omit<DBTask, 'id'>) => {
  const { data, error } = await supabase.from('tasks').insert(task).select();
  if (error) throw error;
  return data[0];
};

export const updateTask = async (id: string, updates: Partial<DBTask>) => {
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

// Interviews
export const fetchInterviews = async () => {
  const { data, error } = await supabase.from('interviews').select('*');
  if (error) throw error;
  return data;
};

export const insertInterview = async (interview: Omit<DBInterview, 'id'>) => {
  const { data, error } = await supabase.from('interviews').insert(interview).select();
  if (error) throw error;
  return data[0];
};

export const updateInterview = async (id: string, updates: Partial<DBInterview>) => {
  const { data, error } = await supabase.from('interviews').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

// Placements
export const fetchPlacements = async () => {
  const { data, error } = await supabase.from('placements').select('*');
  if (error) throw error;
  return data;
};

export const insertPlacement = async (placement: Omit<DBPlacement, 'id'>) => {
  const { data, error } = await supabase.from('placements').insert(placement).select();
  if (error) throw error;
  return data[0];
};
