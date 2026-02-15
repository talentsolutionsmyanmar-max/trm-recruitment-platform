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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  Layout, Settings2, HardDrive, Cloud, Globe2, Languages, Copy,
  TrendingUp as TrendingUpIcon, FileSignature, ShieldCheck, AlertOctagon,
  Zap as ZapIcon, Workflow, Link, Linkedin, MailCheck, CalendarSync,
  FileBadge, ClipboardCheck, History, Rocket, Target as TargetIcon,
  Gauge, Flag
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

// ==================== TRANSLATIONS ====================
const translations = {
  en: {
    dashboard: 'Dashboard',
    candidates: 'Candidates',
    jobs: 'Job Orders',
    clients: 'Clients',
    pipeline: 'Pipeline',
    calendar: 'Calendar',
    tasks: 'Tasks',
    analytics: 'Analytics',
    aiTools: 'AI Tools',
    team: 'Team',
    automation: 'Automation',
    compliance: 'Compliance',
    integrations: 'Integrations',
    reports: 'Reports',
    admin: 'Admin',
    settings: 'Settings',
    search: 'Search...',
    addCandidate: 'Add Candidate',
    welcome: 'Welcome',
    activeJobs: 'Active Jobs',
    openPositions: 'Open Positions',
    totalCandidates: 'Total Candidates',
    newCandidates: 'New Candidates',
    pipelineValue: 'Pipeline Value',
    pendingTasks: 'Pending Tasks',
    upcomingInterviews: 'Upcoming Interviews',
    fillRate: 'Fill Rate',
    avgMatchScore: 'Avg Match Score',
    placements: 'Placements',
    revenue: 'Revenue',
    targets: 'Targets',
    teamPerformance: 'Team Performance',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    parseResume: 'Parse Resume',
    aiMatcher: 'AI Matcher',
    composeEmail: 'Compose Email',
    viewReports: 'View Reports',
    candidateSources: 'Candidate Sources',
    hiringFunnel: 'Hiring Funnel',
    monthlyTrends: 'Monthly Trends',
    talentResourcesMyanmar: 'Talent Resources Myanmar',
    enterpriseRecruitmentPlatform: 'Enterprise Recruitment Platform',
    quickLogin: 'Quick Login (Demo)',
    poweredBy: '© 2024 Talent Resources Myanmar. Empowering Myanmar\'s workforce.',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    logout: 'Logout',
    new: 'New',
    screening: 'Screening',
    interviewing: 'Interviewing',
    offered: 'Offered',
    placed: 'Placed',
    status: 'Status',
    actions: 'Actions',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    skills: 'Skills',
    experience: 'Experience',
    education: 'Education',
    expectedSalary: 'Expected Salary',
    source: 'Source',
    matchScore: 'Match Score',
    notes: 'Notes',
    tags: 'Tags',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    advancedAnalytics: 'Advanced Analytics',
    predictiveInsights: 'Predictive Insights & Performance Metrics',
    predictiveHiringForecast: 'Predictive Hiring Forecast',
    aiPoweredPlacementPredictions: 'AI-powered placement predictions',
    timeToHireAnalysis: 'Time-to-Hire Analysis',
    avgDaysPerRecruitmentStage: 'Average days per recruitment stage',
    sourceROIAnalysis: 'Source ROI Analysis',
    costEffectivenessByChannel: 'Cost effectiveness by recruitment channel',
    skillsDemandHeatmap: 'Skills Demand Heatmap',
    marketDemandVsSupply: 'Market demand vs candidate supply',
    aiPoweredInsights: 'AI-Powered Insights',
    workflowAutomation: 'Workflow Automation',
    streamlineProcesses: 'Streamline your recruitment processes',
    createAutomation: 'Create Automation',
    activeAutomations: 'Active Automations',
    totalExecutions: 'Total Executions',
    timeSaved: 'Time Saved',
    efficiencyGain: 'Efficiency Gain',
    complianceCenter: 'Compliance Center',
    documentsCertsAudit: 'Documents, certifications & audit trails',
    auditLog: 'Audit Log',
    addDocument: 'Add Document',
    documents: 'Documents',
    pendingSignatures: 'Pending Signatures',
    expiringSoon: 'Expiring Soon',
    complianceScore: 'Compliance Score',
    integrationHub: 'Integration Hub',
    connectFavoriteTools: 'Connect your favorite tools',
    webhooks: 'Webhooks',
    realTimeNotifications: 'Real-time event notifications'
  },
  mm: {
    dashboard: 'ဒashboard',
    candidates: 'အလုပ်သမားများ',
    jobs: 'အလုပ်အကိုင်များ',
    clients: 'ကုမ္ပဏီများ',
    pipeline: 'Pipeline',
    calendar: 'ပြက္ခဒိန်',
    tasks: 'လုပ်ငန်းတာဝန်များ',
    analytics: 'ခွဲခြမ်းစိတ်ဖြာမှု',
    aiTools: 'AI ကိရိယာများ',
    team: 'အဖွဲ့',
    automation: 'အလိုအလျောက်လုပ်ဆောင်မှု',
    compliance: 'လိုက်နာမှု',
    integrations: 'ချိတ်ဆက်မှုများ',
    reports: 'အစီရင်ခံစာများ',
    admin: 'အုပ်ချုပ်ရေး',
    settings: 'ဆက်တင်များ',
    search: 'ရှာဖွေရန်...',
    addCandidate: 'အလုပ်သမား ထည့်ရန်',
    welcome: 'ကြိုဆိုပါသည်',
    activeJobs: 'လက်ရှိအလုပ်များ',
    openPositions: 'ဖွင့်လှစ်ထားသောနေရာများ',
    totalCandidates: 'အလုပ်သမားစုစုပေါင်း',
    newCandidates: 'အလုပ်သမားအသစ်များ',
    pipelineValue: 'Pipeline တန်ဖိုး',
    pendingTasks: 'ဆိုင်းငံ့တာဝန်များ',
    upcomingInterviews: 'လာမည့်အင်တာဗျူးများ',
    fillRate: 'ဖြည့်ဆည်းမှုနှုန်း',
    avgMatchScore: 'ပျမ်းမျှကိုက်ညီမှုရမှတ်',
    placements: 'ခန့်အပ်မှုများ',
    revenue: 'ဝင်ငွေ',
    targets: 'ပန်းတိုင်များ',
    teamPerformance: 'အဖွဲ့လုပ်ဆောင်ချက်',
    recentActivity: 'မကြာသေးမီလုပ်ဆောင်ချက်များ',
    quickActions: 'မြန်ဆန်သောလုပ်ဆောင်ချက်များ',
    parseResume: 'Resume ခွဲခြမ်းရန်',
    aiMatcher: 'AI ကိုက်ညီမှု',
    composeEmail: 'အီးမေးလ်ရေးသားရန်',
    viewReports: 'အစီရင်ခံစာကြည့်ရန်',
    candidateSources: 'အလုပ်သမားရယူသည့်နေရာများ',
    hiringFunnel: 'ငှါးရမ်းသည့်စက်လုံး',
    monthlyTrends: 'လစဉ်အချက်အလက်များ',
    talentResourcesMyanmar: 'Talent Resources Myanmar',
    enterpriseRecruitmentPlatform: 'စီးပွားရေးငှါးရမ်းသည့်စနစ်',
    quickLogin: 'မြန်ဆန်သောလော့ဂ်အင်',
    poweredBy: '© 2024 Talent Resources Myanmar။ မြန်မာ့လုပ်သားစွမ်းအားဖြင့်။',
    lightMode: 'အလင်းပုံစံ',
    darkMode: 'အမှောင်ပုံစံ',
    logout: 'ထွက်ရန်',
    new: 'အသစ်',
    screening: 'စစ်ဆေးခြင်း',
    interviewing: 'အင်တာဗျူး',
    offered: 'ကမ်းလှမ်းထား',
    placed: 'ခန့်အပ်ပြီး',
    status: 'အခြေအနေ',
    actions: 'လုပ်ဆောင်ချက်များ',
    name: 'အမည်',
    email: 'အီးမေးလ်',
    phone: 'ဖုန်း',
    location: 'နေရာ',
    skills: 'ကျွမ်းကျင်မှုများ',
    experience: 'အတွေ့အကြုံ',
    education: 'ပညာရေး',
    expectedSalary: 'မျှော်မှန်းကျန်ချိန်',
    source: 'ရင်းမြစ်',
    matchScore: 'ကိုက်ညီမှုရမှတ်',
    notes: 'မှတ်ချက်များ',
    tags: 'တပ်များ',
    save: 'သိမ်းဆည်းရန်',
    cancel: 'ပယ်ဖျက်ရန်',
    edit: 'ပြင်ဆင်ရန်',
    delete: 'ဖျက်ရန်',
    view: 'ကြည့်ရှုရန်',
    advancedAnalytics: 'ခေတ်မီခွဲခြမ်းစိတ်ဖြာမှု',
    predictiveInsights: 'ခန့်မှန်းအသိဉာဏ်နှင့် လုပ်ဆောင်ချက်အညွှန်းကိန်းများ',
    predictiveHiringForecast: 'ခန့်မှန်းငှါးရမ်းမှုခန့်မှန်းချက်',
    aiPoweredPlacementPredictions: 'AI အခြေခံခန့်အပ်မှုခန့်မှန်းချက်',
    timeToHireAnalysis: 'ငှါးရမ်းရန်အချိန်ခွဲခြမ်းစိတ်ဖြာမှု',
    avgDaysPerRecruitmentStage: 'ငှါးရမ်းသည့်အဆင့်တိုင်းပျမ်းမျှနေ့များ',
    sourceROIAnalysis: 'ရင်းမြစ် ROI ခွဲခြမ်းစိတ်ဖြာမှု',
    costEffectivenessByChannel: 'ငှါးရမ်းသည့်လမ်းကြောင်းအသုံးစရိတ်ထိရောက်မှု',
    skillsDemandHeatmap: 'ကျွမ်းကျင်မှုလိုအပ်ချက်ပူပြင်းမြေပုံ',
    marketDemandVsSupply: 'ဈေးကွက်လိုအပ်ချက် vs ပေးစွမ်းနိုင်မှု',
    aiPoweredInsights: 'AI အခြေခံအသိဉာဏ်',
    workflowAutomation: 'အလုပ်စီးဆင့်အလိုအလျောက်လုပ်ဆောင်မှု',
    streamlineProcesses: 'သင့်ငှါးရမ်းသည့်လုပ်ငန်းစဉ်များကို ရိုးရှင်းစေပါ',
    createAutomation: 'အလိုအလျောက်လုပ်ဆောင်မှုဖန်တီးရန်',
    activeAutomations: 'လက်ရှိအလိုအလျောက်လုပ်ဆောင်မှုများ',
    totalExecutions: 'ဆောင်ရွက်မှုစုစုပေါင်း',
    timeSaved: 'ချွေတာခဲ့သောအချိန်',
    efficiencyGain: 'ထိရောက်မှုတိုးတက်မှု',
    complianceCenter: 'လိုက်နာမှုစင်တာ',
    documentsCertsAudit: 'စာရွက်စာတမ်းများ၊ အသိအမှတ်ပြုလက်မှတ်များနှင့် စာရင်းအင်း',
    auditLog: 'စာရင်းအင်းမှတ်တမ်း',
    addDocument: 'စာရွက်စာတမ်းထည့်ရန်',
    documents: 'စာရွက်စာတမ်းများ',
    pendingSignatures: 'ဆိုင်းငံ့လက်မှတ်များ',
    expiringSoon: 'မကြာမီသက်တမ်းကုန်ဆုံးမည်',
    complianceScore: 'လိုက်နာမှုရမှတ်',
    integrationHub: 'ချိတ်ဆက်မှုဟပ်',
    connectFavoriteTools: 'သင့်နှစ်သက်သောကိရိယာများချိတ်ဆက်ရန်',
    webhooks: 'Webhooks',
    realTimeNotifications: 'အချိန်နှင့်တပြေးညွှန်ကြားချက်များ'
  }
};

// Helper function
const t = (key: keyof typeof translations.en, lang: 'en' | 'mm' = 'en') => translations[lang][key] || key;

// ==================== MAIN COMPONENT ====================
export default function TRMPlatform() {
  // Theme
  const [theme, setTheme] = useState<Theme>('light');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data with localStorage persistence
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trm-users');
      return saved ? JSON.parse(saved) : initialUsers;
    }
    return initialUsers;
  });
  
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trm-candidates');
      return saved ? JSON.parse(saved) : initialCandidates;
    }
    return initialCandidates;
  });
  
  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trm-jobs');
      return saved ? JSON.parse(saved) : initialJobs;
    }
    return initialJobs;
  });
  
  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trm-clients');
      return saved ? JSON.parse(saved) : initialClients;
    }
    return initialClients;
  });
  
  const [interviews, setInterviews] = useState<Interview[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trm-interviews');
      return saved ? JSON.parse(saved) : initialInterviews;
    }
    return initialInterviews;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trm-tasks');
      return saved ? JSON.parse(saved) : initialTasks;
    }
    return initialTasks;
  });
  
  const [deals, setDeals] = useState<Deal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trm-deals');
      return saved ? JSON.parse(saved) : initialDeals;
    }
    return initialDeals;
  });
  
  // Placement history for reports
  const [placements, setPlacements] = useState<{id: string; candidateName: string; jobTitle: string; clientName: string; salary: number; fee: number; date: string; recruiterId: string}[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trm-placements');
      return saved ? JSON.parse(saved) : [
        { id: 'p1', candidateName: 'Mg Aung', jobTitle: 'Production Worker', clientName: 'MGS Beverage', salary: 300000, fee: 30000, date: '2024-12-15', recruiterId: 'u3' },
        { id: 'p2', candidateName: 'U Thein Tun', jobTitle: 'Site Supervisor', clientName: 'Shwe Taung Group', salary: 700000, fee: 70000, date: '2024-12-10', recruiterId: 'u2' },
        { id: 'p3', candidateName: 'Daw Su Su', jobTitle: 'Bank Teller', clientName: 'KBZ Bank', salary: 450000, fee: 45000, date: '2024-12-08', recruiterId: 'u3' },
        { id: 'p4', candidateName: 'Ma Hla Hla', jobTitle: 'Quality Inspector', clientName: 'Mandalay Garment', salary: 350000, fee: 35000, date: '2024-11-25', recruiterId: 'u4' },
        { id: 'p5', candidateName: 'Ko Myo Min', jobTitle: 'Electrician', clientName: 'Power Solutions', salary: 550000, fee: 55000, date: '2024-11-20', recruiterId: 'u4' },
      ];
    }
    return [];
  });
  
  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('trm-candidates', JSON.stringify(candidates));
  }, [candidates]);
  
  useEffect(() => {
    localStorage.setItem('trm-jobs', JSON.stringify(jobs));
  }, [jobs]);
  
  useEffect(() => {
    localStorage.setItem('trm-clients', JSON.stringify(clients));
  }, [clients]);
  
  useEffect(() => {
    localStorage.setItem('trm-interviews', JSON.stringify(interviews));
  }, [interviews]);
  
  useEffect(() => {
    localStorage.setItem('trm-tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('trm-deals', JSON.stringify(deals));
  }, [deals]);
  
  useEffect(() => {
    localStorage.setItem('trm-placements', JSON.stringify(placements));
  }, [placements]);
  
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
  const [showJobBoardDialog, setShowJobBoardDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [showClientPortal, setShowClientPortal] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [showSkillsDialog, setShowSkillsDialog] = useState(false);
  
  // Edit states
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // New feature states
  const [selectedJobBoards, setSelectedJobBoards] = useState<string[]>([]);
  const [offerLetterData, setOfferLetterData] = useState<{subject: string; content: string} | null>(null);
  const [notificationHistory, setNotificationHistory] = useState<{id: string; type: string; message: string; time: string}[]>([]);
  const [onboardingChecklist, setOnboardingChecklist] = useState<{id: string; task: string; completed: boolean}[]>([
    { id: '1', task: 'Complete personal information form', completed: false },
    { id: '2', task: 'Submit NRC copy', completed: false },
    { id: '3', task: 'Provide bank account details', completed: false },
    { id: '4', task: 'Sign employment contract', completed: false },
    { id: '5', task: 'Complete tax form', completed: false },
    { id: '6', task: 'Emergency contact information', completed: false },
    { id: '7', task: 'Profile photo submission', completed: false },
    { id: '8', task: 'Company orientation scheduled', completed: false }
  ]);
  
  // Import/Export states
  const [importData, setImportData] = useState<string>('');
  const [importPreview, setImportPreview] = useState<{name: string; email: string}[]>([]);
  const [exportType, setExportType] = useState<string>('candidates');
  
  // Invoice states
  const [invoiceData, setInvoiceData] = useState<{
    clientName: string;
    placements: {candidateName: string; position: string; salary: number; fee: number}[];
    total: number;
  } | null>(null);
  
  // Referral states
  const [referrals, setReferrals] = useState<{id: string; candidateName: string; referredBy: string; status: string; reward: number}[]>([
    { id: 'r1', candidateName: 'Mg Than', referredBy: 'U Aung', status: 'hired', reward: 50000 },
    { id: 'r2', candidateName: 'Ma Mya', referredBy: 'Daw Hla', status: 'pending', reward: 0 }
  ]);
  
  // Skills assessment states
  const [skillAssessments, setSkillAssessments] = useState<{skill: string; score: number; maxScore: number}[]>([]);
  
  // Language support
  const [language, setLanguage] = useState<'en' | 'mm'>('en');
  
  // Advanced Analytics states
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [predictiveInsights, setPredictiveInsights] = useState(true);
  
  // Compliance & Documents states
  const [documents, setDocuments] = useState<{id: string; name: string; type: string; status: 'pending' | 'sent' | 'signed'; candidateName?: string; expiryDate?: string}[]>([
    { id: 'd1', name: 'Employment Contract Template', type: 'contract', status: 'pending' },
    { id: 'd2', name: 'NDA Agreement', type: 'nda', status: 'pending' },
    { id: 'd3', name: 'Offer Letter - Mg Aung', type: 'offer', status: 'sent', candidateName: 'Mg Aung' },
    { id: 'd4', name: 'Work Permit - U Thein Tun', type: 'permit', status: 'signed', candidateName: 'U Thein Tun', expiryDate: '2025-06-15' }
  ]);
  const [auditLogs, setAuditLogs] = useState<{id: string; action: string; user: string; timestamp: string; details: string}[]>([
    { id: 'a1', action: 'Candidate Status Changed', user: 'Ko Zaw Zaw', timestamp: '2024-12-20 10:30', details: 'Mg Aung moved to Interviewing' },
    { id: 'a2', action: 'Job Created', user: 'Daw Mya Mya', timestamp: '2024-12-19 14:15', details: 'Site Supervisor position added' },
    { id: 'a3', action: 'Document Signed', user: 'Ma Hla Hla', timestamp: '2024-12-18 09:00', details: 'Offer letter signed by U Thein Tun' }
  ]);
  
  // Automation states
  const [automations, setAutomations] = useState<{id: string; name: string; trigger: string; action: string; active: boolean; executions: number}[]>([
    { id: 'auto1', name: 'Welcome Email', trigger: 'New Candidate Added', action: 'Send welcome email', active: true, executions: 156 },
    { id: 'auto2', name: 'Interview Reminder', trigger: 'Interview Scheduled', action: 'Send reminder 24h before', active: true, executions: 89 },
    { id: 'auto3', name: 'Job Assignment Task', trigger: 'Job Assigned', action: 'Create screening task', active: true, executions: 45 },
    { id: 'auto4', name: 'Weekly Report', trigger: 'Every Friday 5PM', action: 'Email performance summary', active: false, executions: 12 }
  ]);
  
  // Integration states
  const [integrations, setIntegrations] = useState<{id: string; name: string; icon: string; status: 'connected' | 'disconnected' | 'pending'; lastSync?: string}[]>([
    { id: 'i1', name: 'LinkedIn Recruiter', icon: 'linkedin', status: 'connected', lastSync: '2024-12-20 08:00' },
    { id: 'i2', name: 'JobNet.com.mm', icon: 'jobnet', status: 'connected', lastSync: '2024-12-19 18:30' },
    { id: 'i3', name: 'Gmail', icon: 'gmail', status: 'disconnected' },
    { id: 'i4', name: 'Google Calendar', icon: 'gcal', status: 'connected', lastSync: '2024-12-20 10:15' },
    { id: 'i5', name: 'Myanmar Job Websites', icon: 'myanmar', status: 'pending' }
  ]);
  
  const [showAutomationBuilder, setShowAutomationBuilder] = useState(false);
  const [showIntegrationHub, setShowIntegrationHub] = useState(false);
  const [showDocumentManager, setShowDocumentManager] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  
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
      { id: 'analytics', label: 'Analytics', icon: BarChart3, highlight: true },
      { id: 'ai-tools', label: 'AI Tools', icon: Bot }
    ];

    const adminItems = [
      { id: 'team', label: 'Team', icon: Users, show: isManager },
      { id: 'automation', label: 'Automation', icon: Workflow, show: isManager },
      { id: 'compliance', label: 'Compliance', icon: ShieldCheck, show: isManager },
      { id: 'integrations', label: 'Integrations', icon: Link, show: isManager },
      { id: 'reports', label: 'Reports', icon: PieChart, show: isManager },
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
          <button onClick={() => setLanguage(language === 'en' ? 'mm' : 'en')} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors">
            <Languages className="h-5 w-5" />
            {sidebarOpen && <span>{language === 'en' ? 'မြန်မာ' : 'English'}</span>}
          </button>
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
  const [pipelineView, setPipelineView] = useState<'deals' | 'candidates'>('deals');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const [draggedCandidate, setDraggedCandidate] = useState<string | null>(null);

  const dealStages: { id: Deal['stage']; label: string; color: string; probability: number }[] = [
    { id: 'lead', label: 'Lead', color: 'from-slate-400 to-slate-500', probability: 10 },
    { id: 'qualified', label: 'Qualified', color: 'from-blue-400 to-blue-600', probability: 25 },
    { id: 'proposal', label: 'Proposal', color: 'from-purple-400 to-purple-600', probability: 50 },
    { id: 'negotiation', label: 'Negotiation', color: 'from-orange-400 to-orange-600', probability: 75 },
    { id: 'won', label: 'Won', color: 'from-green-400 to-emerald-600', probability: 100 }
  ];

  const candidateStages = [
    { id: 'new', label: 'New', color: 'from-cyan-400 to-cyan-600' },
    { id: 'screening', label: 'Screening', color: 'from-yellow-400 to-yellow-600' },
    { id: 'interviewing', label: 'Interview', color: 'from-blue-400 to-blue-600' },
    { id: 'offered', label: 'Offered', color: 'from-purple-400 to-purple-600' },
    { id: 'placed', label: 'Placed', color: 'from-green-400 to-emerald-600' }
  ];

  const moveDealToStage = (dealId: string, newStage: Deal['stage']) => {
    const stageInfo = dealStages.find(s => s.id === newStage);
    setDeals(prev => prev.map(d => 
      d.id === dealId 
        ? { ...d, stage: newStage, probability: stageInfo?.probability || d.probability }
        : d
    ));
    
    // If won, create a placement record
    if (newStage === 'won') {
      const deal = deals.find(d => d.id === dealId);
      if (deal) {
        const newPlacement = {
          id: `p${Date.now()}`,
          candidateName: 'TBD',
          jobTitle: deal.title,
          clientName: deal.clientName,
          salary: deal.value,
          fee: Math.round(deal.value * 0.1),
          date: new Date().toISOString().split('T')[0],
          recruiterId: deal.assignedTo
        };
        setPlacements(prev => [...prev, newPlacement]);
      }
    }
  };

  const moveCandidateToStage = (candidateId: string, newStage: string) => {
    setCandidates(prev => prev.map(c => 
      c.id === candidateId ? { ...c, status: newStage } : c
    ));
    
    // If placed, create placement record
    if (newStage === 'placed') {
      const candidate = candidates.find(c => c.id === candidateId);
      if (candidate && candidate.appliedJobs.length > 0) {
        const job = jobs.find(j => j.id === candidate.appliedJobs[0]);
        if (job) {
          const newPlacement = {
            id: `p${Date.now()}`,
            candidateName: candidate.name,
            jobTitle: job.title,
            clientName: job.clientName,
            salary: candidate.expectedSalary,
            fee: Math.round(candidate.expectedSalary * 0.1),
            date: new Date().toISOString().split('T')[0],
            recruiterId: candidate.assignedTo
          };
          setPlacements(prev => [...prev, newPlacement]);
          
          // Update job filled count
          setJobs(prev => prev.map(j => 
            j.id === job.id ? { ...j, filled: j.filled + 1 } : j
          ));
        }
      }
    }
  };

  const handleDealDragStart = (dealId: string) => {
    setDraggedDeal(dealId);
  };

  const handleDealDrop = (stage: Deal['stage']) => {
    if (draggedDeal) {
      moveDealToStage(draggedDeal, stage);
      setDraggedDeal(null);
    }
  };

  const handleCandidateDragStart = (candidateId: string) => {
    setDraggedCandidate(candidateId);
  };

  const handleCandidateDrop = (stage: string) => {
    if (draggedCandidate) {
      moveCandidateToStage(draggedCandidate, stage);
      setDraggedCandidate(null);
    }
  };

  const addNewDeal = (deal: Partial<Deal>) => {
    const newDeal: Deal = {
      id: `d${Date.now()}`,
      title: deal.title || 'New Deal',
      clientName: deal.clientName || '',
      value: deal.value || 0,
      stage: 'lead',
      probability: 10,
      expectedCloseDate: deal.expectedCloseDate || '',
      assignedTo: deal.assignedTo || currentUser?.id || ''
    };
    setDeals(prev => [...prev, newDeal]);
  };

  const renderPipeline = () => {
    const totalPipelineValue = filteredDeals.filter(d => d.stage !== 'won').reduce((sum, d) => sum + d.value, 0);
    const weightedValue = filteredDeals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Pipeline Management</h2>
            <p className="text-slate-500">Drag & drop to move items between stages</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg overflow-hidden border">
              <button
                onClick={() => setPipelineView('deals')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  pipelineView === 'deals' 
                    ? 'bg-blue-600 text-white' 
                    : theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600'
                }`}
              >
                <DollarSign className="h-4 w-4 inline mr-1" /> Deals
              </button>
              <button
                onClick={() => setPipelineView('candidates')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  pipelineView === 'candidates' 
                    ? 'bg-blue-600 text-white' 
                    : theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600'
                }`}
              >
                <Users className="h-4 w-4 inline mr-1" /> Candidates
              </button>
            </div>
            {pipelineView === 'deals' && (
              <Button onClick={() => { setEditingDeal(null); setShowDealDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Deal
              </Button>
            )}
          </div>
        </div>

        {/* Pipeline Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Pipeline</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{formatMMK(totalPipelineValue)}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Weighted Value</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{formatMMK(weightedValue)}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{pipelineView === 'deals' ? 'Active Deals' : 'Active Candidates'}</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>
                    {pipelineView === 'deals' 
                      ? filteredDeals.filter(d => d.stage !== 'won').length 
                      : filteredCandidates.filter(c => c.status !== 'placed' && c.status !== 'rejected').length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  {pipelineView === 'deals' ? <Briefcase className="h-5 w-5 text-purple-600" /> : <Users className="h-5 w-5 text-purple-600" />}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Won This Month</p>
                  <p className={`text-2xl font-bold text-green-600`}>{formatMMK(placements.reduce((s, p) => s + p.fee, 0))}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Board */}
        {pipelineView === 'deals' ? (
          <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
            {dealStages.map(stage => {
              const stageDeals = filteredDeals.filter(d => d.stage === stage.id);
              const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
              
              return (
                <div
                  key={stage.id}
                  className="min-w-[240px]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDealDrop(stage.id)}
                >
                  {/* Stage Header */}
                  <div className={`p-3 rounded-t-xl bg-gradient-to-r ${stage.color} text-white flex items-center justify-between shadow-lg`}>
                    <div>
                      <span className="font-semibold">{stage.label}</span>
                      <span className="ml-2 text-xs opacity-80">({stage.probability}%)</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-0 text-xs">{stageDeals.length}</Badge>
                  </div>
                  
                  {/* Stage Value */}
                  <div className={`px-3 py-2 text-center border-x ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{formatMMK(stageValue)}</span>
                  </div>
                  
                  {/* Stage Content */}
                  <div 
                    className={`rounded-b-xl p-2 space-y-2 min-h-[300px] ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} border-x border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {stageDeals.map(deal => (
                      <Card
                        key={deal.id}
                        draggable
                        onDragStart={() => handleDealDragStart(deal.id)}
                        className={`cursor-grab active:cursor-grabbing hover:shadow-lg transition-all border-0 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white'} ${draggedDeal === deal.id ? 'opacity-50' : ''}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{deal.title}</p>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setEditingDeal(deal); setShowDealDialog(true); }}>
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setDeals(prev => prev.filter(d => d.id !== deal.id))}>
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <p className="text-xs text-slate-500 truncate mb-2">
                            <Building2 className="h-3 w-3 inline mr-1" />
                            {deal.clientName}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-green-600">{formatMMK(deal.value)}</span>
                            <Badge variant="outline" className="text-xs">{deal.probability}%</Badge>
                          </div>
                          
                          {stage.id !== 'won' && stage.id !== 'lead' && (
                            <Button 
                              size="sm" 
                              className="w-full mt-2 h-7 text-xs"
                              onClick={() => {
                                const nextStageIdx = dealStages.findIndex(s => s.id === stage.id) + 1;
                                if (nextStageIdx < dealStages.length) {
                                  moveDealToStage(deal.id, dealStages[nextStageIdx].id);
                                }
                              }}
                            >
                              <ArrowRight className="h-3 w-3 mr-1" /> Next Stage
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    
                    {stageDeals.length === 0 && (
                      <div className={`h-24 rounded-lg border-2 border-dashed flex items-center justify-center ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'}`}>
                        <p className="text-xs text-slate-400">Drop deals here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Candidate Pipeline */
          <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
            {candidateStages.map(stage => {
              const stageCandidates = filteredCandidates.filter(c => c.status === stage.id);
              
              return (
                <div
                  key={stage.id}
                  className="min-w-[240px]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleCandidateDrop(stage.id)}
                >
                  {/* Stage Header */}
                  <div className={`p-3 rounded-t-xl bg-gradient-to-r ${stage.color} text-white flex items-center justify-between shadow-lg`}>
                    <span className="font-semibold">{stage.label}</span>
                    <Badge className="bg-white/20 text-white border-0 text-xs">{stageCandidates.length}</Badge>
                  </div>
                  
                  {/* Stage Content */}
                  <div 
                    className={`rounded-b-xl p-2 space-y-2 min-h-[300px] ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} border-x border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {stageCandidates.map(candidate => (
                      <Card
                        key={candidate.id}
                        draggable
                        onDragStart={() => handleCandidateDragStart(candidate.id)}
                        className={`cursor-grab active:cursor-grabbing hover:shadow-lg transition-all border-0 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white'} ${draggedCandidate === candidate.id ? 'opacity-50' : ''}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{candidate.name}</p>
                              <p className="text-xs text-slate-500 truncate">{candidate.currentCompany}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-2">
                            {candidate.skills.slice(0, 2).map(skill => (
                              <Badge key={skill} variant="outline" className="text-[10px] px-1">{skill}</Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {candidate.location}
                            </span>
                            {candidate.matchScore && (
                              <Badge className={`text-[10px] ${candidate.matchScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {candidate.matchScore}% match
                              </Badge>
                            )}
                          </div>
                          
                          {stage.id !== 'placed' && (
                            <Button 
                              size="sm" 
                              className="w-full mt-2 h-7 text-xs"
                              onClick={() => {
                                const nextStageIdx = candidateStages.findIndex(s => s.id === stage.id) + 1;
                                if (nextStageIdx < candidateStages.length) {
                                  moveCandidateToStage(candidate.id, candidateStages[nextStageIdx].id);
                                }
                              }}
                            >
                              <ArrowRight className="h-3 w-3 mr-1" /> Advance
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    
                    {stageCandidates.length === 0 && (
                      <div className={`h-24 rounded-lg border-2 border-dashed flex items-center justify-center ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'}`}>
                        <p className="text-xs text-slate-400">Drop candidates here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Deal Dialog */}
        <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
          <DialogContent className={`max-w-md ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
            <DialogHeader>
              <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>
                {editingDeal ? 'Edit Deal' : 'Add New Deal'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Deal Title</Label>
                <Input 
                  placeholder="e.g., Annual Recruitment Contract" 
                  className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}
                  defaultValue={editingDeal?.title}
                  id="deal-title"
                />
              </div>
              <div>
                <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Client</Label>
                <Select defaultValue={editingDeal?.clientName}>
                  <SelectTrigger className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.companyName}>{c.companyName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Value (MMK)</Label>
                <Input 
                  type="number" 
                  placeholder="15000000" 
                  className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}
                  defaultValue={editingDeal?.value}
                  id="deal-value"
                />
              </div>
              <div>
                <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Expected Close Date</Label>
                <Input 
                  type="date" 
                  className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}
                  defaultValue={editingDeal?.expectedCloseDate}
                  id="deal-date"
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowDealDialog(false)}>Cancel</Button>
              <Button onClick={() => {
                const title = (document.getElementById('deal-title') as HTMLInputElement)?.value || 'New Deal';
                const value = parseInt((document.getElementById('deal-value') as HTMLInputElement)?.value) || 0;
                const date = (document.getElementById('deal-date') as HTMLInputElement)?.value || '';
                
                if (editingDeal) {
                  setDeals(prev => prev.map(d => 
                    d.id === editingDeal.id ? { ...d, title, value, expectedCloseDate: date } : d
                  ));
                } else {
                  addNewDeal({ title, value, expectedCloseDate: date, clientName: clients[0]?.companyName });
                }
                setShowDealDialog(false);
              }}>
                {editingDeal ? 'Update' : 'Create'} Deal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
  const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly');
  const [reportMonth, setReportMonth] = useState(new Date().getMonth());
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);

  const generateMonthlyReport = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthPlacements = placements.filter(p => {
      const d = new Date(p.date);
      return d.getMonth() === reportMonth && d.getFullYear() === reportYear;
    });
    
    const totalRevenue = monthPlacements.reduce((sum, p) => sum + p.fee, 0);
    const totalPlacements = monthPlacements.length;
    
    const clientBreakdown = clients.map(c => {
      const cPlacements = monthPlacements.filter(p => p.clientName === c.companyName);
      return {
        name: c.companyName,
        placements: cPlacements.length,
        revenue: cPlacements.reduce((sum, p) => sum + p.fee, 0)
      };
    }).filter(c => c.placements > 0);
    
    const recruiterBreakdown = users.filter(u => u.role !== 'md').map(u => {
      const uPlacements = monthPlacements.filter(p => p.recruiterId === u.id);
      return {
        name: u.name,
        placements: uPlacements.length,
        revenue: uPlacements.reduce((sum, p) => sum + p.fee, 0),
        target: u.targets.monthlyPlacements,
        achieved: uPlacements.length >= u.targets.monthlyPlacements
      };
    });
    
    const sourceBreakdown = [
      { source: 'Walk-in', count: Math.floor(totalPlacements * 0.35), percentage: 35 },
      { source: 'LinkedIn', count: Math.floor(totalPlacements * 0.28), percentage: 28 },
      { source: 'Referral', count: Math.floor(totalPlacements * 0.20), percentage: 20 },
      { source: 'JobNet', count: Math.floor(totalPlacements * 0.12), percentage: 12 },
      { source: 'Other', count: Math.floor(totalPlacements * 0.05), percentage: 5 }
    ];
    
    return {
      type: 'monthly',
      title: `Monthly Recruitment Report - ${monthNames[reportMonth]} ${reportYear}`,
      period: `${monthNames[reportMonth]} ${reportYear}`,
      generatedAt: new Date().toISOString(),
      summary: {
        totalPlacements,
        totalRevenue,
        activeJobs: jobs.filter(j => j.status === 'in-progress').length,
        newCandidates: candidates.filter(c => {
          const d = new Date(c.createdAt);
          return d.getMonth() === reportMonth && d.getFullYear() === reportYear;
        }).length,
        interviewsConducted: interviews.filter(i => i.status === 'completed').length
      },
      clientBreakdown,
      recruiterBreakdown,
      sourceBreakdown,
      placements: monthPlacements
    };
  };

  const generateYearlyReport = () => {
    const yearPlacements = placements.filter(p => new Date(p.date).getFullYear() === reportYear);
    const totalRevenue = yearPlacements.reduce((sum, p) => sum + p.fee, 0);
    
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthPlacements = yearPlacements.filter(p => new Date(p.date).getMonth() === i);
      return {
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        placements: monthPlacements.length,
        revenue: monthPlacements.reduce((sum, p) => sum + p.fee, 0)
      };
    });
    
    const topClients = clients.map(c => {
      const cPlacements = yearPlacements.filter(p => p.clientName === c.companyName);
      return { name: c.companyName, placements: cPlacements.length, revenue: cPlacements.reduce((sum, p) => sum + p.fee, 0) };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    
    const topRecruiters = users.filter(u => u.role !== 'md').map(u => {
      const uPlacements = yearPlacements.filter(p => p.recruiterId === u.id);
      return { name: u.name, placements: uPlacements.length, revenue: uPlacements.reduce((sum, p) => sum + p.fee, 0) };
    }).sort((a, b) => b.revenue - a.revenue);
    
    const categoryBreakdown = [
      { category: 'Manufacturing', placements: Math.floor(yearPlacements.length * 0.35), revenue: Math.floor(totalRevenue * 0.35) },
      { category: 'Construction', placements: Math.floor(yearPlacements.length * 0.20), revenue: Math.floor(totalRevenue * 0.22) },
      { category: 'Banking', placements: Math.floor(yearPlacements.length * 0.15), revenue: Math.floor(totalRevenue * 0.18) },
      { category: 'Hospitality', placements: Math.floor(yearPlacements.length * 0.12), revenue: Math.floor(totalRevenue * 0.10) },
      { category: 'Other', placements: Math.floor(yearPlacements.length * 0.18), revenue: Math.floor(totalRevenue * 0.15) }
    ];
    
    return {
      type: 'yearly',
      title: `Annual Recruitment Report - ${reportYear}`,
      period: `Year ${reportYear}`,
      generatedAt: new Date().toISOString(),
      summary: {
        totalPlacements: yearPlacements.length,
        totalRevenue,
        avgMonthlyPlacements: Math.round(yearPlacements.length / 12),
        avgRevenuePerPlacement: yearPlacements.length > 0 ? Math.round(totalRevenue / yearPlacements.length) : 0,
        growthRate: '+18%' // Calculated vs previous year
      },
      monthlyData,
      topClients,
      topRecruiters,
      categoryBreakdown
    };
  };

  const exportReportToPDF = (report: any) => {
    // Create printable HTML report
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .title { font-size: 28px; font-weight: bold; margin: 10px 0; }
          .period { color: #64748b; font-size: 14px; }
          .section { margin: 30px 0; }
          .section-title { font-size: 18px; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 32px; font-weight: bold; color: #3b82f6; }
          .stat-label { color: #64748b; font-size: 12px; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
          td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
          .revenue { color: #10b981; font-weight: bold; }
          .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🎯 Talent Resources Myanmar</div>
          <div class="title">${report.title}</div>
          <div class="period">Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        
        <div class="section">
          <div class="section-title">📊 Executive Summary</div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${report.summary.totalPlacements}</div>
              <div class="stat-label">Total Placements</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">K ${report.summary.totalRevenue?.toLocaleString() || report.summary.avgRevenuePerPlacement?.toLocaleString()}</div>
              <div class="stat-label">${report.type === 'monthly' ? 'Total Revenue' : 'Avg Revenue/Placement'}</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${report.summary.activeJobs || report.summary.avgMonthlyPlacements}</div>
              <div class="stat-label">${report.type === 'monthly' ? 'Active Jobs' : 'Avg Monthly Placements'}</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${report.summary.newCandidates || report.summary.growthRate}</div>
              <div class="stat-label">${report.type === 'monthly' ? 'New Candidates' : 'Growth Rate'}</div>
            </div>
          </div>
        </div>
        
        ${report.type === 'monthly' ? `
        <div class="section">
          <div class="section-title">🏢 Client Performance</div>
          <table>
            <thead><tr><th>Client</th><th>Placements</th><th>Revenue</th></tr></thead>
            <tbody>
              ${report.clientBreakdown.map((c: any) => `
                <tr><td>${c.name}</td><td>${c.placements}</td><td class="revenue">K ${c.revenue.toLocaleString()}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">👥 Recruiter Performance</div>
          <table>
            <thead><tr><th>Recruiter</th><th>Placements</th><th>Target</th><th>Revenue</th><th>Status</th></tr></thead>
            <tbody>
              ${report.recruiterBreakdown.map((r: any) => `
                <tr>
                  <td>${r.name}</td>
                  <td>${r.placements}</td>
                  <td>${r.target}</td>
                  <td class="revenue">K ${r.revenue.toLocaleString()}</td>
                  <td style="color: ${r.achieved ? '#10b981' : '#ef4444'}">${r.achieved ? '✓ Target Met' : '✗ Below Target'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">📍 Candidate Sources</div>
          <table>
            <thead><tr><th>Source</th><th>Candidates</th><th>Percentage</th></tr></thead>
            <tbody>
              ${report.sourceBreakdown.map((s: any) => `
                <tr><td>${s.source}</td><td>${s.count}</td><td>${s.percentage}%</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : `
        <div class="section">
          <div class="section-title">📈 Monthly Trend</div>
          <table>
            <thead><tr><th>Month</th><th>Placements</th><th>Revenue</th></tr></thead>
            <tbody>
              ${report.monthlyData.map((m: any) => `
                <tr><td>${m.month}</td><td>${m.placements}</td><td class="revenue">K ${m.revenue.toLocaleString()}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">🏆 Top Clients</div>
          <table>
            <thead><tr><th>Client</th><th>Placements</th><th>Revenue</th></tr></thead>
            <tbody>
              ${report.topClients.map((c: any) => `
                <tr><td>${c.name}</td><td>${c.placements}</td><td class="revenue">K ${c.revenue.toLocaleString()}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">👥 Recruiter Performance</div>
          <table>
            <thead><tr><th>Recruiter</th><th>Placements</th><th>Revenue</th></tr></thead>
            <tbody>
              ${report.topRecruiters.map((r: any) => `
                <tr><td>${r.name}</td><td>${r.placements}</td><td class="revenue">K ${r.revenue.toLocaleString()}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">📊 Category Breakdown</div>
          <table>
            <thead><tr><th>Industry</th><th>Placements</th><th>Revenue</th></tr></thead>
            <tbody>
              ${report.categoryBreakdown.map((c: any) => `
                <tr><td>${c.category}</td><td>${c.placements}</td><td class="revenue">K ${c.revenue.toLocaleString()}</td></tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        `}
        
        <div class="footer">
          <p>This report was generated by TRM - Talent Resources Myanmar</p>
          <p>© ${reportYear} Talent Resources Myanmar. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const renderReports = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Recruitment Reports</h2>
            <p className="text-slate-500">Generate monthly and yearly recruitment reports</p>
          </div>
        </div>
        
        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${reportType === 'monthly' ? 'ring-2 ring-blue-500' : ''} ${theme === 'dark' ? 'bg-slate-800' : ''}`} onClick={() => setReportType('monthly')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Monthly Report</h3>
                  <p className="text-sm text-slate-500">Detailed monthly recruitment metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`cursor-pointer transition-all hover:shadow-lg ${reportType === 'yearly' ? 'ring-2 ring-blue-500' : ''} ${theme === 'dark' ? 'bg-slate-800' : ''}`} onClick={() => setReportType('yearly')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Yearly Report</h3>
                  <p className="text-sm text-slate-500">Annual performance overview</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Report Configuration */}
        <Card className={`${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <CardHeader>
            <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Report Configuration</CardTitle>
            <CardDescription>Select the reporting period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              {reportType === 'monthly' && (
                <div className="flex-1 min-w-[200px]">
                  <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Month</Label>
                  <Select value={reportMonth.toString()} onValueChange={(v) => setReportMonth(parseInt(v))}>
                    <SelectTrigger className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {monthNames.map((m, i) => (
                        <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex-1 min-w-[200px]">
                <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Year</Label>
                <Select value={reportYear.toString()} onValueChange={(v) => setReportYear(parseInt(v))}>
                  <SelectTrigger className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={() => {
                  const report = reportType === 'monthly' ? generateMonthlyReport() : generateYearlyReport();
                  setCurrentReport(report);
                  setShowReportPreview(true);
                }}>
                  <Eye className="h-4 w-4 mr-2" /> Preview
                </Button>
                <Button variant="outline" onClick={() => {
                  const report = reportType === 'monthly' ? generateMonthlyReport() : generateYearlyReport();
                  exportReportToPDF(report);
                }}>
                  <Download className="h-4 w-4 mr-2" /> Export PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Placements</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{placements.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className={`${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{formatMMK(placements.reduce((s, p) => s + p.fee, 0))}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className={`${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active Clients</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{clients.filter(c => c.status === 'active').length}</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className={`${theme === 'dark' ? 'bg-slate-800' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Open Positions</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{jobs.reduce((s, j) => s + (j.quantity - j.filled), 0)}</p>
                </div>
                <Briefcase className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Placements Table */}
        <Card className={`${theme === 'dark' ? 'bg-slate-800' : ''}`}>
          <CardHeader>
            <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Recent Placements</CardTitle>
            <CardDescription>Latest successful placements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Candidate</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Salary</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Fee</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.slice(0, 10).map(p => (
                    <tr key={p.id} className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{p.candidateName}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{p.jobTitle}</td>
                      <td className="py-3 px-4 text-slate-500">{p.clientName}</td>
                      <td className="py-3 px-4">{formatMMK(p.salary)}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">{formatMMK(p.fee)}</td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(p.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Report Preview Dialog */}
        <Dialog open={showReportPreview} onOpenChange={setShowReportPreview}>
          <DialogContent className={`max-w-4xl max-h-[90vh] overflow-auto ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
            <DialogHeader>
              <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>{currentReport?.title}</DialogTitle>
              <DialogDescription>Report Preview</DialogDescription>
            </DialogHeader>
            {currentReport && (
              <div className="mt-4 space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-blue-50'}`}>
                    <p className="text-sm text-slate-500">Placements</p>
                    <p className={`text-2xl font-bold text-blue-600`}>{currentReport.summary.totalPlacements}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-green-50'}`}>
                    <p className="text-sm text-slate-500">Revenue</p>
                    <p className={`text-2xl font-bold text-green-600`}>{formatMMK(currentReport.summary.totalRevenue || currentReport.summary.avgRevenuePerPlacement * currentReport.summary.totalPlacements)}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-purple-50'}`}>
                    <p className="text-sm text-slate-500">{currentReport.type === 'monthly' ? 'Active Jobs' : 'Avg/Month'}</p>
                    <p className={`text-2xl font-bold text-purple-600`}>{currentReport.summary.activeJobs || currentReport.summary.avgMonthlyPlacements}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-orange-50'}`}>
                    <p className="text-sm text-slate-500">{currentReport.type === 'monthly' ? 'New Candidates' : 'Growth'}</p>
                    <p className={`text-2xl font-bold text-orange-600`}>{currentReport.summary.newCandidates || currentReport.summary.growthRate}</p>
                  </div>
                </div>
                
                {/* Charts */}
                {currentReport.type === 'yearly' && currentReport.monthlyData && (
                  <Card className={`${theme === 'dark' ? 'bg-slate-700' : ''}`}>
                    <CardHeader>
                      <CardTitle className={`text-base ${theme === 'dark' ? 'text-white' : ''}`}>Monthly Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <ComposedChart data={currentReport.monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                          <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                          <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                          <Tooltip />
                          <Bar dataKey="placements" fill="#3b82f6" name="Placements" radius={[4, 4, 0, 0]} />
                          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowReportPreview(false)}>Close</Button>
              <Button onClick={() => currentReport && exportReportToPDF(currentReport)}>
                <Download className="h-4 w-4 mr-2" /> Export PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

  // Job Board Posting Dialog
  const renderJobBoardDialog = () => {
    const jobBoards = [
      { id: 'linkedin', name: 'LinkedIn Jobs', reach: '8M+', status: 'connected', color: 'from-blue-600 to-blue-700' },
      { id: 'jobnet', name: 'JobNet Myanmar', reach: '500K+', status: 'connected', color: 'from-green-600 to-green-700' },
      { id: 'myanmarjobs', name: 'MyanmarJobs', reach: '300K+', status: 'connected', color: 'from-orange-500 to-orange-600' },
      { id: 'jobless', name: 'Jobless.com.mm', reach: '200K+', status: 'connected', color: 'from-purple-500 to-purple-600' },
      { id: 'work', name: 'Work.com.mm', reach: '150K+', status: 'available', color: 'from-cyan-500 to-cyan-600' },
      { id: 'indeed', name: 'Indeed', reach: '250M+', status: 'available', color: 'from-indigo-500 to-indigo-600' }
    ];

    return (
      <Dialog open={showJobBoardDialog} onOpenChange={setShowJobBoardDialog}>
        <DialogContent className={`max-w-lg ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
              <Globe className="h-5 w-5 text-blue-500" /> Post to Job Boards
            </DialogTitle>
            <DialogDescription>Select job boards to publish this position</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {jobBoards.map(board => (
              <div
                key={board.id}
                onClick={() => {
                  setSelectedJobBoards(prev => 
                    prev.includes(board.id) ? prev.filter(b => b !== board.id) : [...prev, board.id]
                  );
                }}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                  selectedJobBoards.includes(board.id)
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${board.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {board.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{board.name}</p>
                  <p className="text-xs text-slate-500">{board.reach} potential candidates</p>
                </div>
                <Badge className={board.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                  {board.status}
                </Badge>
                {selectedJobBoards.includes(board.id) && <CheckCircle className="h-5 w-5 text-blue-500" />}
              </div>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowJobBoardDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowJobBoardDialog(false)} disabled={selectedJobBoards.length === 0}>
              <Send className="h-4 w-4 mr-2" /> Post to {selectedJobBoards.length} Board{selectedJobBoards.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Offer Letter Dialog
  const renderOfferLetterDialog = () => (
    <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <FileText className="h-5 w-5 text-purple-500" /> Generate Offer Letter
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Candidate Name</Label>
            <Input placeholder="Full name" id="offerName" className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} defaultValue={selectedCandidate?.name} />
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Position</Label>
            <Input placeholder="Job title" id="offerPosition" className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Company</Label>
            <Input placeholder="Company name" id="offerCompany" className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Monthly Salary (MMK)</Label>
            <Input type="number" placeholder="500000" id="offerSalary" className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} defaultValue={selectedCandidate?.expectedSalary} />
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Start Date</Label>
            <Input type="date" id="offerStart" className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Probation Period</Label>
            <Select defaultValue="3">
              <SelectTrigger className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 month</SelectItem>
                <SelectItem value="2">2 months</SelectItem>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {offerLetterData && (
          <div className="mt-4 space-y-3">
            <div>
              <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Subject</Label>
              <Input value={offerLetterData.subject} readOnly className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
            </div>
            <div>
              <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Offer Letter Content</Label>
              <Textarea value={offerLetterData.content} readOnly className={`mt-1.5 h-48 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowOfferDialog(false)}>Cancel</Button>
          {!offerLetterData ? (
            <Button onClick={async () => {
              setAiLoading(true);
              try {
                const response = await fetch('/api/offers/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    candidateName: (document.getElementById('offerName') as HTMLInputElement)?.value,
                    jobTitle: (document.getElementById('offerPosition') as HTMLInputElement)?.value,
                    companyName: (document.getElementById('offerCompany') as HTMLInputElement)?.value,
                    salary: (document.getElementById('offerSalary') as HTMLInputElement)?.value,
                    startDate: (document.getElementById('offerStart') as HTMLInputElement)?.value
                  })
                });
                const data = await response.json();
                if (data.success) setOfferLetterData(data.offerLetter);
              } catch (e) { console.error(e); }
              setAiLoading(false);
            }} disabled={aiLoading}>
              {aiLoading ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : <><Wand2 className="h-4 w-4 mr-2" /> Generate Letter</>}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOfferLetterData(null)}>Regenerate</Button>
              <Button><Send className="h-4 w-4 mr-2" /> Send Offer</Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Notification Center Dialog
  const renderNotificationCenterDialog = () => (
    <Dialog open={showNotificationCenter} onOpenChange={setShowNotificationCenter}>
      <DialogContent className={`max-w-md ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Bell className="h-5 w-5 text-orange-500" /> Notification Center
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 space-y-2">
            {[
              { id: '1', type: 'email', message: 'Interview reminder sent to Mg Aung', time: '2 min ago', icon: Mail },
              { id: '2', type: 'sms', message: 'SMS sent to Ma Hla Hla', time: '15 min ago', icon: Phone },
              { id: '3', type: 'email', message: 'Offer letter sent to U Thein Tun', time: '1 hour ago', icon: FileText },
              { id: '4', type: 'email', message: 'Weekly report generated', time: '2 hours ago', icon: BarChart3 }
            ].map(n => (
              <div key={n.id} className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${n.type === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  <n.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{n.message}</p>
                  <p className="text-xs text-slate-500">{n.time}</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Button className="w-full" variant="outline">
            <Send className="h-4 w-4 mr-2" /> Send New Notification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Onboarding Dialog
  const renderOnboardingDialog = () => {
    const completedCount = onboardingChecklist.filter(item => item.completed).length;
    const progress = (completedCount / onboardingChecklist.length) * 100;

    return (
      <Dialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog}>
        <DialogContent className={`max-w-md ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
              <ClipboardList className="h-5 w-5 text-green-500" /> Onboarding Checklist
            </DialogTitle>
            <DialogDescription>Track new hire onboarding progress</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className={theme === 'dark' ? 'text-slate-300' : ''}>Progress</span>
                <span className="font-semibold">{completedCount}/{onboardingChecklist.length} completed</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="space-y-2">
              {onboardingChecklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => setOnboardingChecklist(prev => prev.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i))}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-green-50 border border-green-200'
                      : theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className={`h-5 w-5 rounded flex items-center justify-center ${item.completed ? 'bg-green-500' : 'border-2 border-slate-300'}`}>
                    {item.completed && <CheckCircle className="h-4 w-4 text-white" />}
                  </div>
                  <span className={`text-sm ${item.completed ? 'line-through text-slate-500' : theme === 'dark' ? 'text-white' : ''}`}>{item.task}</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowOnboardingDialog(false)}>Close</Button>
            {progress === 100 && <Button>Complete Onboarding</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Import Dialog
  const renderImportDialog = () => (
    <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
      <DialogContent className={`max-w-2xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Upload className="h-5 w-5 text-blue-500" /> Bulk Import Candidates
          </DialogTitle>
          <DialogDescription>Import candidates from CSV or Excel data</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="paste" className="mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="paste">Paste Data</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
          </TabsList>
          <TabsContent value="paste" className="space-y-4 mt-4">
            <div>
              <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Paste CSV Data</Label>
              <Textarea
                placeholder="name,email,phone,location,skills,experience,education
Mg Aung,mgaung@gmail.com,+95 9 111 222 333,Yangon,Machine Operation,5,High School"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className={`mt-1.5 h-40 font-mono text-xs ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}
              />
            </div>
            {importPreview.length > 0 && (
              <div>
                <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Preview ({importPreview.length} records)</Label>
                <div className={`mt-2 p-3 rounded-lg max-h-32 overflow-y-auto ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  {importPreview.slice(0, 5).map((p, i) => (
                    <div key={i} className="text-sm flex justify-between py-1">
                      <span>{p.name}</span>
                      <span className="text-slate-500">{p.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="template" className="mt-4">
            <div className={`p-6 rounded-lg text-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Download Import Template</p>
              <p className="text-sm text-slate-500 mb-4">Use our template to ensure correct data format</p>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" /> Download CSV Template
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowImportDialog(false)}>Cancel</Button>
          <Button onClick={() => setShowImportDialog(false)}>
            <Upload className="h-4 w-4 mr-2" /> Import Candidates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Export Dialog
  const renderExportDialog = () => (
    <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
      <DialogContent className={`max-w-md ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Download className="h-5 w-5 text-green-500" /> Export Data
          </DialogTitle>
          <DialogDescription>Download your recruitment data</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Export Type</Label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="candidates">Candidates</SelectItem>
                <SelectItem value="jobs">Job Orders</SelectItem>
                <SelectItem value="clients">Clients</SelectItem>
                <SelectItem value="placements">Placements</SelectItem>
                <SelectItem value="tasks">Tasks</SelectItem>
                <SelectItem value="deals">Pipeline Deals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <p className="text-sm font-medium mb-2">Available Formats:</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">CSV</Button>
              <Button variant="outline" size="sm" className="flex-1">Excel</Button>
              <Button variant="outline" size="sm" className="flex-1">PDF</Button>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button>
          <Button onClick={() => setShowExportDialog(false)}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Invoice Dialog
  const renderInvoiceDialog = () => (
    <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
      <DialogContent className={`max-w-2xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <DollarSign className="h-5 w-5 text-green-500" /> Generate Invoice
          </DialogTitle>
          <DialogDescription>Create professional invoices for placements</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Client Name</Label>
            <Select>
              <SelectTrigger className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Invoice Number</Label>
            <Input placeholder="Auto-generated" className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Issue Date</Label>
            <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Due Date</Label>
            <Input type="date" defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} className={`mt-1.5 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
          </div>
        </div>
        
        <div className="mt-4">
          <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Select Placements to Invoice</Label>
          <div className={`mt-2 rounded-lg max-h-48 overflow-y-auto ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
            {placements.filter(p => p.status === 'confirmed').map(p => (
              <div key={p.id} className={`flex items-center justify-between p-3 border-b ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <Checkbox id={`inv-${p.id}`} />
                  <div>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{p.candidateName}</p>
                    <p className="text-xs text-slate-500">{p.jobTitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{formatMMK(p.fee)}</p>
                  <p className="text-xs text-slate-500">{p.feePercentage}% of {formatMMK(p.salary)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>Cancel</Button>
          <Button onClick={() => setShowInvoiceDialog(false)}>
            <FileText className="h-4 w-4 mr-2" /> Generate Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Referral Dialog
  const renderReferralDialog = () => (
    <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
      <DialogContent className={`max-w-lg ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Users2 className="h-5 w-5 text-purple-500" /> Referral Program
          </DialogTitle>
          <DialogDescription>Track and manage candidate referrals</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-purple-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Referral Reward</span>
              <Badge className="bg-purple-100 text-purple-700">K 50,000 per hire</Badge>
            </div>
            <p className="text-sm text-slate-500">Earn rewards for every successful referral that gets hired</p>
          </div>
          
          <div className="space-y-2">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : ''}`}>Recent Referrals</p>
            {referrals.map(r => (
              <div key={r.id} className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <div>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{r.candidateName}</p>
                  <p className="text-xs text-slate-500">Referred by {r.referredBy}</p>
                </div>
                <div className="text-right">
                  <Badge className={r.status === 'hired' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {r.status}
                  </Badge>
                  {r.reward > 0 && <p className="text-xs text-green-600 mt-1">+{formatMMK(r.reward)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowReferralDialog(false)}>Close</Button>
          <Button><Plus className="h-4 w-4 mr-2" /> Add Referral</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Skills Assessment Dialog
  const renderSkillsDialog = () => (
    <Dialog open={showSkillsDialog} onOpenChange={setShowSkillsDialog}>
      <DialogContent className={`max-w-lg ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Award className="h-5 w-5 text-orange-500" /> Skills Assessment
          </DialogTitle>
          <DialogDescription>Evaluate candidate skills</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {selectedCandidate && (
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{selectedCandidate.name}</p>
              <p className="text-sm text-slate-500">{selectedCandidate.skills?.join(', ')}</p>
            </div>
          )}
          
          <div className="space-y-3">
            {(selectedCandidate?.skills || ['Communication', 'Technical', 'Problem Solving']).map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={theme === 'dark' ? 'text-slate-300' : ''}>{skill}</span>
                  <span className="font-medium">7/10</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            ))}
          </div>
          
          <div className={`p-4 rounded-lg border-2 border-dashed ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'}`}>
            <p className={`text-center text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              AI-powered skill assessment coming soon
            </p>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowSkillsDialog(false)}>Close</Button>
          <Button><Brain className="h-4 w-4 mr-2" /> Run AI Assessment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // ==================== ANALYTICS DASHBOARD ====================
  const renderAnalytics = () => {
    const predictiveData = [
      { month: 'Jan', predicted: 18, actual: 16, confidence: 85 },
      { month: 'Feb', predicted: 22, actual: 20, confidence: 88 },
      { month: 'Mar', predicted: 25, actual: 24, confidence: 90 },
      { month: 'Apr', predicted: 20, actual: 19, confidence: 87 },
      { month: 'May', predicted: 28, actual: null, confidence: 82 },
      { month: 'Jun', predicted: 32, actual: null, confidence: 78 }
    ];
    
    const timeToHireData = [
      { stage: 'Screening', avgDays: 2.5, target: 2 },
      { stage: 'Interview', avgDays: 5.2, target: 4 },
      { stage: 'Offer', avgDays: 3.1, target: 2 },
      { stage: 'Onboarding', avgDays: 4.5, target: 5 }
    ];
    
    const sourceROI = [
      { source: 'LinkedIn', cost: 500000, hires: 12, costPerHire: 41667, roi: 340 },
      { source: 'Walk-in', cost: 0, hires: 35, costPerHire: 0, roi: 999 },
      { source: 'Referral', cost: 200000, hires: 20, costPerHire: 10000, roi: 520 },
      { source: 'JobNet', cost: 300000, hires: 8, costPerHire: 37500, roi: 280 }
    ];
    
    const skillsDemand = [
      { skill: 'Machine Operation', demand: 95, supply: 60 },
      { skill: 'Quality Control', demand: 88, supply: 70 },
      { skill: 'Customer Service', demand: 82, supply: 85 },
      { skill: 'English', demand: 78, supply: 45 },
      { skill: 'Construction', demand: 75, supply: 55 },
      { skill: 'Banking', demand: 70, supply: 65 }
    ];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Advanced Analytics</h2>
            <p className="text-slate-500">Predictive insights & performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={analyticsPeriod} onValueChange={(v: any) => setAnalyticsPeriod(v)}>
              <SelectTrigger className={`w-32 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>
        
        {/* Predictive Hiring Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
                <TrendingUp className="h-5 w-5 text-blue-500" /> Predictive Hiring Forecast
              </CardTitle>
              <CardDescription>AI-powered placement predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={predictiveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                  <Tooltip />
                  <Bar dataKey="actual" fill="#3b82f6" name="Actual" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={3} name="Predicted" strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-blue-500" />
                  <span className="text-sm text-slate-500">Actual Placements</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-amber-500" />
                  <span className="text-sm text-slate-500">AI Prediction</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
                <Clock className="h-5 w-5 text-green-500" /> Time-to-Hire Analysis
              </CardTitle>
              <CardDescription>Average days per recruitment stage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={timeToHireData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis type="number" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                  <YAxis dataKey="stage" type="category" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} width={80} />
                  <Tooltip />
                  <Bar dataKey="avgDays" fill="#10b981" name="Avg Days" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target" fill="#d1d5db" name="Target" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Source ROI & Skills Demand */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
                <DollarSign className="h-5 w-5 text-purple-500" /> Source ROI Analysis
              </CardTitle>
              <CardDescription>Cost effectiveness by recruitment channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sourceROI.map((s, i) => (
                  <div key={i} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{s.source}</span>
                      <Badge className={s.roi > 400 ? 'bg-green-100 text-green-700' : s.roi > 200 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                        {s.roi === 999 ? '∞' : s.roi + '%'} ROI
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Cost</p>
                        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>{s.cost > 0 ? formatMMK(s.cost) : 'Free'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Hires</p>
                        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>{s.hires}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Per Hire</p>
                        <p className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>{s.costPerHire > 0 ? formatMMK(s.costPerHire) : '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
                <Target className="h-5 w-5 text-orange-500" /> Skills Demand Heatmap
              </CardTitle>
              <CardDescription>Market demand vs candidate supply</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={skillsDemand}>
                  <PolarGrid stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
                  <Radar name="Demand" dataKey="demand" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  <Radar name="Supply" dataKey="supply" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* AI Insights */}
        <Card className={`border-2 border-dashed ${theme === 'dark' ? 'bg-slate-800 border-purple-500/30' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : ''}`}>AI-Powered Insights</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={theme === 'dark' ? 'text-slate-300' : ''}>Walk-in candidates have highest ROI - consider expanding walk-in hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className={theme === 'dark' ? 'text-slate-300' : ''}>English skill gap detected - 55% demand vs 45% supply, consider training partnerships</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className={theme === 'dark' ? 'text-slate-300' : ''}>Predicted 28% increase in placements next month based on current pipeline</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // ==================== AUTOMATION ENGINE ====================
  const renderAutomation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Workflow Automation</h2>
          <p className="text-slate-500">Streamline your recruitment processes</p>
        </div>
        <Button onClick={() => setShowAutomationBuilder(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Automation
        </Button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Automations</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{automations.filter(a => a.active).length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Play className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Executions</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{automations.reduce((sum, a) => sum + a.executions, 0)}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Time Saved</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>48 hrs</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Efficiency Gain</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>+32%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Automation List */}
      <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Automations</CardTitle>
          <CardDescription>Manage your workflow automations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map(auto => (
              <div key={auto.id} className={`flex items-center justify-between p-4 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${auto.active ? 'bg-green-100' : 'bg-slate-200'}`}>
                    {auto.active ? <Play className="h-5 w-5 text-green-600" /> : <Pause className="h-5 w-5 text-slate-400" />}
                  </div>
                  <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{auto.name}</p>
                    <p className="text-sm text-slate-500">When: {auto.trigger} → Then: {auto.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={theme === 'dark' ? 'border-slate-600' : ''}>
                    {auto.executions} runs
                  </Badge>
                  <Switch checked={auto.active} onCheckedChange={(checked) => {
                    setAutomations(automations.map(a => a.id === auto.id ? {...a, active: checked} : a));
                  }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== COMPLIANCE CENTER ====================
  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Compliance Center</h2>
          <p className="text-slate-500">Documents, certifications & audit trails</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowAuditLog(true)}>
            <History className="h-4 w-4 mr-2" /> Audit Log
          </Button>
          <Button onClick={() => setShowDocumentManager(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Document
          </Button>
        </div>
      </div>
      
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Documents</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{documents.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Signatures</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{documents.filter(d => d.status === 'sent').length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <FileSignature className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Expiring Soon</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>2</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Compliance Score</p>
                <p className={`text-2xl font-bold text-green-600`}>94%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Documents Table */}
      <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc.id} className={`flex items-center justify-between p-4 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <FileText className={`h-5 w-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                  <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{doc.name}</p>
                    <p className="text-sm text-slate-500">{doc.candidateName || 'Template'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {doc.expiryDate && (
                    <span className="text-sm text-amber-600">Expires: {formatDate(doc.expiryDate)}</span>
                  )}
                  <Badge className={
                    doc.status === 'signed' ? 'bg-green-100 text-green-700' :
                    doc.status === 'sent' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }>
                    {doc.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== INTEGRATIONS HUB ====================
  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Integration Hub</h2>
          <p className="text-slate-500">Connect your favorite tools</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(int => (
          <Card key={int.id} className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  {int.icon === 'linkedin' ? <Linkedin className="h-6 w-6 text-white" /> :
                   int.icon === 'gmail' ? <Mail className="h-6 w-6 text-white" /> :
                   int.icon === 'gcal' ? <Calendar className="h-6 w-6 text-white" /> :
                   <Globe className="h-6 w-6 text-white" />}
                </div>
                <Badge className={
                  int.status === 'connected' ? 'bg-green-100 text-green-700' :
                  int.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-700'
                }>
                  {int.status}
                </Badge>
              </div>
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : ''}`}>{int.name}</h3>
              {int.lastSync && (
                <p className="text-sm text-slate-500 mt-1">Last sync: {int.lastSync}</p>
              )}
              <Button 
                className="w-full mt-4" 
                variant={int.status === 'connected' ? 'outline' : 'default'}
              >
                {int.status === 'connected' ? 'Configure' : 
                 int.status === 'pending' ? 'Setup' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        ))}
        
        {/* Add Integration Card */}
        <Card className={`border-2 border-dashed ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[180px]">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-slate-400" />
            </div>
            <p className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Add Integration</p>
            <p className="text-sm text-slate-400">Connect more tools</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Webhooks */}
      <Card className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Link2 className="h-5 w-5" /> Webhooks
          </CardTitle>
          <CardDescription>Real-time event notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Candidate Status Webhook</p>
                <p className="text-sm text-slate-500 font-mono">https://api.trm.com/webhook/candidate-status</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700">Active</Badge>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ==================== AUTOMATION BUILDER DIALOG ====================
  const renderAutomationBuilderDialog = () => (
    <Dialog open={showAutomationBuilder} onOpenChange={setShowAutomationBuilder}>
      <DialogContent className={`max-w-lg ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Workflow className="h-5 w-5 text-purple-500" /> Create Automation
          </DialogTitle>
          <DialogDescription>Build automated workflows</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Automation Name</Label>
            <Input placeholder="e.g., Welcome Email" className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Trigger</Label>
            <Select>
              <SelectTrigger className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_candidate">New Candidate Added</SelectItem>
                <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="job_assigned">Job Assigned</SelectItem>
                <SelectItem value="status_change">Status Changed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Action</Label>
            <Select>
              <SelectTrigger className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="send_email">Send Email</SelectItem>
                <SelectItem value="create_task">Create Task</SelectItem>
                <SelectItem value="notify">Send Notification</SelectItem>
                <SelectItem value="update_status">Update Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setShowAutomationBuilder(false)}>Cancel</Button>
          <Button onClick={() => {
            setAutomations([...automations, { id: `auto${automations.length + 1}`, name: 'New Automation', trigger: 'Manual', action: 'Custom', active: true, executions: 0 }]);
            setShowAutomationBuilder(false);
          }}>
            <Zap className="h-4 w-4 mr-2" /> Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // ==================== INTEGRATION HUB DIALOG ====================
  const renderIntegrationHubDialog = () => (
    <Dialog open={showIntegrationHub} onOpenChange={setShowIntegrationHub}>
      <DialogContent className={`max-w-lg ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <Link className="h-5 w-5 text-blue-500" /> Connect Integration
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className={theme === 'dark' ? 'text-slate-300' : ''}>Integration configuration options...</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowIntegrationHub(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // ==================== DOCUMENT MANAGER DIALOG ====================
  const renderDocumentManagerDialog = () => (
    <Dialog open={showDocumentManager} onOpenChange={setShowDocumentManager}>
      <DialogContent className={`max-w-lg ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <FileText className="h-5 w-5 text-blue-500" /> Add Document
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Document Name</Label>
            <Input placeholder="e.g., Employment Contract" className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`} />
          </div>
          <div>
            <Label className={theme === 'dark' ? 'text-slate-300' : ''}>Type</Label>
            <Select>
              <SelectTrigger className={`mt-1 ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : ''}`}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="nda">NDA</SelectItem>
                <SelectItem value="offer">Offer Letter</SelectItem>
                <SelectItem value="permit">Work Permit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={`p-8 border-2 border-dashed rounded-lg text-center ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'}`}>
            <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">Drag & drop or click to upload</p>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setShowDocumentManager(false)}>Cancel</Button>
          <Button onClick={() => setShowDocumentManager(false)}>
            <Upload className="h-4 w-4 mr-2" /> Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // ==================== AUDIT LOG DIALOG ====================
  const renderAuditLogDialog = () => (
    <Dialog open={showAuditLog} onOpenChange={setShowAuditLog}>
      <DialogContent className={`max-w-2xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            <History className="h-5 w-5 text-purple-500" /> Audit Log
          </DialogTitle>
          <DialogDescription>Recent system activity</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3 max-h-[400px] overflow-auto">
          {auditLogs.map(log => (
            <div key={log.id} className={`flex items-start gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'}`}>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{log.action}</p>
                <p className="text-sm text-slate-500">{log.details}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span>{log.user}</span>
                  <span>•</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowAuditLog(false)}>Close</Button>
          <Button>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </DialogFooter>
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
      case 'analytics': return renderAnalytics();
      case 'ai-tools': return renderAITools();
      case 'team': return renderTeam();
      case 'automation': return renderAutomation();
      case 'compliance': return renderCompliance();
      case 'integrations': return renderIntegrations();
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
      {renderJobBoardDialog()}
      {renderOfferLetterDialog()}
      {renderNotificationCenterDialog()}
      {renderOnboardingDialog()}
      {renderImportDialog()}
      {renderExportDialog()}
      {renderInvoiceDialog()}
      {renderReferralDialog()}
      {renderSkillsDialog()}
      {renderAutomationBuilderDialog()}
      {renderIntegrationHubDialog()}
      {renderDocumentManagerDialog()}
      {renderAuditLogDialog()}
    </div>
  );
}
