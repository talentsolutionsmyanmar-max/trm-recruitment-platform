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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Users, Briefcase, TrendingUp, UserCheck, Plus, ArrowRight, Settings, LayoutDashboard,
  Building2, Calendar, Target, Award, BarChart3, PieChart, Activity, Bell, Search,
  LogOut, ChevronDown, Edit, Trash2, Eye, Send, Mail, Phone, MapPin, Clock,
  CheckCircle, XCircle, AlertCircle, Star, Crown, Shield, UserCog, ClipboardList,
  FileText, Download, Filter, RefreshCw, MoreVertical, Kanban, UserCircle,
  Sparkles, DollarSign, BriefcaseBusiness, CalendarDays, TrendingDown, Zap,
  Menu, X, Moon, Sun, Globe, Lock, Key, Database, Server, FileCheck,
  MessageSquare, Video, Link2, ExternalLink, Upload, FileSpreadsheet,
  ChevronRight, Play, Pause, RotateCcw, Bot, Brain, Cpu, Layers, Wand2,
  FileSearch, Users2, BriefcaseMedical, CalendarCheck, MailOpen, SendHorizonal,
  FileUp, AlertTriangle, CheckCircle2, Timer, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Layout, Settings2, HardDrive, Cloud, Globe2, Languages, Copy
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, AreaChart, Area, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Scatter,
  FunnelChart, Funnel, LabelList
} from 'recharts';
import { format, formatDistanceToNow, addDays, isAfter, isBefore, startOfDay, endOfDay, parseISO, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

// ==================== TYPES ====================
type UserRole = 'md' | 'manager' | 'senior_recruiter' | 'recruiter';
type Theme = 'light' | 'dark';
type ViewMode = 'grid' | 'list' | 'kanban';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive';
  targets: { monthlyPlacements: number; quarterlyRevenue: number; clientMeetings: number; };
  actuals: { placements: number; revenue: number; meetings: number; };
  teamMembers?: string[];
  twoFactorEnabled: boolean;
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
  status: string;
  source: string;
  matchScore?: number;
  appliedJobs: string[];
  createdAt: string;
  assignedTo: string;
  notes: string;
  tags: string[];
  resumeUrl?: string;
}

interface Job {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  quantity: number;
  filled: number;
  priority: string;
  status: string;
  deadline: string;
  createdAt: string;
  category: string;
  skills: string[];
  experienceRequired: number;
  assignedTo: string;
}

interface Client {
  id: string;
  companyName: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: string;
  totalRevenue: number;
  totalPlacements: number;
  assignedTo: string;
}

interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  clientName: string;
  dateTime: string;
  type: string;
  status: string;
  outcome?: string;
  meetingLink?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  dueDate: string;
  dueTime: string;
  relatedTo: string;
  assignedTo: string;
}

interface Deal {
  id: string;
  title: string;
  clientName: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  usageCount: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'interview' | 'meeting' | 'task' | 'deadline';
  relatedTo?: string;
  color: string;
}

// ==================== MOCK DATA ====================
const initialUsers: User[] = [
  { id: 'u1', name: 'U Aung Myint', email: 'aungmyint@trm.com', role: 'md', department: 'Executive', phone: '+95 9 100 000 001', avatar: 'AM', status: 'active', targets: { monthlyPlacements: 0, quarterlyRevenue: 0, clientMeetings: 0 }, actuals: { placements: 0, revenue: 0, meetings: 0 }, teamMembers: ['u2', 'u3', 'u4', 'u5'], twoFactorEnabled: true },
  { id: 'u2', name: 'Daw Mya Mya', email: 'myamya@trm.com', role: 'manager', department: 'Recruitment', phone: '+95 9 100 000 002', avatar: 'MM', status: 'active', targets: { monthlyPlacements: 15, quarterlyRevenue: 50000000, clientMeetings: 12 }, actuals: { placements: 12, revenue: 38000000, meetings: 10 }, teamMembers: ['u3', 'u4', 'u5'], twoFactorEnabled: true },
  { id: 'u3', name: 'Ko Zaw Zaw', email: 'zawzaw@trm.com', role: 'senior_recruiter', department: 'Recruitment', phone: '+95 9 100 000 003', avatar: 'ZZ', status: 'active', targets: { monthlyPlacements: 8, quarterlyRevenue: 25000000, clientMeetings: 8 }, actuals: { placements: 6, revenue: 18000000, meetings: 7 }, twoFactorEnabled: false },
  { id: 'u4', name: 'Ma Hla Hla', email: 'hlahla@trm.com', role: 'recruiter', department: 'Recruitment', phone: '+95 9 100 000 004', avatar: 'HH', status: 'active', targets: { monthlyPlacements: 5, quarterlyRevenue: 15000000, clientMeetings: 6 }, actuals: { placements: 4, revenue: 12000000, meetings: 5 }, twoFactorEnabled: false },
  { id: 'u5', name: 'Ko Than Than', email: 'thanthan@trm.com', role: 'recruiter', department: 'Recruitment', phone: '+95 9 100 000 005', avatar: 'TT', status: 'active', targets: { monthlyPlacements: 5, quarterlyRevenue: 15000000, clientMeetings: 6 }, actuals: { placements: 3, revenue: 9000000, meetings: 4 }, twoFactorEnabled: false }
];

const initialCandidates: Candidate[] = [
  { id: 'can1', name: 'Mg Aung', email: 'mgaung@gmail.com', phone: '+95 9 111 222 333', location: 'Yangon', skills: ['Machine Operation', 'Quality Control', 'Safety'], experience: 5, education: 'High School', currentCompany: 'Unemployed', expectedSalary: 300000, status: 'interviewing', source: 'Walk-in', matchScore: 92, appliedJobs: ['j1'], createdAt: '2024-12-01', assignedTo: 'u3', notes: 'Strong candidate', tags: ['Experienced', 'Available'] },
  { id: 'can2', name: 'Ma Hla Hla', email: 'hlahla@gmail.com', phone: '+95 9 222 333 444', location: 'Mandalay', skills: ['Garment Production', 'Quality Inspection', 'Team Lead'], experience: 8, education: 'High School', currentCompany: 'ABC Garment', expectedSalary: 350000, status: 'screening', source: 'Referral', matchScore: 88, appliedJobs: ['j4'], createdAt: '2024-12-05', assignedTo: 'u4', notes: 'Team lead experience', tags: ['Referral', 'Leadership'] },
  { id: 'can3', name: 'U Thein Tun', email: 'theintun@gmail.com', phone: '+95 9 333 444 555', location: 'Yangon', skills: ['Construction', 'Site Management', 'Safety Protocols'], experience: 12, education: 'Technical Certificate', currentCompany: 'Freelance', expectedSalary: 700000, status: 'interviewing', source: 'LinkedIn', matchScore: 95, appliedJobs: ['j2'], createdAt: '2024-12-08', assignedTo: 'u2', notes: 'Excellent experience', tags: ['Senior Level', 'LinkedIn'] },
  { id: 'can4', name: 'Daw Su Su', email: 'susu@gmail.com', phone: '+95 9 444 555 666', location: 'Yangon', skills: ['Customer Service', 'English', 'Banking'], experience: 4, education: 'BA English', currentCompany: 'KBZ Bank', expectedSalary: 450000, status: 'offered', source: 'JobNet', matchScore: 85, appliedJobs: ['j3'], createdAt: '2024-12-10', assignedTo: 'u3', notes: 'Good communication', tags: ['English Speaker'] },
  { id: 'can5', name: 'Ko Myo Min', email: 'myomin@gmail.com', phone: '+95 9 555 666 777', location: 'Naypyidaw', skills: ['Electrical', 'Troubleshooting', 'AutoCAD'], experience: 6, education: 'B.E. Electrical', currentCompany: 'Power Solutions', expectedSalary: 600000, status: 'new', source: 'LinkedIn', matchScore: 78, appliedJobs: [], createdAt: '2024-12-15', assignedTo: 'u4', notes: 'Technical background', tags: ['Engineer', 'Technical'] },
  { id: 'can6', name: 'Ma Khin Myat', email: 'khinmyat@gmail.com', phone: '+95 9 666 777 888', location: 'Yangon', skills: ['HR', 'Recruitment', 'Payroll'], experience: 3, education: 'BBA', currentCompany: 'Unemployed', expectedSalary: 400000, status: 'new', source: 'Walk-in', matchScore: 72, appliedJobs: [], createdAt: '2024-12-16', assignedTo: 'u5', notes: 'HR background', tags: ['HR Professional'] }
];

const initialJobs: Job[] = [
  { id: 'j1', title: 'Production Line Worker', clientId: 'c1', clientName: 'MGS Beverage', location: 'Yangon', salaryMin: 250000, salaryMax: 350000, quantity: 20, filled: 15, priority: 'high', status: 'in-progress', deadline: '2025-01-15', createdAt: '2024-12-01', category: 'Manufacturing', skills: ['Machine Operation', 'Safety'], experienceRequired: 0, assignedTo: 'u3' },
  { id: 'j2', title: 'Site Supervisor', clientId: 'c2', clientName: 'Shwe Taung Group', location: 'Yangon', salaryMin: 600000, salaryMax: 800000, quantity: 5, filled: 2, priority: 'urgent', status: 'in-progress', deadline: '2025-01-30', createdAt: '2024-12-05', category: 'Construction', skills: ['Site Management', 'Safety', 'Leadership'], experienceRequired: 5, assignedTo: 'u2' },
  { id: 'j3', title: 'Bank Teller', clientId: 'c3', clientName: 'KBZ Bank', location: 'Yangon', salaryMin: 400000, salaryMax: 550000, quantity: 10, filled: 6, priority: 'medium', status: 'in-progress', deadline: '2025-02-01', createdAt: '2024-12-10', category: 'Banking', skills: ['Customer Service', 'Cash Handling'], experienceRequired: 1, assignedTo: 'u3' },
  { id: 'j4', title: 'Quality Inspector', clientId: 'c4', clientName: 'Mandalay Garment', location: 'Mandalay', salaryMin: 300000, salaryMax: 400000, quantity: 10, filled: 7, priority: 'high', status: 'in-progress', deadline: '2025-01-30', createdAt: '2024-12-10', category: 'Manufacturing', skills: ['Quality Control', 'Documentation'], experienceRequired: 2, assignedTo: 'u4' },
  { id: 'j5', title: 'Hotel Receptionist', clientId: 'c5', clientName: 'Grand Myanmar Hotel', location: 'Bagan', salaryMin: 350000, salaryMax: 450000, quantity: 5, filled: 5, priority: 'medium', status: 'filled', deadline: '2024-12-20', createdAt: '2024-11-15', category: 'Hospitality', skills: ['English', 'Customer Service'], experienceRequired: 1, assignedTo: 'u5' }
];

const initialClients: Client[] = [
  { id: 'c1', companyName: 'MGS Beverage', industry: 'Food & Beverage', contactPerson: 'U Thant Zin', email: 'thantzin@mgs.com', phone: '+95 9 123 456 789', status: 'active', totalRevenue: 45000000, totalPlacements: 45, assignedTo: 'u3' },
  { id: 'c2', companyName: 'Shwe Taung Group', industry: 'Construction', contactPerson: 'Daw Mya Mya', email: 'myamya@shwetaung.com', phone: '+95 9 234 567 890', status: 'active', totalRevenue: 32000000, totalPlacements: 32, assignedTo: 'u2' },
  { id: 'c3', companyName: 'KBZ Bank', industry: 'Banking', contactPerson: 'U Aung Ko', email: 'aungko@kbzbank.com', phone: '+95 9 789 012 345', status: 'active', totalRevenue: 97500000, totalPlacements: 65, assignedTo: 'u3' },
  { id: 'c4', companyName: 'Mandalay Garment', industry: 'Manufacturing', contactPerson: 'Daw Khin Khin', email: 'khinkhin@mandalaygarment.com', phone: '+95 9 456 789 012', status: 'active', totalRevenue: 60000000, totalPlacements: 120, assignedTo: 'u4' },
  { id: 'c5', companyName: 'Grand Myanmar Hotel', industry: 'Hospitality', contactPerson: 'U Myo Aung', email: 'myoaung@grandmyanmar.com', phone: '+95 9 567 890 123', status: 'active', totalRevenue: 28000000, totalPlacements: 28, assignedTo: 'u5' }
];

const initialInterviews: Interview[] = [
  { id: 'int1', candidateId: 'can1', candidateName: 'Mg Aung', jobTitle: 'Production Line Worker', clientName: 'MGS Beverage', dateTime: '2024-12-20T10:00', type: 'onsite', status: 'scheduled', meetingLink: '' },
  { id: 'int2', candidateId: 'can3', candidateName: 'U Thein Tun', jobTitle: 'Site Supervisor', clientName: 'Shwe Taung Group', dateTime: '2024-12-21T14:00', type: 'video', status: 'scheduled', meetingLink: 'https://zoom.us/j/123456' },
  { id: 'int3', candidateId: 'can4', candidateName: 'Daw Su Su', jobTitle: 'Bank Teller', clientName: 'KBZ Bank', dateTime: '2024-12-18T09:00', type: 'phone', status: 'completed', outcome: 'passed' }
];

const initialTasks: Task[] = [
  { id: 't1', title: 'Follow up KBZ Bank', description: 'Check on teller positions', type: 'call', priority: 'high', status: 'pending', dueDate: '2024-12-20', dueTime: '10:00', relatedTo: 'KBZ Bank', assignedTo: 'u3' },
  { id: 't2', title: 'Prepare interview materials', description: 'Print evaluation forms', type: 'document', priority: 'medium', status: 'in_progress', dueDate: '2024-12-19', dueTime: '16:00', relatedTo: 'Mg Aung', assignedTo: 'u3' },
  { id: 't3', title: 'Client meeting - Shwe Taung', description: 'Quarterly review', type: 'meeting', priority: 'high', status: 'pending', dueDate: '2024-12-22', dueTime: '09:00', relatedTo: 'Shwe Taung Group', assignedTo: 'u2' }
];

const initialDeals: Deal[] = [
  { id: 'd1', title: 'MGS Annual Contract', clientName: 'MGS Beverage', value: 15000000, stage: 'negotiation', probability: 75, expectedCloseDate: '2025-01-30', assignedTo: 'u3' },
  { id: 'd2', title: 'Shwe Taung Q1 Hiring', clientName: 'Shwe Taung Group', value: 25000000, stage: 'proposal', probability: 50, expectedCloseDate: '2025-02-15', assignedTo: 'u2' },
  { id: 'd3', title: 'Mandalay Expansion', clientName: 'Mandalay Garment', value: 8000000, stage: 'won', probability: 100, expectedCloseDate: '2024-12-15', assignedTo: 'u4' },
  { id: 'd4', title: 'KBZ Bank Recruitment', clientName: 'KBZ Bank', value: 12000000, stage: 'qualified', probability: 40, expectedCloseDate: '2025-02-28', assignedTo: 'u3' }
];

const emailTemplates: EmailTemplate[] = [
  { id: 'et1', name: 'Interview Invitation', subject: 'Interview Invitation - {{company}}', category: 'interview_invitation', usageCount: 45 },
  { id: 'et2', name: 'Application Received', subject: 'Application Received - {{position}}', category: 'application_received', usageCount: 120 },
  { id: 'et3', name: 'Offer Letter', subject: 'Job Offer - {{position}}', category: 'offer_letter', usageCount: 25 },
  { id: 'et4', name: 'Rejection Letter', subject: 'Application Update - {{position}}', category: 'rejection', usageCount: 80 },
  { id: 'et5', name: 'Follow Up', subject: 'Following Up - {{position}}', category: 'follow_up', usageCount: 55 }
];

// ==================== UTILITIES ====================
const formatMMK = (amount: number): string => {
  return new Intl.NumberFormat('en-MM', { style: 'currency', currency: 'MMK', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount).replace('MMK', 'K');
};

const formatDate = (dateStr: string): string => {
  try { return format(new Date(dateStr), 'dd MMM yyyy'); } catch { return dateStr; }
};

const formatTime = (dateStr: string): string => {
  try { return format(new Date(dateStr), 'HH:mm'); } catch { return ''; }
};

const getRoleLabel = (role: UserRole): string => ({
  md: 'Managing Director',
  manager: 'Recruitment Manager',
  senior_recruiter: 'Senior Recruiter',
  recruiter: 'Recruiter'
}[role] || role);

const getRoleColor = (role: UserRole): string => ({
  md: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  manager: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
  senior_recruiter: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
  recruiter: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
}[role] || '');

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-slate-100 text-slate-700',
    new: 'bg-cyan-100 text-cyan-700',
    screening: 'bg-yellow-100 text-yellow-700',
    interviewing: 'bg-blue-100 text-blue-700',
    offered: 'bg-purple-100 text-purple-700',
    placed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
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
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  
  // UI
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  
  // Dialogs
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showResumeParser, setShowResumeParser] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [showAIMatcher, setShowAIMatcher] = useState(false);
  const [showCandidateDialog, setShowCandidateDialog] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  
  // Edit states
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [parsedResume, setParsedResume] = useState<Partial<Candidate> | null>(null);
  const [aiMatchResult, setAiMatchResult] = useState<{ score: number; analysis: string } | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [resumeText, setResumeText] = useState('');

  // Permissions
  const isMD = currentUser?.role === 'md';
  const isManager = currentUser?.role === 'manager' || isMD;
  const isSenior = currentUser?.role === 'senior_recruiter' || isManager;

  // Filter data
  const teamMembers = useMemo(() => {
    if (!currentUser) return [];
    if (isMD) return users;
    if (isManager) {
      const teamIds = currentUser.teamMembers || [];
      return users.filter(u => teamIds.includes(u.id) || u.id === currentUser.id);
    }
    return [currentUser];
  }, [currentUser, users, isMD, isManager]);

  const filteredCandidates = useMemo(() => {
    if (!currentUser) return [];
    if (isMD) return candidates;
    return candidates.filter(c => c.assignedTo === currentUser.id || teamMembers.some(m => m.id === c.assignedTo));
  }, [candidates, currentUser, isMD, teamMembers]);

  const filteredJobs = useMemo(() => {
    if (!currentUser) return [];
    if (isMD) return jobs;
    return jobs.filter(j => j.assignedTo === currentUser.id || teamMembers.some(m => m.id === j.assignedTo));
  }, [jobs, currentUser, isMD, teamMembers]);

  const filteredTasks = useMemo(() => {
    if (!currentUser) return [];
    if (isMD) return tasks;
    return tasks.filter(t => t.assignedTo === currentUser.id || teamMembers.some(m => m.id === t.assignedTo));
  }, [tasks, currentUser, isMD, teamMembers]);

  const filteredDeals = useMemo(() => {
    if (!currentUser) return [];
    if (isMD) return deals;
    return deals.filter(d => d.assignedTo === currentUser.id || teamMembers.some(m => m.id === d.assignedTo));
  }, [deals, currentUser, isMD, teamMembers]);

  // Metrics
  const metrics = useMemo(() => ({
    activeJobs: filteredJobs.filter(j => j.status === 'in-progress' || j.status === 'open').length,
    openPositions: filteredJobs.reduce((sum, j) => sum + (j.quantity - j.filled), 0),
    totalCandidates: filteredCandidates.length,
    newCandidates: filteredCandidates.filter(c => c.status === 'new').length,
    pipelineValue: filteredDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost').reduce((sum, d) => sum + d.value, 0),
    pendingTasks: filteredTasks.filter(t => t.status === 'pending').length,
    upcomingInterviews: interviews.filter(i => i.status === 'scheduled').length,
    fillRate: filteredJobs.length > 0 ? Math.round((filteredJobs.reduce((sum, j) => sum + j.filled, 0) / filteredJobs.reduce((sum, j) => sum + j.quantity, 0)) * 100) : 0,
    avgMatchScore: filteredCandidates.length > 0 ? Math.round(filteredCandidates.reduce((sum, c) => sum + (c.matchScore || 0), 0) / filteredCandidates.length) : 0
  }), [filteredJobs, filteredCandidates, filteredDeals, filteredTasks, interviews]);

  // Chart data
  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(m => ({ month: m, placements: Math.floor(Math.random() * 15) + 5, revenue: Math.floor(Math.random() * 30) + 10, target: 12 }));
  }, []);

  const sourceData = useMemo(() => [
    { name: 'Walk-in', value: 35, color: '#3b82f6' },
    { name: 'LinkedIn', value: 28, color: '#0077b5' },
    { name: 'Referral', value: 20, color: '#10b981' },
    { name: 'JobNet', value: 12, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#6b7280' }
  ], []);

  const funnelData = useMemo(() => [
    { stage: 'Applied', count: 100, fill: '#3b82f6' },
    { stage: 'Screening', count: 60, fill: '#8b5cf6' },
    { stage: 'Interview', count: 35, fill: '#f59e0b' },
    { stage: 'Offer', count: 15, fill: '#10b981' },
    { stage: 'Hired', count: 10, fill: '#22c55e' }
  ], []);

  const teamData = useMemo(() => teamMembers.filter(m => m.role !== 'md').map(m => ({
    name: m.name.split(' ')[0],
    placements: m.actuals.placements,
    target: m.targets.monthlyPlacements,
    revenue: m.actuals.revenue / 1000000
  })), [teamMembers]);

  // Calendar events
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];
    interviews.filter(i => i.status === 'scheduled').forEach(i => {
      events.push({ id: i.id, title: `Interview: ${i.candidateName}`, date: i.dateTime.split('T')[0], time: formatTime(i.dateTime), type: 'interview', relatedTo: i.jobTitle, color: 'bg-blue-500' });
    });
    filteredTasks.filter(t => t.status === 'pending').forEach(t => {
      events.push({ id: t.id, title: t.title, date: t.dueDate, time: t.dueTime, type: 'task', relatedTo: t.relatedTo, color: 'bg-orange-500' });
    });
    filteredJobs.forEach(j => {
      if (j.deadline) {
        events.push({ id: `deadline-${j.id}`, title: `Deadline: ${j.title}`, date: j.deadline, time: '17:00', type: 'deadline', relatedTo: j.clientName, color: 'bg-red-500' });
      }
    });
    return events;
  }, [interviews, filteredTasks, filteredJobs]);

  // API calls
  const parseResume = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      });
      const data = await response.json();
      if (data.success) {
        setParsedResume(data.data.candidate);
      }
    } catch (error) {
      console.error('Parse error:', error);
    }
    setAiLoading(false);
  };

  const matchCandidate = async (candidate: Candidate, job: Job) => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/match-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate, job })
      });
      const data = await response.json();
      if (data.success) {
        setAiMatchResult({ score: data.data.overallScore, analysis: JSON.stringify(data.data, null, 2) });
      }
    } catch (error) {
      console.error('Match error:', error);
    }
    setAiLoading(false);
  };

  const generateEmail = async (type: string, context: Record<string, string>) => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context })
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedEmail(data.data);
      }
    } catch (error) {
      console.error('Email error:', error);
    }
    setAiLoading(false);
  };

  // Theme classes
  const themeClasses = theme === 'dark' 
    ? 'bg-slate-900 text-white' 
    : 'bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900';

  // ==================== LOGIN SCREEN ====================
  const renderLogin = () => (
    <div className={`min-h-screen flex items-center justify-center ${themeClasses} p-4`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <Card className={`w-full max-w-md relative z-10 border-0 shadow-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Talent Resources Myanmar</h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Enterprise Recruitment Platform</p>
          </div>

          <div className="relative my-6">
            <Separator />
            <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} px-3 text-xs text-slate-500`}>
              Quick Login (Demo)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {users.map(user => (
              <Button
                key={user.id}
                variant="outline"
                className={`h-auto py-4 flex flex-col items-center gap-2 ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-700' : ''}`}
                onClick={() => { setCurrentUser(user); setIsAuthenticated(true); }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={getRoleColor(user.role)}>{user.avatar}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-500">{getRoleLabel(user.role)}</span>
              </Button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            © 2024 Talent Resources Myanmar. Empowering Myanmar's workforce.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== SIDEBAR ====================
  const renderSidebar = () => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'candidates', label: 'Candidates', icon: UserCircle, badge: filteredCandidates.length },
      { id: 'jobs', label: 'Job Orders', icon: Briefcase, badge: filteredJobs.filter(j => j.status !== 'filled').length },
      { id: 'clients', label: 'Clients', icon: Building2 },
      { id: 'pipeline', label: 'Pipeline', icon: Kanban, badge: filteredDeals.filter(d => d.stage !== 'won').length },
      { id: 'calendar', label: 'Calendar', icon: Calendar, badge: interviews.filter(i => i.status === 'scheduled').length },
      { id: 'tasks', label: 'Tasks', icon: ClipboardList, badge: filteredTasks.filter(t => t.status === 'pending').length },
      { id: 'ai-tools', label: 'AI Tools', icon: Bot, highlight: true }
    ];

    const adminItems = [
      { id: 'team', label: 'Team', icon: Users, show: isManager },
      { id: 'reports', label: 'Reports', icon: BarChart3, show: isManager },
      { id: 'admin', label: 'Admin', icon: Shield, show: isMD }
    ];

    return (
      <aside className={`flex flex-col h-full transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800'} text-white`}>
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700/50">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent whitespace-nowrap">Talent Resources</h1>
              <p className="text-[10px] text-blue-300 whitespace-nowrap">Myanmar</p>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? item.highlight ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && <Badge className="h-5 px-1.5 text-[10px] bg-white/20 text-white border-0">{item.badge}</Badge>}
                  </>
                )}
              </button>
            ))}
            
            {adminItems.some(i => i.show) && (
              <>
                <Separator className="my-3 bg-slate-700/50" />
                {adminItems.filter(i => i.show).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      activeTab === item.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
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

        <div className="border-t border-slate-700/50 p-2 space-y-1">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {sidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors">
            <Settings className="h-5 w-5" />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>

        {currentUser && (
          <div className="border-t border-slate-700/50 p-2">
            <button onClick={() => setShowProfile(true)} className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={getRoleColor(currentUser.role)}>{currentUser.avatar}</AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-semibold truncate">{currentUser.name}</p>
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
    <header className={`h-16 border-b px-4 flex items-center justify-between sticky top-0 z-20 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white/80 backdrop-blur-sm border-slate-200'}`}>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-9 w-9">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div>
          <h1 className={`text-lg font-bold capitalize ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{activeTab.replace('-', ' ')}</h1>
          {currentUser && <p className="text-[10px] text-slate-500">{getRoleLabel(currentUser.role)} View</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-64 pl-9 h-9 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-0'}`} />
        </div>
        
        <Button size="sm" className="hidden lg:flex h-9 bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => setShowCandidateDialog(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Candidate
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => setShowNotifications(true)}>
          <Bell className={`h-4 w-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`} />
          {notifications > 0 && <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">{notifications}</span>}
        </Button>

        {currentUser && (
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setShowProfile(true)}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className={getRoleColor(currentUser.role)}>{currentUser.avatar}</AvatarFallback>
            </Avatar>
          </Button>
        )}
      </div>
    </header>
  );

  // ==================== DASHBOARD ====================
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome back, {currentUser?.name.split(' ')[0]}! 👋</h2>
            <p className="text-blue-100 text-sm">You have {metrics.pendingTasks} pending tasks and {metrics.upcomingInterviews} interviews scheduled.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowResumeParser(true)} className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-9">
              <Wand2 className="h-4 w-4 mr-1" /> AI Parse Resume
            </Button>
            <Button onClick={() => setShowCandidateDialog(true)} className="bg-white text-blue-600 hover:bg-blue-50 h-9">
              <Plus className="h-4 w-4 mr-1" /> Add Candidate
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Active Jobs', value: metrics.activeJobs, icon: Briefcase, color: 'from-purple-500 to-pink-500' },
          { label: 'Open Positions', value: metrics.openPositions, icon: Target, color: 'from-blue-500 to-cyan-500' },
          { label: 'Total Candidates', value: metrics.totalCandidates, icon: Users, color: 'from-green-500 to-emerald-500' },
          { label: 'Pipeline Value', value: formatMMK(metrics.pipelineValue), icon: TrendingUp, color: 'from-orange-500 to-amber-500' },
          { label: 'Fill Rate', value: `${metrics.fillRate}%`, icon: Award, color: 'from-indigo-500 to-violet-500' },
          { label: 'Avg Match Score', value: `${metrics.avgMatchScore}%`, icon: Brain, color: 'from-rose-500 to-pink-500' }
        ].map((stat, idx) => (
          <Card key={idx} className={`border-0 shadow-md hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{stat.value}</p>
              <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`lg:col-span-2 border-0 shadow-md ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <CardHeader className="pb-2"><CardTitle className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>Performance Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#1e293b' : 'white', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="placements" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPlacements)" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-md ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <CardHeader className="pb-2"><CardTitle className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>Candidate Sources</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <RePieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                  {sourceData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {sourceData.slice(0, 4).map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px]">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{s.name}: {s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance (Managers) */}
      {isManager && (
        <Card className={`border-0 shadow-md ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <CardHeader className="pb-2"><CardTitle className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>Team Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#1e293b' : 'white', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="placements" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Placements" />
                <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`border-0 shadow-md ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <CardHeader className="pb-2"><CardTitle className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>Recent Candidates</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredCandidates.slice(0, 5).map(c => (
                <div key={c.id} className={`flex items-center gap-3 p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} transition-colors cursor-pointer`} onClick={() => { setSelectedCandidate(c); setActiveTab('candidate-detail'); }}>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">{c.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{c.name}</p>
                    <p className="text-[10px] text-slate-500">{c.source} • {formatDate(c.createdAt)}</p>
                  </div>
                  {c.matchScore && (
                    <div className="flex items-center gap-1">
                      <Progress value={c.matchScore} className="h-1.5 w-10" />
                      <span className="text-[10px] font-medium">{c.matchScore}%</span>
                    </div>
                  )}
                  <Badge className={`text-[10px] ${getStatusColor(c.status)}`}>{c.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-md ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>Upcoming Tasks</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600" onClick={() => setActiveTab('tasks')}>View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTasks.filter(t => t.status !== 'completed').slice(0, 5).map(t => (
                <div key={t.id} className={`flex items-center gap-3 p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} transition-colors`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(t.priority)}`}>
                    {t.type === 'call' ? <Phone className="h-4 w-4" /> : t.type === 'meeting' ? <Calendar className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.title}</p>
                    <p className="text-[10px] text-slate-500">Due: {formatDate(t.dueDate)} at {t.dueTime}</p>
                  </div>
                  <Badge className={`text-[10px] ${getStatusColor(t.priority)}`}>{t.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ==================== AI TOOLS ====================
  const renderAITools = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>AI-Powered Tools</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Intelligent recruitment assistance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resume Parser */}
        <Card className={`border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${theme === 'dark' ? 'bg-slate-800' : ''}`} onClick={() => setShowResumeParser(true)}>
          <CardContent className="p-6 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FileSearch className="h-7 w-7 text-white" />
            </div>
            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>AI Resume Parser</h3>
            <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Extract candidate info from resumes automatically</p>
            <Badge className="bg-blue-100 text-blue-700"><Bot className="h-3 w-3 mr-1" /> AI Powered</Badge>
          </CardContent>
        </Card>

        {/* Candidate Matcher */}
        <Card className={`border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${theme === 'dark' ? 'bg-slate-800' : ''}`} onClick={() => setShowAIMatcher(true)}>
          <CardContent className="p-6 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Smart Matching</h3>
            <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>AI-powered candidate-job matching analysis</p>
            <Badge className="bg-purple-100 text-purple-700"><Brain className="h-3 w-3 mr-1" /> ML Model</Badge>
          </CardContent>
        </Card>

        {/* Email Generator */}
        <Card className={`border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${theme === 'dark' ? 'bg-slate-800' : ''}`} onClick={() => setShowEmailComposer(true)}>
          <CardContent className="p-6 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Email Generator</h3>
            <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Generate professional recruitment emails</p>
            <Badge className="bg-green-100 text-green-700"><Wand2 className="h-3 w-3 mr-1" /> Auto-Generate</Badge>
          </CardContent>
        </Card>

        {/* Pipeline Analytics */}
        <Card className={`border-0 shadow-md hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <CardContent className="p-6 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <PieChartIcon className="h-7 w-7 text-white" />
            </div>
            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Pipeline Analytics</h3>
            <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Real-time funnel analysis</p>
            <ResponsiveContainer width="100%" height={60}>
              <BarChart data={funnelData}>
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Predictive Hiring */}
        <Card className={`border-0 shadow-md hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <CardContent className="p-6 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LineChartIcon className="h-7 w-7 text-white" />
            </div>
            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Predictive Analytics</h3>
            <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Forecast hiring success rates</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-cyan-600">87%</span>
              <span className="text-xs text-slate-500">success prediction</span>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <Card className={`border-0 shadow-md hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <CardContent className="p-6 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Layers className="h-7 w-7 text-white" />
            </div>
            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Bulk Actions</h3>
            <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Automate repetitive tasks</p>
            <Button variant="outline" className="h-8 text-xs">Setup Automation</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ==================== CANDIDATES ====================
  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Candidates</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{filteredCandidates.length} total • {filteredCandidates.filter(c => c.status === 'new').length} new</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9" onClick={() => setShowResumeParser(true)}>
            <Wand2 className="h-4 w-4 mr-1" /> AI Import
          </Button>
          <Button className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => { setEditingCandidate(null); setShowCandidateDialog(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Candidate
          </Button>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['new', 'screening', 'interviewing', 'offered', 'placed'].map(status => (
          <button key={status} className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'} border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{filteredCandidates.filter(c => c.status === status).length}</span>
            <span className="text-xs capitalize">{status}</span>
          </button>
        ))}
      </div>

      {/* Candidates Table */}
      <Card className={`border-0 shadow-md ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Candidate</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Skills</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Experience</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Salary</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Match</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Status</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
                {filteredCandidates.map(c => (
                  <tr key={c.id} className={`${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">{c.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{c.name}</p>
                          <p className="text-[10px] text-slate-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.skills.slice(0, 2).map((s, i) => <Badge key={i} variant="outline" className="text-[10px] py-0">{s}</Badge>)}
                        {c.skills.length > 2 && <span className="text-[10px] text-slate-500">+{c.skills.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{c.experience} yrs</p>
                      <p className="text-[10px] text-slate-500">{c.education}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-green-600">{formatMMK(c.expectedSalary)}</p>
                    </td>
                    <td className="px-4 py-3">
                      {c.matchScore && (
                        <div className="flex items-center gap-2">
                          <Progress value={c.matchScore} className="h-1.5 w-12" />
                          <span className="text-xs font-medium">{c.matchScore}%</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-[10px] ${getStatusColor(c.status)}`}>{c.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setSelectedCandidate(c); setShowAIMatcher(true); }}>
                          <Brain className="h-3.5 w-3.5 text-purple-500" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setSelectedCandidate(c); setShowEmailComposer(true); }}>
                          <Mail className="h-3.5 w-3.5 text-green-500" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditingCandidate(c); setShowCandidateDialog(true); }}>
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

  // ==================== JOBS ====================
  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Job Orders</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{filteredJobs.length} positions • {metrics.openPositions} open</p>
        </div>
        <Button className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => { setEditingJob(null); setShowJobDialog(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Create Job
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredJobs.map(job => (
          <Card key={job.id} className={`border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${theme === 'dark' ? 'bg-slate-800' : ''}`} onClick={() => { setEditingJob(job); setShowJobDialog(true); }}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge className={`text-[10px] mb-2 ${getStatusColor(job.priority)}`}>{job.priority.toUpperCase()}</Badge>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.clientName}</p>
                </div>
                <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
              </div>
              <div className="space-y-2">
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
                  <span className="text-slate-500">Deadline</span>
                  <span className={`font-medium ${isAfter(new Date(job.deadline), new Date()) ? '' : 'text-red-500'}`}>{formatDate(job.deadline)}</span>
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
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Clients</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{clients.filter(c => c.status === 'active').length} active clients</p>
        </div>
        <Button className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="h-4 w-4 mr-1" /> Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map(client => (
          <Card key={client.id} className={`border-0 shadow-md hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {client.companyName.substring(0, 2).toUpperCase()}
                </div>
                <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
              </div>
              <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{client.companyName}</h3>
              <p className="text-xs text-slate-500 mb-3">{client.industry}</p>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1"><UserCheck className="h-3.5 w-3.5" /> {client.totalPlacements}</span>
                <span className="flex items-center gap-1 text-green-600 font-medium">{formatMMK(client.totalRevenue)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ==================== PIPELINE ====================
  const renderPipeline = () => {
    const stages: Deal['stage'][] = ['lead', 'qualified', 'proposal', 'negotiation', 'won'];
    const stageColors: Record<string, string> = {
      lead: 'from-slate-400 to-slate-500',
      qualified: 'from-blue-400 to-blue-500',
      proposal: 'from-purple-400 to-purple-500',
      negotiation: 'from-orange-400 to-orange-500',
      won: 'from-green-400 to-green-500'
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Sales Pipeline</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Total value: {formatMMK(metrics.pipelineValue)}</p>
          </div>
          <Button className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600">
            <Plus className="h-4 w-4 mr-1" /> Add Deal
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {stages.map(stage => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            return (
              <div key={stage} className="min-w-[180px]">
                <div className={`p-2 rounded-t-xl bg-gradient-to-r ${stageColors[stage]} text-white flex items-center justify-between`}>
                  <span className="text-sm font-medium capitalize">{stage}</span>
                  <Badge className="h-5 px-1.5 bg-white/20 text-white border-0 text-[10px]">{stageDeals.length}</Badge>
                </div>
                <div className={`rounded-b-xl p-2 space-y-2 min-h-[200px] ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  {stageDeals.map(deal => (
                    <Card key={deal.id} className={`cursor-pointer hover:shadow-md transition-shadow border-0 ${theme === 'dark' ? 'bg-slate-700' : ''}`}>
                      <CardContent className="p-3">
                        <p className={`text-sm font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{deal.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{deal.clientName}</p>
                        <div className="flex items-center justify-between mt-2">
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

  // ==================== CALENDAR ====================
  const renderCalendar = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Calendar</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{format(weekStart, 'MMMM yyyy')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-9"><RotateCcw className="h-4 w-4" /></Button>
            <Button className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => setShowInterviewDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> Schedule
            </Button>
          </div>
        </div>

        {/* Week View */}
        <Card className={`border-0 shadow-md overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <div className="grid grid-cols-8 border-b border-slate-200">
            <div className={`p-3 text-center text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Time</div>
            {weekDays.map((day, idx) => (
              <div key={idx} className={`p-3 text-center border-l ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} ${format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') ? (theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50') : ''}`}>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{format(day, 'EEE')}</p>
                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{format(day, 'd')}</p>
              </div>
            ))}
          </div>
          
          <ScrollArea className="h-[500px]">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-slate-100">
                <div className={`p-2 text-xs text-center ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{hour}:00</div>
                {weekDays.map((day, dayIdx) => {
                  const dayEvents = calendarEvents.filter(e => {
                    const eventDate = format(new Date(e.date), 'yyyy-MM-dd');
                    const eventHour = parseInt(e.time.split(':')[0]);
                    return eventDate === format(day, 'yyyy-MM-dd') && eventHour === hour;
                  });
                  return (
                    <div key={dayIdx} className={`p-1 min-h-[50px] border-l ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                      {dayEvents.map(event => (
                        <div key={event.id} className={`${event.color} text-white text-[10px] p-1 rounded mb-1 truncate cursor-pointer hover:opacity-90`}>
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </ScrollArea>
        </Card>
      </div>
    );
  };

  // ==================== TASKS ====================
  const renderTasks = () => {
    const pending = filteredTasks.filter(t => t.status === 'pending');
    const inProgress = filteredTasks.filter(t => t.status === 'in_progress');
    const completed = filteredTasks.filter(t => t.status === 'completed');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Tasks</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{pending.length} pending • {inProgress.length} in progress</p>
          </div>
          <Button className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600" onClick={() => { setEditingTask(null); setShowTaskDialog(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { label: 'Pending', tasks: pending, color: 'from-red-500 to-orange-500', icon: AlertCircle },
            { label: 'In Progress', tasks: inProgress, color: 'from-blue-500 to-indigo-500', icon: Clock },
            { label: 'Completed', tasks: completed, color: 'from-green-500 to-emerald-500', icon: CheckCircle }
          ].map(column => (
            <Card key={column.label} className={`border-0 shadow-md ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
              <CardHeader className={`bg-gradient-to-r ${column.color} text-white rounded-t-xl py-3`}>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2"><column.icon className="h-4 w-4" /> {column.label}</span>
                  <Badge className="bg-white/20 text-white border-0">{column.tasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2 max-h-96 overflow-y-auto">
                {column.tasks.map(task => (
                  <div key={task.id} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'} transition-colors`}>
                    <div className="flex items-start justify-between mb-1">
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{task.title}</p>
                      <Badge className={`text-[10px] ${getStatusColor(task.priority)}`}>{task.priority}</Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-400">{formatDate(task.dueDate)}</span>
                      {task.status !== 'completed' && (
                        <Button size="sm" className="h-6 text-[10px]" onClick={() => {
                          setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status === 'pending' ? 'in_progress' : 'completed' } : t));
                        }}>
                          {task.status === 'pending' ? 'Start' : 'Complete'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ==================== TEAM ====================
  const renderTeam = () => {
    if (!isManager) return null;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Team</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{teamMembers.length} members</p>
          </div>
          {isMD && <Button className="h-9"><Plus className="h-4 w-4 mr-1" /> Add Member</Button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(member => (
            <Card key={member.id} className={`border-0 shadow-md hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className={getRoleColor(member.role)}>{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{member.name}</p>
                    <Badge className={`text-[10px] ${getRoleColor(member.role)}`}>{getRoleLabel(member.role)}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Placements</span>
                      <span className="font-medium">{member.actuals.placements}/{member.targets.monthlyPlacements}</span>
                    </div>
                    <Progress value={(member.actuals.placements / member.targets.monthlyPlacements) * 100} className="h-1.5" />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Revenue</span>
                    <span className="font-bold text-green-600">{formatMMK(member.actuals.revenue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Reports & Analytics</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Performance insights</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="month">
              <SelectTrigger className={`w-32 h-9 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-9"><Download className="h-4 w-4 mr-1" /> Export</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`border-0 shadow-md ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardHeader className="pb-2"><CardTitle className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>Recruitment Funnel</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel dataKey="count" data={funnelData} isAnimationActive>
                    <LabelList position="right" fill="#888" stroke="none" dataKey="stage" />
                    {funnelData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-md ${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardHeader className="pb-2"><CardTitle className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>Monthly Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ background: theme === 'dark' ? '#1e293b' : 'white', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="placements" fill="#3b82f6" name="Placements" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" name="Target" />
                </ComposedChart>
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
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Admin Panel</h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>System administration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'User Management', icon: UserCog, value: `${users.length} Users`, color: 'from-blue-500 to-indigo-600', action: () => setActiveTab('team') },
            { title: 'Security', icon: Shield, value: '2FA Active', color: 'from-purple-500 to-pink-600' },
            { title: 'Data', icon: Database, value: 'Export All', color: 'from-green-500 to-emerald-600' },
            { title: 'Integrations', icon: Link2, value: '3 Connected', color: 'from-orange-500 to-amber-600' },
            { title: 'Email Templates', icon: Mail, value: `${emailTemplates.length} Templates`, color: 'from-cyan-500 to-blue-600' },
            { title: 'Activity Log', icon: Activity, value: 'View All', color: 'from-slate-500 to-slate-600' }
          ].map((item, idx) => (
            <Card key={idx} className={`border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${theme === 'dark' ? 'bg-slate-800' : ''}`} onClick={item.action}>
              <CardContent className="p-6 text-center">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{item.title}</h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ==================== DIALOGS ====================
  const renderResumeParserDialog = () => (
    <Dialog open={showResumeParser} onOpenChange={setShowResumeParser}>
      <DialogContent className={`max-w-2xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Wand2 className="h-5 w-5 text-blue-500" /> AI Resume Parser
          </DialogTitle>
          <DialogDescription>Paste resume text to extract candidate information automatically</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Resume Text</Label>
            <Textarea
              placeholder="Paste resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className={`mt-1.5 h-40 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}
            />
          </div>
          <Button className="w-full" onClick={parseResume} disabled={aiLoading}>
            {aiLoading ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Parsing...</> : <><Bot className="h-4 w-4 mr-2" /> Parse Resume</>}
          </Button>
          {parsedResume && (
            <Card className={`${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <CardContent className="p-4">
                <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Extracted Information:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500">Name:</span> <span className={theme === 'dark' ? 'text-white' : ''}>{parsedResume.name}</span></div>
                  <div><span className="text-slate-500">Email:</span> <span className={theme === 'dark' ? 'text-white' : ''}>{parsedResume.email}</span></div>
                  <div><span className="text-slate-500">Phone:</span> <span className={theme === 'dark' ? 'text-white' : ''}>{parsedResume.phone}</span></div>
                  <div><span className="text-slate-500">Experience:</span> <span className={theme === 'dark' ? 'text-white' : ''}>{parsedResume.experience} years</span></div>
                  <div className="col-span-2"><span className="text-slate-500">Skills:</span> <span className={theme === 'dark' ? 'text-white' : ''}>{parsedResume.skills?.join(', ')}</span></div>
                </div>
                <Button className="w-full mt-3" onClick={() => { setShowResumeParser(false); setShowCandidateDialog(true); }}>Create Candidate</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderEmailComposerDialog = () => (
    <Dialog open={showEmailComposer} onOpenChange={setShowEmailComposer}>
      <DialogContent className={`max-w-2xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Mail className="h-5 w-5 text-green-500" /> AI Email Generator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Email Type</Label>
            <Select onValueChange={(val) => {
              if (selectedCandidate) {
                generateEmail(val, {
                  candidateName: selectedCandidate.name,
                  jobTitle: 'Position',
                  companyName: 'Company'
                });
              }
            }}>
              <SelectTrigger className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                <SelectValue placeholder="Select email type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interview_invitation">Interview Invitation</SelectItem>
                <SelectItem value="application_received">Application Received</SelectItem>
                <SelectItem value="offer_letter">Offer Letter</SelectItem>
                <SelectItem value="rejection">Rejection Letter</SelectItem>
                <SelectItem value="follow_up">Follow Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {generatedEmail && (
            <div className="space-y-3">
              <div>
                <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Subject</Label>
                <Input value={generatedEmail.subject} readOnly className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
              </div>
              <div>
                <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Body</Label>
                <Textarea value={generatedEmail.body} readOnly className={`mt-1.5 h-48 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1"><Send className="h-4 w-4 mr-2" /> Send Email</Button>
                <Button variant="outline" className="flex-1"><Copy className="h-4 w-4 mr-2" /> Copy</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderAIMatcherDialog = () => (
    <Dialog open={showAIMatcher} onOpenChange={setShowAIMatcher}>
      <DialogContent className={`max-w-2xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Brain className="h-5 w-5 text-purple-500" /> AI Candidate Matching
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {selectedCandidate && (
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Candidate: {selectedCandidate.name}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-slate-500">Skills:</span> <span className={theme === 'dark' ? 'text-white' : ''}>{selectedCandidate.skills?.join(', ')}</span></div>
                <div><span className="text-slate-500">Experience:</span> <span className={theme === 'dark' ? 'text-white' : ''}>{selectedCandidate.experience} years</span></div>
              </div>
            </div>
          )}
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Match with Job</Label>
            <Select onValueChange={(val) => {
              const job = jobs.find(j => j.id === val);
              if (job && selectedCandidate) {
                matchCandidate(selectedCandidate, job);
              }
            }}>
              <SelectTrigger className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                <SelectValue placeholder="Select a job to match" />
              </SelectTrigger>
              <SelectContent>
                {jobs.filter(j => j.status !== 'filled').map(job => (
                  <SelectItem key={job.id} value={job.id}>{job.title} - {job.clientName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {aiMatchResult && (
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${aiMatchResult.score >= 80 ? 'text-green-500' : aiMatchResult.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {aiMatchResult.score}%
                  </div>
                  <p className="text-xs text-slate-500">Match Score</p>
                </div>
                <Progress value={aiMatchResult.score} className="flex-1 h-3" />
              </div>
              <pre className={`text-xs whitespace-pre-wrap ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{aiMatchResult.analysis}</pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderCandidateDialog = () => (
    <Dialog open={showCandidateDialog} onOpenChange={setShowCandidateDialog}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>{editingCandidate ? 'Edit' : 'Add'} Candidate</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[
            { id: 'name', label: 'Name', placeholder: 'Full name' },
            { id: 'email', label: 'Email', placeholder: 'email@example.com', type: 'email' },
            { id: 'phone', label: 'Phone', placeholder: '+95 9 XXX XXX XXX' },
            { id: 'location', label: 'Location', placeholder: 'City' },
            { id: 'experience', label: 'Experience (years)', placeholder: '5', type: 'number' },
            { id: 'salary', label: 'Expected Salary', placeholder: '500000', type: 'number' },
            { id: 'education', label: 'Education', placeholder: 'Degree' },
            { id: 'company', label: 'Current Company', placeholder: 'Company name' }
          ].map(field => (
            <div key={field.id}>
              <Label className={theme === 'dark' ? 'text-slate-300' : ''}>{field.label}</Label>
              <Input
                type={field.type || 'text'}
                placeholder={field.placeholder}
                defaultValue={editingCandidate?.[field.id as keyof Candidate] || ''}
                id={`cand-${field.id}`}
                className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}
              />
            </div>
          ))}
          <div className="col-span-2">
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Skills (comma separated)</Label>
            <Input
              placeholder="e.g. Customer Service, English, MS Office"
              defaultValue={editingCandidate?.skills?.join(', ')}
              id="cand-skills"
              className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}
            />
          </div>
          <div className="col-span-2">
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Notes</Label>
            <Textarea
              placeholder="Additional notes..."
              defaultValue={editingCandidate?.notes}
              id="cand-notes"
              className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowCandidateDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            const name = (document.getElementById('cand-name') as HTMLInputElement)?.value;
            const email = (document.getElementById('cand-email') as HTMLInputElement)?.value;
            const phone = (document.getElementById('cand-phone') as HTMLInputElement)?.value;
            const location = (document.getElementById('cand-location') as HTMLInputElement)?.value;
            const experience = parseInt((document.getElementById('cand-experience') as HTMLInputElement)?.value) || 0;
            const salary = parseInt((document.getElementById('cand-salary') as HTMLInputElement)?.value) || 0;
            const education = (document.getElementById('cand-education') as HTMLInputElement)?.value;
            const company = (document.getElementById('cand-company') as HTMLInputElement)?.value;
            const skillsStr = (document.getElementById('cand-skills') as HTMLInputElement)?.value;
            const notes = (document.getElementById('cand-notes') as HTMLTextAreaElement)?.value;
            
            if (editingCandidate) {
              setCandidates(prev => prev.map(c => c.id === editingCandidate.id ? {
                ...c, name, email, phone, location, experience, expectedSalary: salary, education,
                currentCompany: company, skills: skillsStr?.split(',').map(s => s.trim()).filter(Boolean), notes
              } : c));
            } else if (currentUser) {
              const newCandidate: Candidate = {
                id: `can${Date.now()}`, name: name || '', email: email || '', phone: phone || '',
                location: location || '', experience, expectedSalary: salary, education: education || '',
                currentCompany: company || '', status: 'new', source: 'Manual Entry',
                skills: skillsStr?.split(',').map(s => s.trim()).filter(Boolean) || [],
                notes: notes || '', appliedJobs: [], createdAt: new Date().toISOString(),
                assignedTo: currentUser.id, tags: []
              };
              setCandidates(prev => [...prev, newCandidate]);
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

  const renderSettingsDialog = () => (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogContent className={`max-w-md ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}><Settings className="h-5 w-5" /> Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="appearance" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="appearance">Theme</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Dark Mode</p>
                <p className="text-sm text-slate-500">Toggle dark theme</p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
            </div>
          </TabsContent>
          <TabsContent value="profile" className="space-y-4 mt-4">
            <div><Label className={theme === 'dark' ? 'text-slate-300' : ''}>Name</Label><Input defaultValue={currentUser?.name} className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} /></div>
            <div><Label className={theme === 'dark' ? 'text-slate-300' : ''}>Email</Label><Input defaultValue={currentUser?.email} className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} /></div>
          </TabsContent>
          <TabsContent value="security" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Two-Factor Auth</p>
                <p className="text-sm text-slate-500">Extra security layer</p>
              </div>
              <Switch checked={currentUser?.twoFactorEnabled} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  const renderProfileDialog = () => (
    <Dialog open={showProfile} onOpenChange={setShowProfile}>
      <DialogContent className={`max-w-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader><DialogTitle className={theme === 'dark' ? 'text-white' : ''}>Profile</DialogTitle></DialogHeader>
        {currentUser && (
          <div className="text-center py-4">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarFallback className={`text-xl ${getRoleColor(currentUser.role)}`}>{currentUser.avatar}</AvatarFallback>
            </Avatar>
            <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{currentUser.name}</h3>
            <p className="text-sm text-slate-500 mb-2">{currentUser.email}</p>
            <Badge className={getRoleColor(currentUser.role)}>{getRoleLabel(currentUser.role)}</Badge>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div><p className="text-2xl font-bold text-blue-600">{currentUser.actuals.placements}</p><p className="text-xs text-slate-500">Placements</p></div>
              <div><p className="text-2xl font-bold text-green-600">{formatMMK(currentUser.actuals.revenue)}</p><p className="text-xs text-slate-500">Revenue</p></div>
            </div>
            <Button variant="ghost" className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { setIsAuthenticated(false); setCurrentUser(null); setShowProfile(false); }}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // ==================== RENDER ====================
  if (!isAuthenticated || !currentUser) return renderLogin();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'candidates': return renderCandidates();
      case 'jobs': return renderJobs();
      case 'clients': return renderClients();
      case 'pipeline': return renderPipeline();
      case 'calendar': return renderCalendar();
      case 'tasks': return renderTasks();
      case 'ai-tools': return renderAITools();
      case 'team': return renderTeam();
      case 'reports': return renderReports();
      case 'admin': return renderAdmin();
      default: return renderDashboard();
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${themeClasses}`}>
      {renderSidebar()}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderHeader()}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>
      {renderSettingsDialog()}
      {renderProfileDialog()}
      {renderResumeParserDialog()}
      {renderEmailComposerDialog()}
      {renderAIMatcherDialog()}
      {renderCandidateDialog()}
    </div>
  );
}
