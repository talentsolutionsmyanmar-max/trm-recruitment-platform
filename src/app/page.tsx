'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users, Briefcase, TrendingUp, UserCheck, Plus, ArrowRight, Settings, LayoutDashboard,
  Building2, Calendar, Target, Award, BarChart3, PieChart, Activity, Bell, Search,
  LogOut, ChevronDown, Edit, Trash2, Eye, Send, Mail, Phone, MapPin, Clock,
  CheckCircle, XCircle, AlertCircle, Star, Crown, Shield, UserCog, ClipboardList,
  FileText, Download, Filter, RefreshCw, MoreVertical, Kanban, UserCircle,
  Sparkles, DollarSign, BriefcaseBusiness, CalendarDays, TrendingDown, Zap,
  Menu, X, Moon, Sun, Globe, Lock, Key, Database, Server, FileCheck,
  MessageSquare, Video, Link2, ExternalLink, Upload, FileSpreadsheet,
  ChevronRight, Play, Pause, RotateCcw, Bot, Brain, Cpu, Layers
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, AreaChart, Area, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Scatter
} from 'recharts';
import { format, formatDistanceToNow, addDays, isAfter, isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';

// ==================== TYPE DEFINITIONS ====================
type UserRole = 'md' | 'manager' | 'senior_recruiter' | 'recruiter';
type Theme = 'light' | 'dark' | 'system';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone: string;
  joinDate: string;
  avatar: string;
  status: 'active' | 'inactive' | 'on_leave';
  targets: {
    monthlyPlacements: number;
    quarterlyRevenue: number;
    clientMeetings: number;
    callsPerDay: number;
    emailsPerDay: number;
  };
  actuals: {
    placements: number;
    revenue: number;
    meetings: number;
    calls: number;
    emails: number;
  };
  managerId?: string;
  teamMembers?: string[];
  permissions: string[];
  twoFactorEnabled: boolean;
  lastLogin: string;
}

interface Client {
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
  assignedTo: string;
  totalJobs: number;
  totalPlacements: number;
  totalRevenue: number;
  website?: string;
  linkedin?: string;
  communicationHistory: CommunicationRecord[];
}

interface CommunicationRecord {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  subject: string;
  content: string;
  date: string;
  userId: string;
  userName: string;
}

interface Job {
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
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'draft' | 'open' | 'in-progress' | 'on-hold' | 'filled' | 'closed';
  createdAt: string;
  deadline: string;
  assignedTo: string;
  category: string;
  skills: string[];
  experienceRequired: number;
  educationRequired: string;
  postedTo: string[];
  applicants: number;
  pipeline: CandidatePipelineStage[];
}

interface CandidatePipelineStage {
  stage: string;
  count: number;
}

interface Candidate {
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
  status: 'new' | 'sourcing' | 'screening' | 'interviewing' | 'offered' | 'placed' | 'rejected' | 'withdrawn';
  appliedJobs: string[];
  createdAt: string;
  assignedTo: string;
  source: string;
  notes: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  matchScore?: number;
  timeline: CandidateEvent[];
  tags: string[];
}

interface CandidateEvent {
  id: string;
  type: 'applied' | 'screened' | 'interviewed' | 'offered' | 'placed' | 'rejected' | 'note';
  title: string;
  description: string;
  date: string;
  userId: string;
  userName: string;
}

interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  dateTime: string;
  duration: number;
  type: 'phone' | 'video' | 'onsite' | 'final';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
  notes: string;
  assignedTo: string;
  outcome?: 'passed' | 'failed' | 'pending';
  feedback?: InterviewFeedback;
  meetingLink?: string;
  location?: string;
}

interface InterviewFeedback {
  rating: number;
  strengths: string;
  weaknesses: string;
  recommendation: 'hire' | 'no-hire' | 'maybe';
  notes: string;
}

interface Placement {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  salary: number;
  fee: number;
  feePercentage: number;
  startDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdBy: string;
  createdAt: string;
  guaranteeEndDate: string;
  replacementStatus?: 'active' | 'replaced' | 'claimed';
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'meeting' | 'email' | 'follow_up' | 'document' | 'other';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  dueTime: string;
  relatedTo: string;
  relatedType: 'candidate' | 'client' | 'job' | 'placement' | 'general';
  relatedId?: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  reminders: TaskReminder[];
}

interface TaskReminder {
  id: string;
  time: string;
  type: 'email' | 'push' | 'sms';
  sent: boolean;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'placement' | 'interview' | 'task' | 'job' | 'candidate';
  title: string;
  description: string;
  relatedTo: string;
  relatedId?: string;
  createdAt: string;
  user: string;
  userId: string;
  metadata?: Record<string, unknown>;
}

interface Deal {
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
  assignedTo: string;
  contactPerson: string;
  competitors?: string[];
  nextAction: string;
  nextActionDate: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'outreach' | 'follow-up' | 'proposal' | 'confirmation' | 'rejection' | 'offer';
  variables: string[];
  usageCount: number;
}

interface JobBoard {
  id: string;
  name: string;
  logo: string;
  url: string;
  status: 'connected' | 'pending' | 'not_connected';
  jobsPosted: number;
  candidatesReceived: number;
}

// ==================== INITIAL DATA ====================
const initialUsers: User[] = [
  {
    id: 'u1', name: 'U Aung Myint', email: 'aungmyint@trm.com', role: 'md', department: 'Executive',
    phone: '+95 9 100 000 001', joinDate: '2020-01-15', avatar: 'AM', status: 'active',
    targets: { monthlyPlacements: 0, quarterlyRevenue: 0, clientMeetings: 0, callsPerDay: 0, emailsPerDay: 0 },
    actuals: { placements: 0, revenue: 0, meetings: 0, calls: 0, emails: 0 },
    teamMembers: ['u2', 'u3', 'u4', 'u5'],
    permissions: ['all'],
    twoFactorEnabled: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 'u2', name: 'Daw Mya Mya', email: 'myamya@trm.com', role: 'manager', department: 'Recruitment',
    phone: '+95 9 100 000 002', joinDate: '2021-03-10', avatar: 'MM', status: 'active',
    targets: { monthlyPlacements: 15, quarterlyRevenue: 50000000, clientMeetings: 12, callsPerDay: 20, emailsPerDay: 30 },
    actuals: { placements: 12, revenue: 38000000, meetings: 10, calls: 18, emails: 25 },
    managerId: 'u1', teamMembers: ['u3', 'u4', 'u5'],
    permissions: ['manage_team', 'view_reports', 'edit_clients', 'edit_jobs', 'edit_candidates'],
    twoFactorEnabled: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 'u3', name: 'Ko Zaw Zaw', email: 'zawzaw@trm.com', role: 'senior_recruiter', department: 'Recruitment',
    phone: '+95 9 100 000 003', joinDate: '2022-06-01', avatar: 'ZZ', status: 'active',
    targets: { monthlyPlacements: 8, quarterlyRevenue: 25000000, clientMeetings: 8, callsPerDay: 25, emailsPerDay: 40 },
    actuals: { placements: 6, revenue: 18000000, meetings: 7, calls: 22, emails: 35 },
    managerId: 'u2',
    permissions: ['edit_clients', 'edit_jobs', 'edit_candidates'],
    twoFactorEnabled: false,
    lastLogin: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'u4', name: 'Ma Hla Hla', email: 'hlahla@trm.com', role: 'recruiter', department: 'Recruitment',
    phone: '+95 9 100 000 004', joinDate: '2023-01-15', avatar: 'HH', status: 'active',
    targets: { monthlyPlacements: 5, quarterlyRevenue: 15000000, clientMeetings: 6, callsPerDay: 30, emailsPerDay: 50 },
    actuals: { placements: 4, revenue: 12000000, meetings: 5, calls: 28, emails: 45 },
    managerId: 'u2',
    permissions: ['edit_candidates'],
    twoFactorEnabled: false,
    lastLogin: new Date().toISOString()
  },
  {
    id: 'u5', name: 'Ko Than Than', email: 'thanthan@trm.com', role: 'recruiter', department: 'Recruitment',
    phone: '+95 9 100 000 005', joinDate: '2023-08-20', avatar: 'TT', status: 'active',
    targets: { monthlyPlacements: 5, quarterlyRevenue: 15000000, clientMeetings: 6, callsPerDay: 30, emailsPerDay: 50 },
    actuals: { placements: 3, revenue: 9000000, meetings: 4, calls: 25, emails: 40 },
    managerId: 'u2',
    permissions: ['edit_candidates'],
    twoFactorEnabled: false,
    lastLogin: new Date(Date.now() - 172800000).toISOString()
  }
];

const initialClients: Client[] = [
  {
    id: 'c1', companyName: 'Myanmar Golden Star Beverage', industry: 'Food & Beverage',
    contactPerson: 'U Thant Zin', email: 'thantzin@mgs.com', phone: '+95 9 123 456 789',
    address: 'Industrial Zone 1, Hlaing Tharyar', city: 'Yangon', status: 'active',
    notes: 'Major beverage company with 500+ employees', createdAt: '2024-01-15',
    assignedTo: 'u3', totalJobs: 12, totalPlacements: 45, totalRevenue: 45000000,
    website: 'https://mgsbeverage.com', communicationHistory: []
  },
  {
    id: 'c2', companyName: 'Shwe Taung Development Group', industry: 'Construction',
    contactPerson: 'Daw Mya Mya', email: 'myamya@shwetaung.com', phone: '+95 9 234 567 890',
    address: 'Kabar Aye Pagoda Road, Bahan', city: 'Yangon', status: 'active',
    notes: 'Leading construction company', createdAt: '2024-02-20',
    assignedTo: 'u2', totalJobs: 8, totalPlacements: 32, totalRevenue: 32000000,
    website: 'https://shwetaunggroup.com', communicationHistory: []
  },
  {
    id: 'c3', companyName: 'Parami Energy Services', industry: 'Energy & Mining',
    contactPerson: 'U Kyaw Soe', email: 'kyawsoe@parami.com', phone: '+95 9 345 678 901',
    address: 'Pyay Road, Kamayut', city: 'Yangon', status: 'active',
    notes: 'Energy sector specialists', createdAt: '2024-03-10',
    assignedTo: 'u3', totalJobs: 5, totalPlacements: 18, totalRevenue: 27000000,
    communicationHistory: []
  },
  {
    id: 'c4', companyName: 'Mandalay Garment Factory', industry: 'Textile & Garment',
    contactPerson: 'Daw Khin Khin', email: 'khinkhin@mandalaygarment.com', phone: '+95 9 456 789 012',
    address: 'Industrial Zone, Chan Mya Thar Zi', city: 'Mandalay', status: 'active',
    notes: 'Large garment manufacturing facility', createdAt: '2024-01-25',
    assignedTo: 'u4', totalJobs: 15, totalPlacements: 120, totalRevenue: 60000000,
    communicationHistory: []
  },
  {
    id: 'c5', companyName: 'Grand Myanmar Hotel Group', industry: 'Hospitality & Tourism',
    contactPerson: 'U Myo Aung', email: 'myoaung@grandmyanmar.com', phone: '+95 9 567 890 123',
    address: 'Strand Road, Kyauktada', city: 'Yangon', status: 'active',
    notes: 'Premium hotel chain across Myanmar', createdAt: '2024-02-05',
    assignedTo: 'u5', totalJobs: 10, totalPlacements: 28, totalRevenue: 28000000,
    communicationHistory: []
  },
  {
    id: 'c6', companyName: 'KBZ Bank Limited', industry: 'Banking & Finance',
    contactPerson: 'U Aung Ko', email: 'aungko@kbzbank.com', phone: '+95 9 789 012 345',
    address: 'Merchant Street, Kyauktada', city: 'Yangon', status: 'active',
    notes: 'Myanmar\'s largest private bank', createdAt: '2023-12-01',
    assignedTo: 'u3', totalJobs: 20, totalPlacements: 65, totalRevenue: 97500000,
    website: 'https://kbzbank.com', communicationHistory: []
  }
];

const initialJobs: Job[] = [
  {
    id: 'j1', title: 'Production Line Worker', clientId: 'c1', clientName: 'Myanmar Golden Star Beverage',
    location: 'Yangon - Hlaing Tharyar', salaryMin: 250000, salaryMax: 350000,
    requirements: 'Physical fitness, willingness to work shifts, basic safety awareness',
    quantity: 20, filled: 15, priority: 'high', status: 'in-progress',
    createdAt: '2024-12-01', deadline: '2025-01-15', assignedTo: 'u3', category: 'Manufacturing',
    skills: ['Machine Operation', 'Quality Control'], experienceRequired: 0, educationRequired: 'High School',
    postedTo: ['LinkedIn', 'JobNet'], applicants: 85,
    pipeline: [
      { stage: 'Applied', count: 85 },
      { stage: 'Screening', count: 45 },
      { stage: 'Interview', count: 25 },
      { stage: 'Offer', count: 18 },
      { stage: 'Hired', count: 15 }
    ]
  },
  {
    id: 'j2', title: 'Construction Site Supervisor', clientId: 'c2', clientName: 'Shwe Taung Development Group',
    location: 'Yangon - Thanlyin', salaryMin: 600000, salaryMax: 800000,
    requirements: '5+ years construction experience, team leadership skills, safety certification',
    quantity: 5, filled: 2, priority: 'urgent', status: 'in-progress',
    createdAt: '2024-12-05', deadline: '2025-01-30', assignedTo: 'u2', category: 'Construction',
    skills: ['Site Management', 'Team Leadership', 'Safety Protocols'], experienceRequired: 5,
    educationRequired: 'Bachelor in Civil Engineering', postedTo: ['LinkedIn'],
    applicants: 32,
    pipeline: [
      { stage: 'Applied', count: 32 },
      { stage: 'Screening', count: 18 },
      { stage: 'Interview', count: 8 },
      { stage: 'Offer', count: 3 },
      { stage: 'Hired', count: 2 }
    ]
  },
  {
    id: 'j3', title: 'Hotel Front Desk Manager', clientId: 'c5', clientName: 'Grand Myanmar Hotel Group',
    location: 'Bagan', salaryMin: 500000, salaryMax: 700000,
    requirements: 'English proficiency, hospitality experience, customer service excellence',
    quantity: 2, filled: 2, priority: 'medium', status: 'filled',
    createdAt: '2024-11-15', deadline: '2024-12-20', assignedTo: 'u5', category: 'Hospitality',
    skills: ['Customer Service', 'English', 'Team Management'], experienceRequired: 3,
    educationRequired: 'Bachelor in Hospitality', postedTo: ['LinkedIn', 'JobNet'],
    applicants: 48,
    pipeline: [
      { stage: 'Applied', count: 48 },
      { stage: 'Screening', count: 20 },
      { stage: 'Interview', count: 8 },
      { stage: 'Offer', count: 3 },
      { stage: 'Hired', count: 2 }
    ]
  },
  {
    id: 'j4', title: 'Garment Quality Inspector', clientId: 'c4', clientName: 'Mandalay Garment Factory',
    location: 'Mandalay', salaryMin: 300000, salaryMax: 400000,
    requirements: 'Attention to detail, garment industry experience, quality control knowledge',
    quantity: 10, filled: 7, priority: 'high', status: 'in-progress',
    createdAt: '2024-12-10', deadline: '2025-01-30', assignedTo: 'u4', category: 'Manufacturing',
    skills: ['Quality Control', 'Garment Production', 'Documentation'], experienceRequired: 2,
    educationRequired: 'High School', postedTo: ['JobNet'],
    applicants: 65,
    pipeline: [
      { stage: 'Applied', count: 65 },
      { stage: 'Screening', count: 35 },
      { stage: 'Interview', count: 18 },
      { stage: 'Offer', count: 10 },
      { stage: 'Hired', count: 7 }
    ]
  }
];

const initialCandidates: Candidate[] = [
  {
    id: 'can1', name: 'Mg Aung', email: 'mgaung@gmail.com', phone: '+95 9 111 222 333',
    location: 'Yangon - Hlaing Tharyar', skills: ['Factory Work', 'Machine Operation', 'Quality Control'],
    experience: 5, education: 'High School Graduate', currentCompany: 'Unemployed',
    expectedSalary: 300000, status: 'interviewing', appliedJobs: ['j1'],
    createdAt: '2024-12-01', assignedTo: 'u3', source: 'Walk-in',
    notes: 'Hardworking candidate with strong references', matchScore: 92,
    timeline: [
      { id: 'e1', type: 'applied', title: 'Applied for Production Line Worker', description: 'Walk-in application', date: '2024-12-01', userId: 'u3', userName: 'Ko Zaw Zaw' },
      { id: 'e2', type: 'screened', title: 'Phone Screening', description: 'Passed initial screening', date: '2024-12-03', userId: 'u3', userName: 'Ko Zaw Zaw' },
      { id: 'e3', type: 'interviewed', title: 'First Interview', description: 'Scheduled for Dec 20', date: '2024-12-18', userId: 'u3', userName: 'Ko Zaw Zaw' }
    ],
    tags: ['Experienced', 'Available Immediately']
  },
  {
    id: 'can2', name: 'Ma Hla Hla', email: 'hlahla@gmail.com', phone: '+95 9 222 333 444',
    location: 'Mandalay', skills: ['Sewing', 'Quality Inspection', 'Team Leadership'],
    experience: 8, education: 'High School', currentCompany: 'ABC Garment',
    expectedSalary: 350000, status: 'screening', appliedJobs: ['j4'],
    createdAt: '2024-12-05', assignedTo: 'u4', source: 'Referral',
    notes: 'Experienced garment worker seeking advancement', matchScore: 88,
    timeline: [
      { id: 'e4', type: 'applied', title: 'Referred by current employee', description: 'Internal referral', date: '2024-12-05', userId: 'u4', userName: 'Ma Hla Hla' }
    ],
    tags: ['Referral', 'Garment Expert']
  },
  {
    id: 'can3', name: 'U Thein Tun', email: 'theintun@gmail.com', phone: '+95 9 333 444 555',
    location: 'Yangon - South Dagon', skills: ['Construction', 'Masonry', 'Team Management', 'Safety'],
    experience: 12, education: 'Technical Certificate', currentCompany: 'Freelance',
    expectedSalary: 700000, status: 'interviewing', appliedJobs: ['j2'],
    createdAt: '2024-12-08', assignedTo: 'u2', source: 'LinkedIn',
    notes: 'Highly experienced construction professional', matchScore: 95,
    timeline: [
      { id: 'e5', type: 'applied', title: 'LinkedIn Application', description: 'Applied via LinkedIn', date: '2024-12-08', userId: 'u2', userName: 'Daw Mya Mya' },
      { id: 'e6', type: 'interviewed', title: 'Technical Interview', description: 'Excellent performance', date: '2024-12-15', userId: 'u2', userName: 'Daw Mya Mya' }
    ],
    tags: ['Senior Level', 'LinkedIn Sourced']
  }
];

const initialInterviews: Interview[] = [
  {
    id: 'int1', candidateId: 'can1', candidateName: 'Mg Aung', jobId: 'j1',
    jobTitle: 'Production Line Worker', clientId: 'c1', clientName: 'Myanmar Golden Star Beverage',
    dateTime: '2024-12-20T10:00', duration: 60, type: 'onsite', status: 'scheduled',
    notes: 'Factory tour included - bring safety shoes', assignedTo: 'u3', outcome: 'pending',
    location: 'MGS Factory, Hlaing Tharyar'
  },
  {
    id: 'int2', candidateId: 'can3', candidateName: 'U Thein Tun', jobId: 'j2',
    jobTitle: 'Construction Site Supervisor', clientId: 'c2', clientName: 'Shwe Taung Development Group',
    dateTime: '2024-12-21T14:00', duration: 90, type: 'final', status: 'scheduled',
    notes: 'Final round with project manager', assignedTo: 'u2', outcome: 'pending',
    meetingLink: 'https://zoom.us/j/123456789'
  }
];

const initialPlacements: Placement[] = [
  {
    id: 'p1', candidateId: 'can-placed-1', candidateName: 'Mg Than', jobId: 'j1',
    jobTitle: 'Production Line Worker', clientId: 'c1', clientName: 'Myanmar Golden Star Beverage',
    salary: 320000, fee: 3200000, feePercentage: 10, startDate: '2025-01-01',
    status: 'confirmed', createdBy: 'u3', createdAt: '2024-12-15',
    guaranteeEndDate: '2025-04-01'
  }
];

const initialTasks: Task[] = [
  {
    id: 't1', title: 'Follow up with KBZ Bank HR', description: 'Check on teller positions approval',
    type: 'call', priority: 'high', status: 'pending', dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '10:00', relatedTo: 'KBZ Bank Limited', relatedType: 'client', relatedId: 'c6',
    assignedTo: 'u3', createdBy: 'u2', createdAt: '2024-12-18',
    reminders: [{ id: 'r1', time: '09:30', type: 'push', sent: false }]
  },
  {
    id: 't2', title: 'Prepare interview materials', description: 'Print interview guides and evaluation forms',
    type: 'document', priority: 'medium', status: 'in_progress', dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '16:00', relatedTo: 'Mg Aung', relatedType: 'candidate', relatedId: 'can1',
    assignedTo: 'u3', createdBy: 'u3', createdAt: '2024-12-17',
    reminders: []
  }
];

const initialDeals: Deal[] = [
  {
    id: 'd1', title: 'MGS Annual Staffing Contract', clientId: 'c1', clientName: 'Myanmar Golden Star Beverage',
    value: 15000000, stage: 'negotiation', expectedCloseDate: '2025-01-30', probability: 75,
    notes: 'Annual contract for factory workers', createdAt: '2024-11-15', assignedTo: 'u3',
    contactPerson: 'U Thant Zin', nextAction: 'Send revised proposal', nextActionDate: '2024-12-22'
  },
  {
    id: 'd2', title: 'Shwe Taung Q1 Hiring', clientId: 'c2', clientName: 'Shwe Taung Development Group',
    value: 25000000, stage: 'proposal', expectedCloseDate: '2025-02-15', probability: 50,
    notes: 'Construction project staffing', createdAt: '2024-12-01', assignedTo: 'u2',
    contactPerson: 'Daw Mya Mya', nextAction: 'Follow up on proposal', nextActionDate: '2024-12-25'
  },
  {
    id: 'd3', title: 'Mandalay Garment Expansion', clientId: 'c4', clientName: 'Mandalay Garment Factory',
    value: 8000000, stage: 'won', expectedCloseDate: '2024-12-15', probability: 100,
    notes: 'Won - 100 workers placed', createdAt: '2024-11-01', assignedTo: 'u4',
    contactPerson: 'Daw Khin Khin', nextAction: 'Invoice processing', nextActionDate: '2024-12-20'
  }
];

const initialActivities: Activity[] = [
  { id: 'a1', type: 'placement', title: 'Placement Completed', description: 'Mg Than placed at MGS Beverage', relatedTo: 'MGS Beverage', createdAt: new Date().toISOString(), user: 'Ko Zaw Zaw', userId: 'u3' },
  { id: 'a2', type: 'call', title: 'Client Call', description: 'Discussed Q1 2025 staffing requirements', relatedTo: 'Shwe Taung', createdAt: new Date(Date.now() - 3600000).toISOString(), user: 'Daw Mya Mya', userId: 'u2' },
  { id: 'a3', type: 'interview', title: 'Interview Scheduled', description: 'U Thein Tun - Construction Supervisor', relatedTo: 'Shwe Taung', createdAt: new Date(Date.now() - 7200000).toISOString(), user: 'Daw Mya Mya', userId: 'u2' },
  { id: 'a4', type: 'candidate', title: 'New Candidate Added', description: 'Mg Aung applied for Production Worker', relatedTo: 'MGS Beverage', createdAt: new Date(Date.now() - 86400000).toISOString(), user: 'Ko Zaw Zaw', userId: 'u3' }
];

const initialEmailTemplates: EmailTemplate[] = [
  { id: 'et1', name: 'Interview Invitation', subject: 'Interview Invitation - {{company_name}}', body: 'Dear {{candidate_name}},\n\nWe are pleased to invite you for an interview...', category: 'confirmation', variables: ['candidate_name', 'company_name', 'date', 'time'], usageCount: 45 },
  { id: 'et2', name: 'Application Received', subject: 'Application Received - {{job_title}}', body: 'Dear {{candidate_name}},\n\nThank you for your application...', category: 'outreach', variables: ['candidate_name', 'job_title'], usageCount: 120 },
  { id: 'et3', name: 'Offer Letter', subject: 'Job Offer - {{job_title}} at {{company_name}}', body: 'Dear {{candidate_name}},\n\nWe are delighted to offer you...', category: 'offer', variables: ['candidate_name', 'job_title', 'company_name', 'salary'], usageCount: 25 }
];

const jobBoards: JobBoard[] = [
  { id: 'jb1', name: 'LinkedIn', logo: '/linkedin.png', url: 'https://linkedin.com', status: 'connected', jobsPosted: 15, candidatesReceived: 120 },
  { id: 'jb2', name: 'JobNet Myanmar', logo: '/jobnet.png', url: 'https://jobnet.com.mm', status: 'connected', jobsPosted: 22, candidatesReceived: 85 },
  { id: 'jb3', name: 'MyanmarJobs', logo: '/myanmarjobs.png', url: 'https://myanmarjobs.com', status: 'pending', jobsPosted: 0, candidatesReceived: 0 }
];

// ==================== UTILITY FUNCTIONS ====================
const formatMMK = (amount: number): string => {
  return new Intl.NumberFormat('en-MM', {
    style: 'currency',
    currency: 'MMK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('MMK', 'K');
};

const formatDate = (dateStr: string): string => {
  try {
    return format(new Date(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
};

const formatDateTime = (dateStr: string): string => {
  try {
    return format(new Date(dateStr), 'dd MMM yyyy HH:mm');
  } catch {
    return dateStr;
  }
};

const formatRelativeTime = (dateStr: string): string => {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
};

const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    md: 'Managing Director',
    manager: 'Recruitment Manager',
    senior_recruiter: 'Senior Recruiter',
    recruiter: 'Recruiter'
  };
  return labels[role];
};

const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    md: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    manager: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
    senior_recruiter: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    recruiter: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
  };
  return colors[role];
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200',
    prospect: 'bg-blue-100 text-blue-700 border-blue-200',
    open: 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    filled: 'bg-purple-100 text-purple-700',
    closed: 'bg-slate-100 text-slate-700',
    new: 'bg-cyan-100 text-cyan-700',
    sourcing: 'bg-blue-100 text-blue-700',
    screening: 'bg-yellow-100 text-yellow-700',
    interviewing: 'bg-purple-100 text-purple-700',
    offered: 'bg-orange-100 text-orange-700',
    placed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-slate-100 text-slate-700',
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700'
  };
  return colors[status] || 'bg-slate-100 text-slate-700';
};

// ==================== MAIN COMPONENT ====================
export default function TRMPlatform() {
  // Theme
  const [theme, setTheme] = useState<Theme>('light');
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [authError, setAuthError] = useState('');
  
  // User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  
  // Data State
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [placements, setPlacements] = useState<Placement[]>(initialPlacements);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [emailTemplates] = useState<EmailTemplate[]>(initialEmailTemplates);

  // UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Interview in 30 minutes', read: false },
    { id: 2, title: 'New candidate applied', read: false },
    { id: 3, title: 'Task overdue: Follow up call', read: false }
  ]);

  // Dialogs
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showCandidateDialog, setShowCandidateDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [showPlacementDialog, setShowPlacementDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  // Edit States
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Permission checks
  const isMD = currentUser?.role === 'md';
  const isManager = currentUser?.role === 'manager' || isMD;
  const isSenior = currentUser?.role === 'senior_recruiter' || isManager;
  const canManageUsers = isMD;
  const canViewAllData = isMD;
  const canManageTeam = isManager;

  // Get team members
  const teamMembers = useMemo(() => {
    if (!currentUser) return [];
    if (isMD) return users;
    if (isManager) {
      const teamIds = currentUser.teamMembers || [];
      return users.filter(u => teamIds.includes(u.id) || u.id === currentUser.id);
    }
    return [currentUser];
  }, [currentUser, users, isMD, isManager]);

  // Filter data by access
  const filteredClients = useMemo(() => {
    if (!currentUser) return [];
    if (canViewAllData) return clients;
    return clients.filter(c => c.assignedTo === currentUser.id || teamMembers.some(m => m.id === c.assignedTo));
  }, [clients, currentUser, canViewAllData, teamMembers]);

  const filteredJobs = useMemo(() => {
    if (!currentUser) return [];
    if (canViewAllData) return jobs;
    return jobs.filter(j => j.assignedTo === currentUser.id || teamMembers.some(m => m.id === j.assignedTo));
  }, [jobs, currentUser, canViewAllData, teamMembers]);

  const filteredCandidates = useMemo(() => {
    if (!currentUser) return [];
    if (canViewAllData) return candidates;
    return candidates.filter(c => c.assignedTo === currentUser.id || teamMembers.some(m => m.id === c.assignedTo));
  }, [candidates, currentUser, canViewAllData, teamMembers]);

  const filteredTasks = useMemo(() => {
    if (!currentUser) return [];
    if (canViewAllData) return tasks;
    return tasks.filter(t => t.assignedTo === currentUser.id || teamMembers.some(m => m.id === t.assignedTo));
  }, [tasks, currentUser, canViewAllData, teamMembers]);

  const filteredDeals = useMemo(() => {
    if (!currentUser) return [];
    if (canViewAllData) return deals;
    return deals.filter(d => d.assignedTo === currentUser.id || teamMembers.some(m => m.id === d.assignedTo));
  }, [deals, currentUser, canViewAllData, teamMembers]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const activeClients = filteredClients.filter(c => c.status === 'active').length;
    const activeJobs = filteredJobs.filter(j => j.status === 'open' || j.status === 'in-progress').length;
    const pipelineValue = filteredDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost').reduce((sum, d) => sum + d.value, 0);
    const monthlyPlacements = filteredCandidates.filter(c => c.status === 'placed').length;
    const totalRevenue = placements.reduce((sum, p) => sum + p.fee, 0);
    const openPositions = filteredJobs.reduce((sum, j) => sum + (j.quantity - j.filled), 0);
    const pendingTasks = filteredTasks.filter(t => t.status === 'pending').length;
    const upcomingInterviews = interviews.filter(i => i.status === 'scheduled').length;
    const avgTimeToHire = 18; // Mock: days
    const fillRate = filteredJobs.length > 0 ? Math.round((filteredJobs.reduce((sum, j) => sum + j.filled, 0) / filteredJobs.reduce((sum, j) => sum + j.quantity, 0)) * 100) : 0;

    return {
      activeClients,
      activeJobs,
      pipelineValue,
      monthlyPlacements,
      totalRevenue,
      openPositions,
      pendingTasks,
      upcomingInterviews,
      avgTimeToHire,
      fillRate
    };
  }, [filteredClients, filteredJobs, filteredDeals, filteredCandidates, filteredTasks, interviews, placements]);

  // Chart data
  const placementTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, idx) => ({
      month,
      placements: Math.floor(Math.random() * 15) + 5,
      revenue: Math.floor(Math.random() * 30) + 10,
      target: 12
    }));
  }, []);

  const sourceEffectivenessData = useMemo(() => [
    { name: 'Walk-in', value: 35, color: '#3b82f6' },
    { name: 'LinkedIn', value: 28, color: '#0077b5' },
    { name: 'Referral', value: 20, color: '#10b981' },
    { name: 'Job Boards', value: 12, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#6b7280' }
  ], []);

  const teamPerformanceData = useMemo(() => {
    return teamMembers.filter(m => m.role !== 'md').map(m => ({
      name: m.name.split(' ')[0],
      placements: m.actuals.placements,
      target: m.targets.monthlyPlacements,
      revenue: m.actuals.revenue / 1000000,
      calls: m.actuals.calls,
      emails: m.actuals.emails
    }));
  }, [teamMembers]);

  const pipelineFunnelData = useMemo(() => {
    const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
    return stages.map((stage, idx) => ({
      stage,
      count: Math.floor(Math.pow(0.6, idx) * 100),
      dropOff: idx > 0 ? Math.floor((1 - Math.pow(0.6, idx) / Math.pow(0.6, idx - 1)) * 100) : 0
    }));
  }, []);

  // Activity handler
  const addActivity = useCallback((type: Activity['type'], title: string, description: string, relatedTo: string, relatedId?: string) => {
    if (!currentUser) return;
    const newActivity: Activity = {
      id: `a${Date.now()}`,
      type,
      title,
      description,
      relatedTo,
      relatedId,
      createdAt: new Date().toISOString(),
      user: currentUser.name,
      userId: currentUser.id
    };
    setActivities(prev => [newActivity, ...prev]);
  }, [currentUser]);

  // ==================== LOGIN SCREEN ====================
  const renderLoginScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md relative z-10 border-0 shadow-2xl">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Talent Resources Myanmar</h1>
            <p className="text-slate-500 mt-1">Enterprise Recruitment Platform</p>
          </div>

          {authError && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-600">{authError}</AlertDescription>
            </Alert>
          )}

          {!show2FA ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@trm.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="mt-1.5 h-11"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1.5 h-11"
                />
              </div>
              <Button
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => {
                  const user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
                  if (user) {
                    if (user.twoFactorEnabled) {
                      setShow2FA(true);
                    } else {
                      setCurrentUser(user);
                      setIsAuthenticated(true);
                      addActivity('note', 'User Login', `${user.name} logged in`, 'System');
                    }
                  } else {
                    setAuthError('Invalid email or password');
                  }
                }}
              >
                <Lock className="h-4 w-4 mr-2" />
                Sign In
              </Button>

              <div className="relative my-6">
                <Separator />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-500">
                  Quick Login (Demo)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {users.slice(0, 4).map(user => (
                  <Button
                    key={user.id}
                    variant="outline"
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    onClick={() => {
                      setCurrentUser(user);
                      setIsAuthenticated(true);
                    }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={getRoleBadgeColor(user.role)}>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-500">{getRoleLabel(user.role)}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Key className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Enter the 6-digit code from your authenticator app</p>
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Input
                    key={i}
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl font-bold"
                    value={twoFACode[i - 1] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 1) {
                        const newCode = twoFACode.split('');
                        newCode[i - 1] = val;
                        setTwoFACode(newCode.join(''));
                        if (val && i < 6) {
                          (e.target.nextElementSibling as HTMLInputElement)?.focus();
                        }
                      }
                    }}
                  />
                ))}
              </div>
              <Button
                className="w-full h-11"
                onClick={() => {
                  const user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
                  if (user && twoFACode.length === 6) {
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                    setShow2FA(false);
                  }
                }}
              >
                Verify
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setShow2FA(false);
                  setTwoFACode('');
                }}
              >
                Back to login
              </Button>
            </div>
          )}

          <p className="text-center text-xs text-slate-400 mt-6">
            © 2024 Talent Resources Myanmar. All rights reserved.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== SIDEBAR ====================
  const renderSidebar = () => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'pipeline', label: 'Pipeline', icon: Kanban, badge: deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length },
      { id: 'clients', label: 'Clients', icon: Building2, badge: filteredClients.filter(c => c.status === 'active').length },
      { id: 'jobs', label: 'Job Orders', icon: Briefcase, badge: filteredJobs.filter(j => j.status === 'open' || j.status === 'in-progress').length },
      { id: 'candidates', label: 'Candidates', icon: UserCircle, badge: filteredCandidates.length },
      { id: 'interviews', label: 'Interviews', icon: Calendar, badge: interviews.filter(i => i.status === 'scheduled').length },
      { id: 'placements', label: 'Placements', icon: UserCheck },
      { id: 'tasks', label: 'Tasks', icon: ClipboardList, badge: filteredTasks.filter(t => t.status === 'pending').length },
    ];

    const adminItems = [
      { id: 'team', label: 'Team', icon: Users, condition: isManager },
      { id: 'reports', label: 'Reports', icon: BarChart3, condition: isManager },
      { id: 'admin', label: 'Admin Panel', icon: Shield, condition: isMD },
    ];

    return (
      <aside className={`flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700/50">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent whitespace-nowrap">
                Talent Resources
              </h1>
              <p className="text-[10px] text-blue-300 font-medium whitespace-nowrap">Myanmar</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge className="h-5 min-w-5 px-1.5 text-[10px] bg-white/20 text-white border-0">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            ))}

            {/* Admin Section */}
            {adminItems.some(item => item.condition) && (
              <>
                <Separator className="my-3 bg-slate-700/50" />
                <p className={`px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
                  Management
                </p>
                {adminItems.filter(item => item.condition).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                ))}
              </>
            )}
          </nav>
        </ScrollArea>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 p-2">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>

        {/* User Profile */}
        {currentUser && (
          <div className="border-t border-slate-700/50 p-2">
            <button
              onClick={() => setShowUserProfile(true)}
              className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarFallback className={getRoleBadgeColor(currentUser.role)}>
                  {currentUser.avatar}
                </AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{getRoleLabel(currentUser.role)}</p>
                </div>
              )}
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            </button>
          </div>
        )}
      </aside>
    );
  };

  // ==================== HEADER ====================
  const renderHeader = () => (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-9 w-9">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div>
          <h1 className="text-lg font-bold text-slate-800 capitalize">{activeTab}</h1>
          {currentUser && (
            <p className="text-[10px] text-slate-500">{getRoleLabel(currentUser.role)} View</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9 h-9 bg-slate-100 border-0 focus:bg-white text-sm"
          />
        </div>

        {/* Quick Actions */}
        <Button size="sm" className="hidden lg:flex h-9 bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => setShowCandidateDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Candidate
        </Button>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => setShowNotifications(true)}>
          <Bell className="h-4 w-4 text-slate-600" />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </Button>

        {/* User Avatar */}
        {currentUser && (
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setShowUserProfile(true)}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className={getRoleBadgeColor(currentUser.role)}>
                {currentUser.avatar}
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      </div>
    </header>
  );

  // ==================== DASHBOARD ====================
  const renderDashboard = () => {
    if (!currentUser) return null;

    const completionRate = currentUser.targets.monthlyPlacements > 0
      ? Math.round((currentUser.actuals.placements / currentUser.targets.monthlyPlacements) * 100)
      : 0;

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {currentUser.name.split(' ')[0]}! 👋</h2>
              <p className="text-blue-100 text-sm">
                {isManager
                  ? `Your team has ${metrics.pendingTasks} pending tasks and ${metrics.upcomingInterviews} interviews scheduled today.`
                  : `You have ${metrics.pendingTasks} pending tasks and ${metrics.upcomingInterviews} interviews today.`
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowTaskDialog(true)} className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm h-9">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
              <Button onClick={() => setShowCandidateDialog(true)} className="bg-white text-blue-600 hover:bg-blue-50 h-9">
                <Plus className="h-4 w-4 mr-1" />
                Add Candidate
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Active Clients', value: metrics.activeClients, icon: Building2, color: 'from-blue-500 to-cyan-500', change: '+12%' },
            { label: 'Open Jobs', value: metrics.activeJobs, icon: Briefcase, color: 'from-purple-500 to-pink-500', change: '+8%' },
            { label: 'Pipeline Value', value: formatMMK(metrics.pipelineValue), icon: TrendingUp, color: 'from-green-500 to-emerald-500', change: '+15%' },
            { label: 'Placements', value: metrics.monthlyPlacements, icon: UserCheck, color: 'from-orange-500 to-amber-500', change: '+25%' },
            { label: 'Fill Rate', value: `${metrics.fillRate}%`, icon: Target, color: 'from-indigo-500 to-violet-500', change: '+5%' },
            { label: 'Avg Time to Hire', value: `${metrics.avgTimeToHire}d`, icon: Clock, color: 'from-rose-500 to-pink-500', change: '-3d' },
          ].map((stat, idx) => (
            <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <Badge className="text-[10px] bg-green-100 text-green-700 border-0">{stat.change}</Badge>
                </div>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-[11px] text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Trend */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={placementTrendData}>
                  <defs>
                    <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="placements" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPlacements)" strokeWidth={2} />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Source Effectiveness */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Candidate Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie data={sourceEffectivenessData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {sourceEffectivenessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {sourceEffectivenessData.slice(0, 4).map((source, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-slate-600">{source.name}: {source.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal KPI & Team Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal KPIs */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                {isManager ? 'Team KPIs' : 'My KPIs'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Monthly Placements', current: currentUser.actuals.placements, target: currentUser.targets.monthlyPlacements, color: 'bg-blue-500' },
                { label: 'Quarterly Revenue', current: currentUser.actuals.revenue, target: currentUser.targets.quarterlyRevenue, color: 'bg-green-500', format: (v: number) => formatMMK(v) },
                { label: 'Client Meetings', current: currentUser.actuals.meetings, target: currentUser.targets.clientMeetings, color: 'bg-purple-500' },
              ].map((kpi, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{kpi.label}</span>
                    <span className="font-semibold text-slate-800">
                      {kpi.format ? kpi.format(kpi.current) : kpi.current} / {kpi.format ? kpi.format(kpi.target) : kpi.target}
                    </span>
                  </div>
                  <Progress value={(kpi.current / kpi.target) * 100} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Team Performance (Managers only) */}
          {isManager && (
            <Card className="lg:col-span-2 border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-500" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={teamPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="placements" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Placements" />
                    <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {activities.slice(0, 8).map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'placement' ? 'bg-green-100 text-green-600' :
                        activity.type === 'call' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'interview' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'candidate' ? 'bg-cyan-100 text-cyan-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {activity.type === 'placement' ? <UserCheck className="h-4 w-4" /> :
                         activity.type === 'call' ? <Phone className="h-4 w-4" /> :
                         activity.type === 'interview' ? <Calendar className="h-4 w-4" /> :
                         activity.type === 'candidate' ? <UserCircle className="h-4 w-4" /> :
                         <ClipboardList className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                        <p className="text-xs text-slate-500 truncate">{activity.description}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatRelativeTime(activity.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Upcoming Tasks</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600" onClick={() => setActiveTab('tasks')}>
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {filteredTasks.filter(t => t.status !== 'completed').slice(0, 6).map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        task.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {task.type === 'call' ? <Phone className="h-4 w-4" /> :
                         task.type === 'meeting' ? <Calendar className="h-4 w-4" /> :
                         task.type === 'email' ? <Mail className="h-4 w-4" /> :
                         <ClipboardList className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                        <p className="text-[10px] text-slate-500">Due: {formatDate(task.dueDate)} at {task.dueTime}</p>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${getStatusColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ==================== PIPELINE ====================
  const renderPipeline = () => {
    const stages: Deal['stage'][] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    const stageConfig: Record<Deal['stage'], { color: string; label: string; icon: React.ElementType }> = {
      lead: { color: 'from-slate-400 to-slate-500', label: 'Lead', icon: Sparkles },
      qualified: { color: 'from-blue-400 to-blue-500', label: 'Qualified', icon: CheckCircle },
      proposal: { color: 'from-purple-400 to-purple-500', label: 'Proposal', icon: FileText },
      negotiation: { color: 'from-orange-400 to-orange-500', label: 'Negotiation', icon: MessageSquare },
      won: { color: 'from-green-400 to-green-500', label: 'Won', icon: Award },
      lost: { color: 'from-red-400 to-red-500', label: 'Lost', icon: XCircle }
    };

    return (
      <div className="space-y-6">
        {/* Pipeline Summary */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Sales Pipeline</h2>
            <p className="text-sm text-slate-500">Track and manage your deals</p>
          </div>
          <Button onClick={() => { setEditingDeal(null); setShowDealDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Deal
          </Button>
        </div>

        {/* Stage Summary Cards */}
        <div className="grid grid-cols-6 gap-3">
          {stages.map(stage => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            const config = stageConfig[stage];
            return (
              <Card key={stage} className="border-0 shadow-sm">
                <CardContent className="p-3 text-center">
                  <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-md mx-auto mb-2`}>
                    <config.icon className="h-4 w-4" />
                  </div>
                  <p className="text-lg font-bold text-slate-800">{stageDeals.length}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{stage}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{formatMMK(stageValue)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-6 gap-3 overflow-x-auto">
          {stages.map(stage => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage);
            const config = stageConfig[stage];
            return (
              <div key={stage} className="min-w-[220px]">
                <div className={`p-2 rounded-t-xl bg-gradient-to-r ${config.color} text-white flex items-center justify-between`}>
                  <span className="text-sm font-medium">{config.label}</span>
                  <Badge className="h-5 px-1.5 bg-white/20 text-white border-0 text-[10px]">{stageDeals.length}</Badge>
                </div>
                <div className="bg-slate-100 rounded-b-xl p-2 space-y-2 min-h-[300px]">
                  {stageDeals.map(deal => (
                    <Card
                      key={deal.id}
                      className="cursor-pointer hover:shadow-md transition-shadow border-0"
                      onClick={() => { setEditingDeal(deal); setShowDealDialog(true); }}
                    >
                      <CardContent className="p-3">
                        <p className="text-sm font-semibold text-slate-800 mb-1">{deal.title}</p>
                        <p className="text-[10px] text-slate-500 mb-2">{deal.clientName}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-green-600">{formatMMK(deal.value)}</span>
                          <Badge variant="outline" className="text-[10px]">{deal.probability}%</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ==================== CANDIDATES ====================
  const renderCandidates = () => {
    const statusOrder: Candidate['status'][] = ['new', 'sourcing', 'screening', 'interviewing', 'offered', 'placed', 'rejected', 'withdrawn'];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Candidate Pipeline</h2>
            <p className="text-sm text-slate-500">{filteredCandidates.length} candidates in pipeline</p>
          </div>
          <Button onClick={() => { setEditingCandidate(null); setShowCandidateDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Candidate
          </Button>
        </div>

        {/* Pipeline Summary */}
        <div className="grid grid-cols-8 gap-2">
          {statusOrder.map(status => {
            const count = filteredCandidates.filter(c => c.status === status).length;
            return (
              <div key={status} className="text-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <p className="text-lg font-bold text-slate-800">{count}</p>
                <p className="text-[10px] text-slate-500 capitalize">{status}</p>
              </div>
            );
          })}
        </div>

        {/* Candidate Table */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Candidate</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Skills</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Experience</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Salary</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Match</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map(candidate => (
                    <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                              {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{candidate.name}</p>
                            <p className="text-[10px] text-slate-500">{candidate.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-slate-600">{candidate.email}</p>
                        <p className="text-[10px] text-slate-500">{candidate.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px] py-0">{skill}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{candidate.experience} yrs</p>
                        <p className="text-[10px] text-slate-500">{candidate.education}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-green-600">{formatMMK(candidate.expectedSalary)}</p>
                      </td>
                      <td className="px-4 py-3">
                        {candidate.matchScore && (
                          <div className="flex items-center gap-2">
                            <Progress value={candidate.matchScore} className="h-1.5 w-12" />
                            <span className="text-xs font-medium">{candidate.matchScore}%</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-[10px] ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setSelectedCandidate(candidate); setActiveTab('candidate-detail'); }}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditingCandidate(candidate); setShowCandidateDialog(true); }}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // ==================== JOBS ====================
  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Job Orders</h2>
          <p className="text-sm text-slate-500">{filteredJobs.length} positions • {filteredJobs.reduce((sum, j) => sum + j.quantity - j.filled, 0)} open</p>
        </div>
        <Button onClick={() => { setEditingJob(null); setShowJobDialog(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Create Job
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredJobs.map(job => (
          <Card key={job.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setEditingJob(job); setShowJobDialog(true); }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge className={`text-[10px] mb-2 ${getStatusColor(job.priority)}`}>
                    {job.priority.toUpperCase()} PRIORITY
                  </Badge>
                  <h3 className="font-semibold text-slate-800">{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.clientName}</p>
                </div>
                <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Filled</span>
                    <span className="font-semibold">{job.filled}/{job.quantity}</span>
                  </div>
                  <Progress value={(job.filled / job.quantity) * 100} className="h-1.5" />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Salary</span>
                  <span className="font-medium">{formatMMK(job.salaryMin)} - {formatMMK(job.salaryMax)}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium">{job.location}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Deadline</span>
                  <span className={`font-medium ${isAfter(new Date(job.deadline), new Date()) ? 'text-slate-800' : 'text-red-500'}`}>
                    {formatDate(job.deadline)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ==================== CLIENTS ====================
  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Clients</h2>
          <p className="text-sm text-slate-500">{filteredClients.filter(c => c.status === 'active').length} active clients</p>
        </div>
        <Button onClick={() => { setEditingClient(null); setShowClientDialog(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <Card key={client.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setEditingClient(client); setShowClientDialog(true); }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {client.companyName.substring(0, 2).toUpperCase()}
                </div>
                <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{client.companyName}</h3>
              <p className="text-xs text-slate-500 mb-3">{client.industry}</p>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {client.totalJobs}</span>
                <span className="flex items-center gap-1"><UserCheck className="h-3.5 w-3.5" /> {client.totalPlacements}</span>
                <span className="flex items-center gap-1 text-green-600 font-medium">{formatMMK(client.totalRevenue)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ==================== TASKS ====================
  const renderTasks = () => {
    const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
    const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
    const completedTasks = filteredTasks.filter(t => t.status === 'completed');

    const handleTaskStatus = (taskId: string, newStatus: Task['status']) => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      const task = tasks.find(t => t.id === taskId);
      if (task && newStatus === 'completed') {
        addActivity('task', 'Task Completed', task.title, task.relatedTo);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Task Manager</h2>
            <p className="text-sm text-slate-500">{pendingTasks.length} pending • {inProgressTasks.length} in progress</p>
          </div>
          <Button onClick={() => { setEditingTask(null); setShowTaskDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending */}
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-xl py-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Pending</span>
                <Badge className="bg-white/20 text-white border-0">{pendingTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 max-h-96 overflow-y-auto">
              {pendingTasks.map(task => (
                <div key={task.id} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-slate-800">{task.title}</p>
                    <Badge className={`text-[10px] ${getStatusColor(task.priority)}`}>{task.priority}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Due: {formatDate(task.dueDate)}</span>
                    <Button size="sm" className="h-6 text-[10px]" onClick={() => handleTaskStatus(task.id, 'in_progress')}>Start</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-xl py-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> In Progress</span>
                <Badge className="bg-white/20 text-white border-0">{inProgressTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 max-h-96 overflow-y-auto">
              {inProgressTasks.map(task => (
                <div key={task.id} className="p-3 rounded-lg bg-blue-50">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-slate-800">{task.title}</p>
                    <Badge className="bg-blue-100 text-blue-700 text-[10px]">{task.type}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Due: {formatDate(task.dueDate)}</span>
                    <Button size="sm" className="h-6 text-[10px]" onClick={() => handleTaskStatus(task.id, 'completed')}>Complete</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-xl py-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Completed</span>
                <Badge className="bg-white/20 text-white border-0">{completedTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 max-h-96 overflow-y-auto">
              {completedTasks.map(task => (
                <div key={task.id} className="p-3 rounded-lg bg-green-50 opacity-75">
                  <p className="text-sm font-medium text-slate-800 line-through">{task.title}</p>
                  <p className="text-[10px] text-slate-500">{task.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ==================== INTERVIEWS ====================
  const renderInterviews = () => {
    const upcoming = interviews.filter(i => i.status === 'scheduled');
    const past = interviews.filter(i => i.status !== 'scheduled');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Interviews</h2>
            <p className="text-sm text-slate-500">{upcoming.length} scheduled</p>
          </div>
          <Button onClick={() => setShowInterviewDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Schedule Interview
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {upcoming.map(interview => (
                <div key={interview.id} className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-800">{interview.candidateName}</p>
                      <p className="text-xs text-slate-500">{interview.jobTitle}</p>
                    </div>
                    <Badge className={getStatusColor(interview.type)}>{interview.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatDateTime(interview.dateTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {interview.meetingLink && (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => window.open(interview.meetingLink, '_blank')}>
                        <Video className="h-3 w-3 mr-1" /> Join Meeting
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-7 text-xs">Reschedule</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-t-xl py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Completed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {past.map(interview => (
                <div key={interview.id} className="p-4 rounded-lg bg-slate-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-800">{interview.candidateName}</p>
                      <p className="text-xs text-slate-500">{interview.jobTitle}</p>
                    </div>
                    <Badge className={interview.outcome === 'passed' ? 'bg-green-100 text-green-700' : interview.outcome === 'failed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}>
                      {interview.outcome || 'pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ==================== PLACEMENTS ====================
  const renderPlacements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Placements</h2>
          <p className="text-sm text-slate-500">{placements.length} successful placements</p>
        </div>
        <Button onClick={() => setShowPlacementDialog(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Placement
        </Button>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-5">
            <p className="text-sm opacity-80 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold">{formatMMK(metrics.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-5">
            <p className="text-sm opacity-80 mb-1">This Month</p>
            <p className="text-2xl font-bold">{placements.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <CardContent className="p-5">
            <p className="text-sm opacity-80 mb-1">Avg Fee</p>
            <p className="text-2xl font-bold">{formatMMK(metrics.totalRevenue / (placements.length || 1))}</p>
          </CardContent>
        </Card>
      </div>

      {/* Placements Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Candidate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Position</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Salary</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Fee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {placements.map(placement => (
                <tr key={placement.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium">{placement.candidateName}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{placement.jobTitle}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{placement.clientName}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatMMK(placement.salary)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600">{formatMMK(placement.fee)}</td>
                  <td className="px-4 py-3">
                    <Badge className={getStatusColor(placement.status)}>{placement.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== TEAM ====================
  const renderTeam = () => {
    if (!isManager) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Team Management</h2>
            <p className="text-sm text-slate-500">{teamMembers.length} team members</p>
          </div>
          {canManageUsers && (
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Member
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(member => {
            const completionRate = member.targets.monthlyPlacements > 0
              ? Math.round((member.actuals.placements / member.targets.monthlyPlacements) * 100)
              : 0;
            return (
              <Card key={member.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className={getRoleBadgeColor(member.role)}>
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-800">{member.name}</p>
                        <Badge className={`text-[10px] ${getRoleBadgeColor(member.role)}`}>
                          {getRoleLabel(member.role)}
                        </Badge>
                      </div>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${member.status === 'active' ? 'bg-green-400' : 'bg-slate-300'}`} />
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Placements</span>
                        <span className="font-medium">{member.actuals.placements}/{member.targets.monthlyPlacements}</span>
                      </div>
                      <Progress value={completionRate} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Revenue</span>
                      <span className="font-bold text-green-600">{formatMMK(member.actuals.revenue)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Meetings</span>
                      <span className="font-medium">{member.actuals.meetings}/{member.targets.clientMeetings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // ==================== REPORTS ====================
  const renderReports = () => {
    if (!isManager) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Reports & Analytics</h2>
            <p className="text-sm text-slate-500">Performance insights and metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="month">
              <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-9">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Placements', value: teamMembers.reduce((sum, m) => sum + m.actuals.placements, 0), icon: UserCheck, color: 'text-green-600' },
            { label: 'Total Revenue', value: formatMMK(teamMembers.reduce((sum, m) => sum + m.actuals.revenue, 0)), icon: DollarSign, color: 'text-blue-600' },
            { label: 'Avg Fill Rate', value: `${metrics.fillRate}%`, icon: Target, color: 'text-purple-600' },
            { label: 'Active Clients', value: metrics.activeClients, icon: Building2, color: 'text-orange-600' },
          ].map((stat, idx) => (
            <Card key={idx} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-[10px] text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Placement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={placementTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="placements" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={pipelineFunnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={11} width={70} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ==================== ADMIN ====================
  const renderAdmin = () => {
    if (!isMD) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
            <p className="text-sm text-slate-500">System administration and configuration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('team')}>
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <UserCog className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">User Management</h3>
              <p className="text-xs text-slate-500 mb-3">Manage team members and roles</p>
              <p className="text-xl font-bold text-blue-600">{users.length} Users</p>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Security</h3>
              <p className="text-xs text-slate-500 mb-3">Authentication & permissions</p>
              <p className="text-xl font-bold text-purple-600">2FA Active</p>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Database className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Data Management</h3>
              <p className="text-xs text-slate-500 mb-3">Export and backup data</p>
              <Button variant="outline" className="mt-2">
                <Download className="h-4 w-4 mr-1" /> Export All
              </Button>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Link2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Integrations</h3>
              <p className="text-xs text-slate-500 mb-3">Connected services</p>
              <p className="text-xl font-bold text-orange-600">{jobBoards.filter(j => j.status === 'connected').length} Active</p>
            </CardContent>
          </Card>

          {/* Email Templates */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Email Templates</h3>
              <p className="text-xs text-slate-500 mb-3">Manage email templates</p>
              <p className="text-xl font-bold text-cyan-600">{emailTemplates.length} Templates</p>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Activity Log</h3>
              <p className="text-xs text-slate-500 mb-3">System activity history</p>
              <p className="text-xl font-bold text-slate-600">{activities.length} Events</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ==================== DIALOGS ====================
  
  // Settings Dialog
  const renderSettingsDialog = () => (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Settings
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input defaultValue={currentUser?.name} className="mt-1.5" />
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue={currentUser?.email} className="mt-1.5" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input defaultValue={currentUser?.phone} className="mt-1.5" />
              </div>
              <div>
                <Label>Department</Label>
                <Input defaultValue={currentUser?.department} disabled className="mt-1.5 bg-slate-50" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="security" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-slate-500">Add an extra layer of security</p>
              </div>
              <Switch checked={currentUser?.twoFactorEnabled} />
            </div>
            <Button variant="outline" className="w-full">
              <Key className="h-4 w-4 mr-2" /> Change Password
            </Button>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4 mt-4">
            {[
              { label: 'Email Notifications', desc: 'Receive email updates' },
              { label: 'Task Reminders', desc: 'Get reminded about pending tasks' },
              { label: 'Interview Alerts', desc: 'Notifications for scheduled interviews' },
              { label: 'Weekly Reports', desc: 'Receive weekly performance summary' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowSettings(false)}>Cancel</Button>
          <Button onClick={() => setShowSettings(false)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // User Profile Dialog
  const renderUserProfileDialog = () => (
    <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        {currentUser && (
          <div className="text-center py-4">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarFallback className={`text-xl ${getRoleBadgeColor(currentUser.role)}`}>
                {currentUser.avatar}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg text-slate-800">{currentUser.name}</h3>
            <p className="text-sm text-slate-500 mb-2">{currentUser.email}</p>
            <Badge className={getRoleBadgeColor(currentUser.role)}>{getRoleLabel(currentUser.role)}</Badge>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{currentUser.actuals.placements}</p>
                <p className="text-xs text-slate-500">Placements</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{formatMMK(currentUser.actuals.revenue)}</p>
                <p className="text-xs text-slate-500">Revenue</p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4" onClick={() => { setShowUserProfile(false); setShowSettings(true); }}>
              <Settings className="h-4 w-4 mr-2" /> Edit Settings
            </Button>
            <Button variant="ghost" className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { setIsAuthenticated(false); setCurrentUser(null); setShowUserProfile(false); }}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Notifications Dialog
  const renderNotificationsDialog = () => (
    <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {notifications.map(notification => (
            <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-slate-50' : 'bg-blue-50 border border-blue-100'}`}>
              <p className="text-sm font-medium text-slate-800">{notification.title}</p>
              <p className="text-xs text-slate-500">Just now</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full" onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); setShowNotifications(false); }}>
          Mark all as read
        </Button>
      </DialogContent>
    </Dialog>
  );

  // Task Dialog
  const renderTaskDialog = () => (
    <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Title</Label>
            <Input placeholder="Task title" defaultValue={editingTask?.title} id="taskTitle" className="mt-1.5" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea placeholder="Task details..." defaultValue={editingTask?.description} id="taskDesc" className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select defaultValue={editingTask?.type || 'call'}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select defaultValue={editingTask?.priority || 'medium'}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Due Date</Label>
              <Input type="date" defaultValue={editingTask?.dueDate} id="taskDue" className="mt-1.5" />
            </div>
            <div>
              <Label>Due Time</Label>
              <Input type="time" defaultValue={editingTask?.dueTime} id="taskTime" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Related To</Label>
            <Input placeholder="Client, candidate, or job name" defaultValue={editingTask?.relatedTo} id="taskRelated" className="mt-1.5" />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowTaskDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            const title = (document.getElementById('taskTitle') as HTMLInputElement)?.value;
            const description = (document.getElementById('taskDesc') as HTMLTextAreaElement)?.value;
            const dueDate = (document.getElementById('taskDue') as HTMLInputElement)?.value;
            const dueTime = (document.getElementById('taskTime') as HTMLInputElement)?.value;
            const relatedTo = (document.getElementById('taskRelated') as HTMLInputElement)?.value;
            
            if (editingTask) {
              setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, title, description, dueDate, dueTime, relatedTo } : t));
            } else if (currentUser) {
              const newTask: Task = {
                id: `t${Date.now()}`,
                title: title || '',
                description: description || '',
                type: 'other',
                priority: 'medium',
                status: 'pending',
                dueDate: dueDate || format(new Date(), 'yyyy-MM-dd'),
                dueTime: dueTime || '09:00',
                relatedTo: relatedTo || '',
                relatedType: 'general',
                assignedTo: currentUser.id,
                createdBy: currentUser.id,
                createdAt: new Date().toISOString(),
                reminders: []
              };
              setTasks(prev => [...prev, newTask]);
              addActivity('task', 'Task Created', newTask.title, relatedTo || 'General');
            }
            setShowTaskDialog(false);
            setEditingTask(null);
          }}>
            {editingTask ? 'Update' : 'Add'} Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Candidate Dialog
  const renderCandidateDialog = () => (
    <Dialog open={showCandidateDialog} onOpenChange={setShowCandidateDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label>Full Name</Label>
            <Input placeholder="Candidate name" defaultValue={editingCandidate?.name} id="candName" className="mt-1.5" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input placeholder="+95 9 XXX XXX XXX" defaultValue={editingCandidate?.phone} id="candPhone" className="mt-1.5" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="email@example.com" defaultValue={editingCandidate?.email} id="candEmail" className="mt-1.5" />
          </div>
          <div>
            <Label>Location</Label>
            <Input placeholder="City, Township" defaultValue={editingCandidate?.location} id="candLocation" className="mt-1.5" />
          </div>
          <div>
            <Label>Experience (Years)</Label>
            <Input type="number" placeholder="5" defaultValue={editingCandidate?.experience} id="candExp" className="mt-1.5" />
          </div>
          <div>
            <Label>Expected Salary (MMK)</Label>
            <Input type="number" placeholder="500000" defaultValue={editingCandidate?.expectedSalary} id="candSalary" className="mt-1.5" />
          </div>
          <div>
            <Label>Education</Label>
            <Input placeholder="Highest education" defaultValue={editingCandidate?.education} id="candEdu" className="mt-1.5" />
          </div>
          <div>
            <Label>Current Company</Label>
            <Input placeholder="Current employer" defaultValue={editingCandidate?.currentCompany} id="candCompany" className="mt-1.5" />
          </div>
          <div>
            <Label>Source</Label>
            <Select defaultValue={editingCandidate?.source || 'Walk-in'}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Walk-in">Walk-in</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Job Board">Job Board</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select defaultValue={editingCandidate?.status || 'new'}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="sourcing">Sourcing</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Skills (comma separated)</Label>
            <Input placeholder="e.g. Customer Service, MS Office, English" defaultValue={editingCandidate?.skills?.join(', ')} id="candSkills" className="mt-1.5" />
          </div>
          <div className="col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes..." defaultValue={editingCandidate?.notes} id="candNotes" className="mt-1.5" />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowCandidateDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            const name = (document.getElementById('candName') as HTMLInputElement)?.value;
            const phone = (document.getElementById('candPhone') as HTMLInputElement)?.value;
            const email = (document.getElementById('candEmail') as HTMLInputElement)?.value;
            const location = (document.getElementById('candLocation') as HTMLInputElement)?.value;
            const experience = parseInt((document.getElementById('candExp') as HTMLInputElement)?.value) || 0;
            const expectedSalary = parseInt((document.getElementById('candSalary') as HTMLInputElement)?.value) || 0;
            const education = (document.getElementById('candEdu') as HTMLInputElement)?.value;
            const currentCompany = (document.getElementById('candCompany') as HTMLInputElement)?.value;
            const skillsStr = (document.getElementById('candSkills') as HTMLInputElement)?.value;
            const skills = skillsStr?.split(',').map(s => s.trim()).filter(Boolean);
            const notes = (document.getElementById('candNotes') as HTMLTextAreaElement)?.value;
            
            if (editingCandidate) {
              setCandidates(prev => prev.map(c => c.id === editingCandidate.id ? { ...c, name, phone, email, location, experience, expectedSalary, education, currentCompany, skills, notes } : c));
            } else if (currentUser) {
              const newCandidate: Candidate = {
                id: `can${Date.now()}`,
                name: name || '',
                phone: phone || '',
                email: email || '',
                location: location || '',
                experience,
                expectedSalary,
                education: education || '',
                currentCompany: currentCompany || '',
                status: 'new',
                appliedJobs: [],
                createdAt: new Date().toISOString(),
                assignedTo: currentUser.id,
                source: 'Walk-in',
                notes: notes || '',
                skills: skills || [],
                timeline: [],
                tags: []
              };
              setCandidates(prev => [...prev, newCandidate]);
              addActivity('candidate', 'Candidate Added', `New candidate: ${name}`, name || '');
            }
            setShowCandidateDialog(false);
            setEditingCandidate(null);
          }}>
            {editingCandidate ? 'Update' : 'Add'} Candidate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // ==================== MAIN RENDER ====================
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'pipeline': return renderPipeline();
      case 'clients': return renderClients();
      case 'jobs': return renderJobs();
      case 'candidates': return renderCandidates();
      case 'interviews': return renderInterviews();
      case 'placements': return renderPlacements();
      case 'tasks': return renderTasks();
      case 'team': return renderTeam();
      case 'reports': return renderReports();
      case 'admin': return renderAdmin();
      default: return renderDashboard();
    }
  };

  // ==================== APP RENDER ====================
  if (!isAuthenticated || !currentUser) {
    return renderLoginScreen();
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {renderSidebar()}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderHeader()}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* Dialogs */}
      {renderSettingsDialog()}
      {renderUserProfileDialog()}
      {renderNotificationsDialog()}
      {renderTaskDialog()}
      {renderCandidateDialog()}
    </div>
  );
}
