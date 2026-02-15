// Myanmar Agency Recruitment App - Type Definitions

export interface Client {
  id: string;
  companyName: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'active' | 'inactive' | 'prospect';
  notes: string;
  createdAt: string;
  totalJobs: number;
  totalPlacements: number;
}

export interface JobOrder {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  requirements: string;
  quantity: number;
  filled: number;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'filled' | 'closed';
  createdAt: string;
  deadline: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: number;
  education: string;
  currentCompany: string;
  expectedSalary: number;
  status: 'available' | 'placed' | 'not-looking';
  appliedJobs: string[];
  createdAt: string;
  resumeUrl?: string;
}

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  expectedCloseDate: string;
  probability: number;
  notes: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'placement';
  title: string;
  description: string;
  relatedTo: string;
  createdAt: string;
  user: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'outreach' | 'follow-up' | 'proposal' | 'confirmation';
}

export interface DashboardMetrics {
  totalClients: number;
  activeJobs: number;
  pipelineValue: number;
  placementsThisMonth: number;
  clientsChange: number;
  jobsChange: number;
  pipelineChange: number;
  placementsChange: number;
}

// Myanmar specific
export const MYANMAR_CITIES = [
  'Yangon',
  'Mandalay',
  'Naypyidaw',
  'Bago',
  'Mawlamyine',
  'Taunggyi',
  'Monywa',
  'Myitkyina',
  'Pathein',
  'Sittwe',
  'Hpa-an',
  'Meiktila',
  'Myeik',
  'Dawei',
  'Magway'
] as const;

export const INDUSTRIES = [
  'Manufacturing',
  'Construction',
  'Hospitality & Tourism',
  'Retail',
  'Banking & Finance',
  'Telecommunications',
  'Healthcare',
  'Education',
  'Agriculture',
  'Logistics & Transportation',
  'IT & Technology',
  'Real Estate',
  'Energy & Mining',
  'Food & Beverage',
  'Textile & Garment'
] as const;

export const JOB_CATEGORIES = [
  'Factory Worker',
  'Construction Worker',
  'Domestic Helper',
  'Sales Representative',
  'Office Assistant',
  'Driver',
  'Security Guard',
  'Waiter/Waitress',
  'Cook/Chef',
  'Electrician',
  'Plumber',
  'Welder',
  'Machine Operator',
  'Accountant',
  'HR Assistant',
  'IT Support',
  'Marketing Executive',
  'Engineer',
  'Nurse',
  'Teacher'
] as const;
