'use client';

import { useState, useEffect, useMemo } from 'react';
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
import {
  Users, Briefcase, TrendingUp, UserCheck, Plus, ArrowRight, Settings, LayoutDashboard,
  Building2, Calendar, Target, Award, BarChart3, PieChart, Activity, Bell, Search,
  LogOut, ChevronDown, Edit, Trash2, Eye, Send, Mail, Phone, MapPin, Clock,
  CheckCircle, XCircle, AlertCircle, Star, Crown, Shield, UserCog, ClipboardList,
  FileText, Download, Filter, RefreshCw, MoreVertical, Kanban, UserCircle,
  Sparkles, DollarSign, BriefcaseBusiness, CalendarDays, TrendingDown, Zap
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

// ==================== TYPE DEFINITIONS ====================
type UserRole = 'md' | 'manager' | 'senior_recruiter' | 'recruiter';

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
  };
  actuals: {
    placements: number;
    revenue: number;
    meetings: number;
  };
  managerId?: string;
  teamMembers?: string[];
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
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'filled' | 'closed';
  createdAt: string;
  deadline: string;
  assignedTo: string;
  category: string;
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
  status: 'available' | 'interviewing' | 'offered' | 'placed' | 'not-interested';
  appliedJobs: string[];
  createdAt: string;
  assignedTo: string;
  source: string;
  notes: string;
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
  type: 'phone' | 'video' | 'onsite' | 'final';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes: string;
  assignedTo: string;
  outcome?: 'passed' | 'failed' | 'pending';
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
  status: 'pending' | 'confirmed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'meeting' | 'email' | 'follow_up' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  dueTime: string;
  relatedTo: string;
  relatedType: 'candidate' | 'client' | 'job' | 'placement' | 'general';
  assignedTo: string;
  createdBy: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'placement' | 'interview' | 'task';
  title: string;
  description: string;
  relatedTo: string;
  createdAt: string;
  user: string;
  userId: string;
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
}

// ==================== INITIAL DATA ====================
const initialUsers: User[] = [
  {
    id: 'u1', name: 'U Aung Myint', email: 'aungmyint@trm.com', role: 'md', department: 'Executive',
    phone: '+95 9 100 000 001', joinDate: '2020-01-15', avatar: 'AM', status: 'active',
    targets: { monthlyPlacements: 0, quarterlyRevenue: 0, clientMeetings: 0 },
    actuals: { placements: 0, revenue: 0, meetings: 0 },
    teamMembers: ['u2']
  },
  {
    id: 'u2', name: 'Daw Mya Mya', email: 'myamya@trm.com', role: 'manager', department: 'Recruitment',
    phone: '+95 9 100 000 002', joinDate: '2021-03-10', avatar: 'MM', status: 'active',
    targets: { monthlyPlacements: 15, quarterlyRevenue: 50000000, clientMeetings: 12 },
    actuals: { placements: 12, revenue: 38000000, meetings: 10 },
    managerId: 'u1', teamMembers: ['u3', 'u4', 'u5']
  },
  {
    id: 'u3', name: 'Ko Zaw Zaw', email: 'zawzaw@trm.com', role: 'senior_recruiter', department: 'Recruitment',
    phone: '+95 9 100 000 003', joinDate: '2022-06-01', avatar: 'ZZ', status: 'active',
    targets: { monthlyPlacements: 8, quarterlyRevenue: 25000000, clientMeetings: 8 },
    actuals: { placements: 6, revenue: 18000000, meetings: 7 },
    managerId: 'u2'
  },
  {
    id: 'u4', name: 'Ma Hla Hla', email: 'hlahla@trm.com', role: 'recruiter', department: 'Recruitment',
    phone: '+95 9 100 000 004', joinDate: '2023-01-15', avatar: 'HH', status: 'active',
    targets: { monthlyPlacements: 5, quarterlyRevenue: 15000000, clientMeetings: 6 },
    actuals: { placements: 4, revenue: 12000000, meetings: 5 },
    managerId: 'u2'
  },
  {
    id: 'u5', name: 'Ko Than Than', email: 'thanthan@trm.com', role: 'recruiter', department: 'Recruitment',
    phone: '+95 9 100 000 005', joinDate: '2023-08-20', avatar: 'TT', status: 'active',
    targets: { monthlyPlacements: 5, quarterlyRevenue: 15000000, clientMeetings: 6 },
    actuals: { placements: 3, revenue: 9000000, meetings: 4 },
    managerId: 'u2'
  }
];

const initialClients: Client[] = [
  { id: 'c1', companyName: 'Myanmar Golden Star Beverage', industry: 'Food & Beverage', contactPerson: 'U Thant Zin', email: 'thantzin@mgs.com', phone: '+95 9 123 456 789', address: 'Industrial Zone 1, Hlaing Tharyar', city: 'Yangon', status: 'active', notes: 'Major beverage company', createdAt: '2024-01-15', assignedTo: 'u3', totalJobs: 12, totalPlacements: 45, totalRevenue: 45000000 },
  { id: 'c2', companyName: 'Shwe Taung Development Group', industry: 'Construction', contactPerson: 'Daw Mya Mya', email: 'myamya@shwetaung.com', phone: '+95 9 234 567 890', address: 'Kabar Aye Pagoda Road, Bahan', city: 'Yangon', status: 'active', notes: 'Large construction company', createdAt: '2024-02-20', assignedTo: 'u2', totalJobs: 8, totalPlacements: 32, totalRevenue: 32000000 },
  { id: 'c3', companyName: 'Parami Energy Services', industry: 'Energy & Mining', contactPerson: 'U Kyaw Soe', email: 'kyawsoe@parami.com', phone: '+95 9 345 678 901', address: 'Pyay Road, Kamayut', city: 'Yangon', status: 'active', notes: 'Energy sector', createdAt: '2024-03-10', assignedTo: 'u3', totalJobs: 5, totalPlacements: 18, totalRevenue: 27000000 },
  { id: 'c4', companyName: 'Mandalay Garment Factory', industry: 'Textile & Garment', contactPerson: 'Daw Khin Khin', email: 'khinkhin@mandalaygarment.com', phone: '+95 9 456 789 012', address: 'Industrial Zone, Chan Mya Thar Zi', city: 'Mandalay', status: 'active', notes: 'Large garment factory', createdAt: '2024-01-25', assignedTo: 'u4', totalJobs: 15, totalPlacements: 120, totalRevenue: 60000000 },
  { id: 'c5', companyName: 'Grand Myanmar Hotel Group', industry: 'Hospitality & Tourism', contactPerson: 'U Myo Aung', email: 'myoaung@grandmyanmar.com', phone: '+95 9 567 890 123', address: 'Strand Road, Kyauktada', city: 'Yangon', status: 'active', notes: 'Hotel chain', createdAt: '2024-02-05', assignedTo: 'u5', totalJobs: 10, totalPlacements: 28, totalRevenue: 28000000 },
  { id: 'c6', companyName: 'KBZ Bank Limited', industry: 'Banking & Finance', contactPerson: 'U Aung Ko', email: 'aungko@kbzbank.com', phone: '+95 9 789 012 345', address: 'Merchant Street, Kyauktada', city: 'Yangon', status: 'active', notes: 'Major bank', createdAt: '2023-12-01', assignedTo: 'u3', totalJobs: 20, totalPlacements: 65, totalRevenue: 97500000 }
];

const initialJobs: Job[] = [
  { id: 'j1', title: 'Production Line Worker', clientId: 'c1', clientName: 'Myanmar Golden Star Beverage', location: 'Yangon - Hlaing Tharyar', salaryMin: 250000, salaryMax: 350000, requirements: 'No experience required', quantity: 20, filled: 15, priority: 'high', status: 'in-progress', createdAt: '2024-12-01', deadline: '2025-01-15', assignedTo: 'u3', category: 'Factory Worker' },
  { id: 'j2', title: 'Construction Worker', clientId: 'c2', clientName: 'Shwe Taung Development Group', location: 'Yangon - Thanlyin', salaryMin: 300000, salaryMax: 400000, requirements: 'Construction experience', quantity: 50, filled: 32, priority: 'high', status: 'in-progress', createdAt: '2024-12-05', deadline: '2025-02-01', assignedTo: 'u2', category: 'Construction Worker' },
  { id: 'j3', title: 'Hotel Receptionist', clientId: 'c5', clientName: 'Grand Myanmar Hotel Group', location: 'Yangon', salaryMin: 350000, salaryMax: 450000, requirements: 'English proficiency', quantity: 5, filled: 5, priority: 'medium', status: 'filled', createdAt: '2024-11-15', deadline: '2024-12-20', assignedTo: 'u5', category: 'Hospitality' },
  { id: 'j4', title: 'Garment Factory Worker', clientId: 'c4', clientName: 'Mandalay Garment Factory', location: 'Mandalay', salaryMin: 200000, salaryMax: 280000, requirements: 'Training provided', quantity: 100, filled: 75, priority: 'high', status: 'in-progress', createdAt: '2024-12-10', deadline: '2025-01-30', assignedTo: 'u4', category: 'Factory Worker' },
  { id: 'j5', title: 'Electrical Engineer', clientId: 'c3', clientName: 'Parami Energy Services', location: 'Yangon', salaryMin: 800000, salaryMax: 1200000, requirements: 'B.E. Electrical, 3+ years', quantity: 3, filled: 1, priority: 'medium', status: 'in-progress', createdAt: '2024-12-08', deadline: '2025-02-15', assignedTo: 'u3', category: 'Engineer' },
  { id: 'j6', title: 'Bank Teller', clientId: 'c6', clientName: 'KBZ Bank Limited', location: 'Yangon - Multiple', salaryMin: 400000, salaryMax: 550000, requirements: 'University graduate', quantity: 10, filled: 6, priority: 'medium', status: 'in-progress', createdAt: '2024-12-12', deadline: '2025-01-30', assignedTo: 'u3', category: 'Banking' }
];

const initialCandidates: Candidate[] = [
  { id: 'can1', name: 'Mg Aung', email: 'mgaung@gmail.com', phone: '+95 9 111 222 333', location: 'Yangon - Hlaing Tharyar', skills: ['Factory Work', 'Machine Operation'], experience: 5, education: 'High School', currentCompany: 'Unemployed', expectedSalary: 300000, status: 'available', appliedJobs: ['j1'], createdAt: '2024-12-01', assignedTo: 'u3', source: 'Walk-in', notes: 'Hardworking candidate' },
  { id: 'can2', name: 'Ma Hla Hla', email: 'hlahla@gmail.com', phone: '+95 9 222 333 444', location: 'Mandalay', skills: ['Sewing', 'Quality Inspection'], experience: 3, education: 'Middle School', currentCompany: 'ABC Garment', expectedSalary: 250000, status: 'interviewing', appliedJobs: ['j4'], createdAt: '2024-12-05', assignedTo: 'u4', source: 'Referral', notes: 'Experienced in garment' },
  { id: 'can3', name: 'U Thein Tun', email: 'theintun@gmail.com', phone: '+95 9 333 444 555', location: 'Yangon - South Dagon', skills: ['Construction', 'Masonry'], experience: 10, education: 'Primary School', currentCompany: 'Freelance', expectedSalary: 400000, status: 'available', appliedJobs: ['j2'], createdAt: '2024-12-08', assignedTo: 'u2', source: 'Job Fair', notes: 'Very experienced' },
  { id: 'can4', name: 'Daw Mya Mya', email: 'myamya2@gmail.com', phone: '+95 9 444 555 666', location: 'Yangon - Kamayut', skills: ['Customer Service', 'English'], experience: 4, education: 'BA English', currentCompany: 'XYZ Trading', expectedSalary: 500000, status: 'offered', appliedJobs: ['j3', 'j6'], createdAt: '2024-12-10', assignedTo: 'u5', source: 'LinkedIn', notes: 'Strong English skills' },
  { id: 'can5', name: 'Mg Zaw Zaw', email: 'zawzaw@gmail.com', phone: '+95 9 555 666 777', location: 'Yangon - Insein', skills: ['Electrical', 'AutoCAD'], experience: 7, education: 'B.E. Electrical', currentCompany: 'Power Solutions', expectedSalary: 1000000, status: 'interviewing', appliedJobs: ['j5'], createdAt: '2024-12-12', assignedTo: 'u3', source: 'Online Portal', notes: 'Technical expert' }
];

const initialInterviews: Interview[] = [
  { id: 'int1', candidateId: 'can2', candidateName: 'Ma Hla Hla', jobId: 'j4', jobTitle: 'Garment Factory Worker', clientId: 'c4', clientName: 'Mandalay Garment Factory', dateTime: '2024-12-20T10:00', type: 'onsite', status: 'scheduled', notes: 'Factory tour included', assignedTo: 'u4', outcome: 'pending' },
  { id: 'int2', candidateId: 'can5', candidateName: 'Mg Zaw Zaw', jobId: 'j5', jobTitle: 'Electrical Engineer', clientId: 'c3', clientName: 'Parami Energy Services', dateTime: '2024-12-21T14:00', type: 'final', status: 'scheduled', notes: 'Technical assessment', assignedTo: 'u3', outcome: 'pending' },
  { id: 'int3', candidateId: 'can4', candidateName: 'Daw Mya Mya', jobId: 'j6', jobTitle: 'Bank Teller', clientId: 'c6', clientName: 'KBZ Bank Limited', dateTime: '2024-12-18T09:00', type: 'video', status: 'completed', notes: 'Good communication skills', assignedTo: 'u3', outcome: 'passed' }
];

const initialPlacements: Placement[] = [
  { id: 'p1', candidateId: 'can1', candidateName: 'Mg Aung', jobId: 'j1', jobTitle: 'Production Line Worker', clientId: 'c1', clientName: 'Myanmar Golden Star Beverage', salary: 320000, fee: 3200000, feePercentage: 10, startDate: '2025-01-01', status: 'confirmed', createdBy: 'u3', createdAt: '2024-12-15' },
  { id: 'p2', candidateId: 'can3', candidateName: 'U Thein Tun', jobId: 'j2', jobTitle: 'Construction Worker', clientId: 'c2', clientName: 'Shwe Taung Development Group', salary: 380000, fee: 3800000, feePercentage: 10, startDate: '2025-01-15', status: 'confirmed', createdBy: 'u2', createdAt: '2024-12-18' },
  { id: 'p3', candidateId: 'can4', candidateName: 'Daw Mya Mya', jobId: 'j3', jobTitle: 'Hotel Receptionist', clientId: 'c5', clientName: 'Grand Myanmar Hotel Group', salary: 420000, fee: 4200000, feePercentage: 10, startDate: '2025-01-02', status: 'confirmed', createdBy: 'u5', createdAt: '2024-12-10' }
];

const initialTasks: Task[] = [
  { id: 't1', title: 'Follow up with KBZ Bank', description: 'Check on teller positions', type: 'call', priority: 'high', status: 'pending', dueDate: '2024-12-20', dueTime: '10:00', relatedTo: 'c6', relatedType: 'client', assignedTo: 'u3', createdBy: 'u2', createdAt: '2024-12-18' },
  { id: 't2', title: 'Candidate interview prep', description: 'Prepare Ma Hla Hla for factory interview', type: 'meeting', priority: 'medium', status: 'in_progress', dueDate: '2024-12-19', dueTime: '14:00', relatedTo: 'can2', relatedType: 'candidate', assignedTo: 'u4', createdBy: 'u4', createdAt: '2024-12-17' },
  { id: 't3', title: 'Client visit - Shwe Taung', description: 'Quarterly review meeting', type: 'meeting', priority: 'high', status: 'pending', dueDate: '2024-12-22', dueTime: '09:00', relatedTo: 'c2', relatedType: 'client', assignedTo: 'u2', createdBy: 'u1', createdAt: '2024-12-15' }
];

const initialDeals: Deal[] = [
  { id: 'd1', title: 'MGS Annual Contract', clientId: 'c1', clientName: 'Myanmar Golden Star Beverage', value: 15000000, stage: 'negotiation', expectedCloseDate: '2025-01-30', probability: 75, notes: 'Annual staffing contract', createdAt: '2024-11-15', assignedTo: 'u3' },
  { id: 'd2', title: 'Shwe Taung Project', clientId: 'c2', clientName: 'Shwe Taung Development Group', value: 25000000, stage: 'proposal', expectedCloseDate: '2025-02-15', probability: 50, notes: 'Construction project staffing', createdAt: '2024-12-01', assignedTo: 'u2' },
  { id: 'd3', title: 'Mandalay Garment Expansion', clientId: 'c4', clientName: 'Mandalay Garment Factory', value: 8000000, stage: 'won', expectedCloseDate: '2024-12-15', probability: 100, notes: 'Won - 100 workers', createdAt: '2024-11-01', assignedTo: 'u4' },
  { id: 'd4', title: 'KBZ Bank Recruitment', clientId: 'c6', clientName: 'KBZ Bank Limited', value: 12000000, stage: 'qualified', expectedCloseDate: '2025-02-28', probability: 40, notes: 'Bank staffing', createdAt: '2024-12-05', assignedTo: 'u3' }
];

const initialActivities: Activity[] = [
  { id: 'a1', type: 'placement', title: 'Placement Completed', description: 'Mg Aung placed at MGS Beverage', relatedTo: 'MGS Beverage', createdAt: new Date().toISOString(), user: 'Ko Zaw Zaw', userId: 'u3' },
  { id: 'a2', type: 'call', title: 'Client Call', description: 'Discussed Q1 2025 requirements', relatedTo: 'Shwe Taung', createdAt: new Date(Date.now() - 3600000).toISOString(), user: 'Daw Mya Mya', userId: 'u2' },
  { id: 'a3', type: 'interview', title: 'Interview Scheduled', description: 'Ma Hla Hla - Garment Factory', relatedTo: 'Mandalay Garment', createdAt: new Date(Date.now() - 7200000).toISOString(), user: 'Ma Hla Hla', userId: 'u4' }
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
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    md: 'Managing Director',
    manager: 'Manager',
    senior_recruiter: 'Senior Recruiter',
    recruiter: 'Recruiter'
  };
  return labels[role];
};

const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    md: 'bg-purple-100 text-purple-700 border-purple-200',
    manager: 'bg-blue-100 text-blue-700 border-blue-200',
    senior_recruiter: 'bg-green-100 text-green-700 border-green-200',
    recruiter: 'bg-orange-100 text-orange-700 border-orange-200'
  };
  return colors[role];
};

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'md': return Crown;
    case 'manager': return Shield;
    case 'senior_recruiter': return Star;
    default: return Users;
  }
};

// ==================== MAIN COMPONENT ====================
export default function TRMPlatform() {
  // State
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[1]); // Default to manager
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [placements, setPlacements] = useState<Placement[]>(initialPlacements);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dialogs
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showCandidateDialog, setShowCandidateDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showPlacementDialog, setShowPlacementDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showUserSwitchDialog, setShowUserSwitchDialog] = useState(false);

  // Edit states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Permission checks
  const isMD = currentUser.role === 'md';
  const isManager = currentUser.role === 'manager' || isMD;
  const isSenior = currentUser.role === 'senior_recruiter' || isManager;
  const canManageUsers = isMD;
  const canViewAllData = isMD;
  const canManageTeam = isManager;

  // Get team members for manager
  const teamMembers = useMemo(() => {
    if (isMD) return users;
    if (isManager) {
      const teamIds = currentUser.teamMembers || [];
      return users.filter(u => teamIds.includes(u.id) || u.id === currentUser.id);
    }
    return [currentUser];
  }, [currentUser, users, isMD, isManager]);

  // Filter data by user access
  const filteredClients = useMemo(() => {
    if (canViewAllData) return clients;
    return clients.filter(c => c.assignedTo === currentUser.id || teamMembers.some(m => m.id === c.assignedTo));
  }, [clients, currentUser, canViewAllData, teamMembers]);

  const filteredJobs = useMemo(() => {
    if (canViewAllData) return jobs;
    return jobs.filter(j => j.assignedTo === currentUser.id || teamMembers.some(m => m.id === j.assignedTo));
  }, [jobs, currentUser, canViewAllData, teamMembers]);

  const filteredCandidates = useMemo(() => {
    if (canViewAllData) return candidates;
    return candidates.filter(c => c.assignedTo === currentUser.id || teamMembers.some(m => m.id === c.assignedTo));
  }, [candidates, currentUser, canViewAllData, teamMembers]);

  const filteredTasks = useMemo(() => {
    if (canViewAllData) return tasks;
    return tasks.filter(t => t.assignedTo === currentUser.id || teamMembers.some(m => m.id === t.assignedTo));
  }, [tasks, currentUser, canViewAllData, teamMembers]);

  const filteredDeals = useMemo(() => {
    if (canViewAllData) return deals;
    return deals.filter(d => d.assignedTo === currentUser.id || teamMembers.some(m => m.id === d.assignedTo));
  }, [deals, currentUser, canViewAllData, teamMembers]);

  const filteredPlacements = useMemo(() => {
    if (canViewAllData) return placements;
    return placements.filter(p => p.createdBy === currentUser.id || teamMembers.some(m => m.id === p.createdBy));
  }, [placements, currentUser, canViewAllData, teamMembers]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const activeClients = filteredClients.filter(c => c.status === 'active').length;
    const activeJobs = filteredJobs.filter(j => j.status === 'open' || j.status === 'in-progress').length;
    const pipelineValue = filteredDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost').reduce((sum, d) => sum + d.value, 0);
    const monthlyPlacements = filteredPlacements.length;
    const totalRevenue = filteredPlacements.reduce((sum, p) => sum + p.fee, 0);
    const openPositions = filteredJobs.reduce((sum, j) => sum + (j.quantity - j.filled), 0);
    const pendingTasks = filteredTasks.filter(t => t.status === 'pending').length;
    const upcomingInterviews = interviews.filter(i => i.status === 'scheduled').length;

    return {
      activeClients,
      activeJobs,
      pipelineValue,
      monthlyPlacements,
      totalRevenue,
      openPositions,
      pendingTasks,
      upcomingInterviews
    };
  }, [filteredClients, filteredJobs, filteredDeals, filteredPlacements, filteredTasks, interviews]);

  // Chart data
  const placementChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      placements: Math.floor(Math.random() * 10) + 5,
      revenue: Math.floor(Math.random() * 20) + 10
    }));
  }, []);

  const sourceChartData = useMemo(() => [
    { name: 'Walk-in', value: 35, color: '#3b82f6' },
    { name: 'Referral', value: 25, color: '#8b5cf6' },
    { name: 'Online', value: 20, color: '#10b981' },
    { name: 'Job Fair', value: 15, color: '#f59e0b' },
    { name: 'LinkedIn', value: 5, color: '#ef4444' }
  ], []);

  const teamPerformanceData = useMemo(() => {
    return teamMembers.map(m => ({
      name: m.name.split(' ')[0],
      placements: m.actuals.placements,
      target: m.targets.monthlyPlacements,
      revenue: m.actuals.revenue / 1000000
    }));
  }, [teamMembers]);

  // Activity handler
  const addActivity = (type: Activity['type'], title: string, description: string, relatedTo: string) => {
    const newActivity: Activity = {
      id: `a${Date.now()}`,
      type,
      title,
      description,
      relatedTo,
      createdAt: new Date().toISOString(),
      user: currentUser.name,
      userId: currentUser.id
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // ==================== RENDER FUNCTIONS ====================

  // Sidebar
  const renderSidebar = () => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'pipeline', label: 'Pipeline', icon: Kanban },
      { id: 'clients', label: 'Clients', icon: Building2 },
      { id: 'jobs', label: 'Jobs', icon: Briefcase },
      { id: 'candidates', label: 'Candidates', icon: UserCircle },
      { id: 'interviews', label: 'Interviews', icon: Calendar },
      { id: 'placements', label: 'Placements', icon: UserCheck },
      { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    ];

    const adminItems = [
      { id: 'team', label: 'Team', icon: Users, adminOnly: true },
      { id: 'reports', label: 'Reports', icon: BarChart3, adminOnly: true },
      { id: 'admin', label: 'Admin Panel', icon: Shield, mdOnly: true },
    ];

    const RoleIcon = getRoleIcon(currentUser.role);

    return (
      <div className={`flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-20 border-b border-slate-700/50">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent whitespace-nowrap">
                Talent Resources
              </h1>
              <p className="text-xs text-blue-300 font-medium whitespace-nowrap">Myanmar</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className={`px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
            Main Menu
          </p>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}

          {/* Admin Menu */}
          {(isManager || isMD) && (
            <>
              <Separator className="my-3 bg-slate-700/50" />
              <p className={`px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
                Management
              </p>
              {adminItems.filter(item => {
                if (item.mdOnly && !isMD) return false;
                if (item.adminOnly && !isManager) return false;
                return true;
              }).map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              ))}
            </>
          )}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-700/50 p-3 space-y-2">
          <button
            onClick={() => setShowSettingsDialog(true)}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>

        {/* User info */}
        <div className="border-t border-slate-700/50 p-3">
          <button
            onClick={() => setShowUserSwitchDialog(true)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
          >
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-white shadow-lg flex-shrink-0 ${
              currentUser.role === 'md' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
              currentUser.role === 'manager' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
              currentUser.role === 'senior_recruiter' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
              'bg-gradient-to-br from-orange-400 to-amber-500'
            }`}>
              {currentUser.avatar}
            </div>
            {sidebarOpen && (
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-400 truncate">{getRoleLabel(currentUser.role)}</p>
              </div>
            )}
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></div>
          </button>
        </div>
      </div>
    );
  };

  // Dashboard
  const renderDashboard = () => {
    const completionRate = currentUser.targets.monthlyPlacements > 0 
      ? Math.round((currentUser.actuals.placements / currentUser.targets.monthlyPlacements) * 100) 
      : 0;

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}! 👋</h2>
              <p className="text-blue-100">
                {isManager 
                  ? `Your team has ${metrics.pendingTasks} pending tasks and ${metrics.upcomingInterviews} interviews scheduled.`
                  : `You have ${metrics.pendingTasks} pending tasks and ${metrics.upcomingInterviews} interviews today.`
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowTaskDialog(true)} className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
              <Button onClick={() => setShowCandidateDialog(true)} className="bg-white text-blue-600 hover:bg-blue-50">
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700">+12%</Badge>
              </div>
              <p className="text-sm text-slate-500 mb-1">Active Clients</p>
              <p className="text-2xl font-bold text-slate-800">{metrics.activeClients}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700">+8%</Badge>
              </div>
              <p className="text-sm text-slate-500 mb-1">Active Jobs</p>
              <p className="text-2xl font-bold text-slate-800">{metrics.activeJobs}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700">+15%</Badge>
              </div>
              <p className="text-sm text-slate-500 mb-1">Pipeline Value</p>
              <p className="text-2xl font-bold text-slate-800">{formatMMK(metrics.pipelineValue)}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700">+25%</Badge>
              </div>
              <p className="text-sm text-slate-500 mb-1">Placements</p>
              <p className="text-2xl font-bold text-slate-800">{metrics.monthlyPlacements}</p>
            </CardContent>
          </Card>
        </div>

        {/* Personal/Team KPI Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal KPI */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                {isManager ? 'Team Target' : 'My Target'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Monthly Placements</span>
                  <span className="text-sm font-semibold">{currentUser.actuals.placements}/{currentUser.targets.monthlyPlacements}</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Quarterly Revenue</span>
                  <span className="text-sm font-semibold">{formatMMK(currentUser.actuals.revenue)}</span>
                </div>
                <Progress value={(currentUser.actuals.revenue / currentUser.targets.quarterlyRevenue) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Client Meetings</span>
                  <span className="text-sm font-semibold">{currentUser.actuals.meetings}/{currentUser.targets.clientMeetings}</span>
                </div>
                <Progress value={(currentUser.actuals.meetings / currentUser.targets.clientMeetings) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card className="border-0 shadow-lg lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={placementChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="placements" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance (for managers) */}
        {isManager && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={teamPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="placements" fill="#3b82f6" name="Placements" />
                  <Bar dataKey="target" fill="#e2e8f0" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activities.slice(0, 5).map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'placement' ? 'bg-green-100 text-green-600' :
                      activity.type === 'call' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'interview' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {activity.type === 'placement' ? <UserCheck className="h-4 w-4" /> :
                       activity.type === 'call' ? <Phone className="h-4 w-4" /> :
                       activity.type === 'interview' ? <Calendar className="h-4 w-4" /> :
                       <Mail className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                      <p className="text-xs text-slate-500 truncate">{activity.description}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{formatDateTime(activity.createdAt)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Upcoming Tasks</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('tasks')} className="text-blue-600">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredTasks.filter(t => t.status !== 'completed').slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      task.priority === 'high' ? 'bg-red-100 text-red-600' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {task.type === 'call' ? <Phone className="h-4 w-4" /> :
                       task.type === 'meeting' ? <Calendar className="h-4 w-4" /> :
                       <ClipboardList className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500">Due: {formatDate(task.dueDate)}</p>
                    </div>
                    <Badge variant={task.status === 'pending' ? 'destructive' : 'secondary'} className="text-xs">
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Pipeline
  const renderPipeline = () => {
    const stages: Deal['stage'][] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    const stageColors: Record<Deal['stage'], string> = {
      lead: 'from-slate-400 to-slate-500',
      qualified: 'from-blue-400 to-blue-500',
      proposal: 'from-purple-400 to-purple-500',
      negotiation: 'from-orange-400 to-orange-500',
      won: 'from-green-400 to-green-500',
      lost: 'from-red-400 to-red-500'
    };

    const handleDealStageChange = (dealId: string, newStage: Deal['stage']) => {
      setDeals(prev => prev.map(d => 
        d.id === dealId ? { ...d, stage: newStage, probability: newStage === 'won' ? 100 : newStage === 'lost' ? 0 : d.probability } : d
      ));
      const deal = deals.find(d => d.id === dealId);
      if (deal) {
        addActivity('note', `Deal moved to ${newStage}`, `${deal.title} moved to ${newStage} stage`, deal.clientName);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Sales Pipeline</h2>
            <p className="text-slate-500">Track and manage your deals</p>
          </div>
          <Button onClick={() => { setEditingDeal(null); setShowDealDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Deal
          </Button>
        </div>

        {/* Pipeline Summary */}
        <div className="grid grid-cols-6 gap-4">
          {stages.map(stage => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            return (
              <Card key={stage} className="border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stageColors[stage]} flex items-center justify-center text-white font-bold shadow-lg mx-auto mb-2`}>
                    {stageDeals.length}
                  </div>
                  <p className="text-sm font-semibold capitalize">{stage}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatMMK(stageValue)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-6 gap-4 overflow-x-auto">
          {stages.map(stage => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage);
            return (
              <div key={stage} className="space-y-3 min-w-[250px]">
                <div className={`p-3 rounded-t-xl bg-gradient-to-r ${stageColors[stage]} text-white`}>
                  <p className="font-semibold capitalize">{stage}</p>
                  <p className="text-xs opacity-80">{stageDeals.length} deals</p>
                </div>
                <div className="bg-slate-100 rounded-b-xl p-3 space-y-3 min-h-[200px]">
                  {stageDeals.map(deal => (
                    <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setEditingDeal(deal); setShowDealDialog(true); }}>
                      <CardContent className="p-4">
                        <p className="font-semibold text-sm mb-1">{deal.title}</p>
                        <p className="text-xs text-slate-500 mb-2">{deal.clientName}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-green-600">{formatMMK(deal.value)}</span>
                          <Badge variant="outline" className="text-xs">{deal.probability}%</Badge>
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

  // Clients
  const renderClients = () => {
    const handleSaveClient = (client: Partial<Client>) => {
      if (editingClient) {
        setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...client } : c));
        addActivity('note', 'Client Updated', `Updated client: ${client.companyName}`, client.companyName || '');
      } else {
        const newClient: Client = {
          id: `c${Date.now()}`,
          companyName: client.companyName || '',
          industry: client.industry || '',
          contactPerson: client.contactPerson || '',
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          city: client.city || 'Yangon',
          status: client.status || 'prospect',
          notes: client.notes || '',
          createdAt: new Date().toISOString(),
          assignedTo: currentUser.id,
          totalJobs: 0,
          totalPlacements: 0,
          totalRevenue: 0
        };
        setClients(prev => [...prev, newClient]);
        addActivity('note', 'Client Added', `New client: ${client.companyName}`, client.companyName || '');
      }
      setShowClientDialog(false);
      setEditingClient(null);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
            <p className="text-slate-500">Manage your client relationships</p>
          </div>
          <Button onClick={() => { setEditingClient(null); setShowClientDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Client
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <Card key={client.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => { setEditingClient(client); setShowClientDialog(true); }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {client.companyName.substring(0, 2).toUpperCase()}
                  </div>
                  <Badge className={client.status === 'active' ? 'bg-green-100 text-green-700' : client.status === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                    {client.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{client.companyName}</h3>
                <p className="text-sm text-slate-500 mb-3">{client.industry}</p>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {client.totalJobs} jobs</span>
                  <span className="flex items-center gap-1"><UserCheck className="h-4 w-4" /> {client.totalPlacements} placed</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Jobs
  const renderJobs = () => {
    const handleSaveJob = (job: Partial<Job>) => {
      if (editingJob) {
        setJobs(prev => prev.map(j => j.id === editingJob.id ? { ...j, ...job } : j));
      } else {
        const client = clients.find(c => c.id === job.clientId);
        const newJob: Job = {
          id: `j${Date.now()}`,
          title: job.title || '',
          clientId: job.clientId || '',
          clientName: client?.companyName || '',
          location: job.location || '',
          salaryMin: job.salaryMin || 0,
          salaryMax: job.salaryMax || 0,
          requirements: job.requirements || '',
          quantity: job.quantity || 1,
          filled: 0,
          priority: job.priority || 'medium',
          status: 'open',
          createdAt: new Date().toISOString(),
          deadline: job.deadline || '',
          assignedTo: currentUser.id,
          category: job.category || ''
        };
        setJobs(prev => [...prev, newJob]);
        addActivity('note', 'Job Created', `New job: ${job.title} at ${client?.companyName}`, client?.companyName || '');
      }
      setShowJobDialog(false);
      setEditingJob(null);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Job Orders</h2>
            <p className="text-slate-500">{filteredJobs.length} active positions</p>
          </div>
          <Button onClick={() => { setEditingJob(null); setShowJobDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Create Job
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJobs.map(job => (
            <Card key={job.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => { setEditingJob(job); setShowJobDialog(true); }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className={job.priority === 'high' ? 'bg-red-100 text-red-700' : job.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                      {job.priority} priority
                    </Badge>
                    <h3 className="font-bold text-slate-800 mt-2">{job.title}</h3>
                    <p className="text-sm text-slate-500">{job.clientName}</p>
                  </div>
                  <Badge className={job.status === 'filled' ? 'bg-green-100 text-green-700' : job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}>
                    {job.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Filled</span>
                    <span className="font-semibold">{job.filled}/{job.quantity}</span>
                  </div>
                  <Progress value={(job.filled / job.quantity) * 100} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Salary</span>
                    <span className="font-semibold">{formatMMK(job.salaryMin)} - {formatMMK(job.salaryMax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Deadline</span>
                    <span className="font-semibold">{formatDate(job.deadline)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Candidates
  const renderCandidates = () => {
    const handleSaveCandidate = (candidate: Partial<Candidate>) => {
      if (editingCandidate) {
        setCandidates(prev => prev.map(c => c.id === editingCandidate.id ? { ...c, ...candidate } : c));
      } else {
        const newCandidate: Candidate = {
          id: `can${Date.now()}`,
          name: candidate.name || '',
          email: candidate.email || '',
          phone: candidate.phone || '',
          location: candidate.location || '',
          skills: candidate.skills || [],
          experience: candidate.experience || 0,
          education: candidate.education || '',
          currentCompany: candidate.currentCompany || '',
          expectedSalary: candidate.expectedSalary || 0,
          status: 'available',
          appliedJobs: [],
          createdAt: new Date().toISOString(),
          assignedTo: currentUser.id,
          source: candidate.source || 'Walk-in',
          notes: candidate.notes || ''
        };
        setCandidates(prev => [...prev, newCandidate]);
        addActivity('note', 'Candidate Added', `New candidate: ${candidate.name}`, candidate.name || '');
      }
      setShowCandidateDialog(false);
      setEditingCandidate(null);
    };

    const statusColors: Record<Candidate['status'], string> = {
      available: 'bg-green-100 text-green-700',
      interviewing: 'bg-blue-100 text-blue-700',
      offered: 'bg-purple-100 text-purple-700',
      placed: 'bg-emerald-100 text-emerald-700',
      'not-interested': 'bg-slate-100 text-slate-700'
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Candidates</h2>
            <p className="text-slate-500">{filteredCandidates.length} candidates in database</p>
          </div>
          <Button onClick={() => { setEditingCandidate(null); setShowCandidateDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Candidate
          </Button>
        </div>

        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Candidate</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Experience</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Expected Salary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCandidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => { setEditingCandidate(candidate); setShowCandidateDialog(true); }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-800">{candidate.name}</p>
                        <p className="text-sm text-slate-500">{candidate.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{candidate.email}</p>
                    <p className="text-sm text-slate-500">{candidate.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{candidate.experience} years</p>
                    <p className="text-xs text-slate-500">{candidate.education}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-green-600">{formatMMK(candidate.expectedSalary)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[candidate.status]}>{candidate.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); /* schedule interview */ }}>
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); /* place */ }}>
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Interviews
  const renderInterviews = () => {
    const upcomingInterviews = interviews.filter(i => i.status === 'scheduled');
    const pastInterviews = interviews.filter(i => i.status !== 'scheduled');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Interviews</h2>
            <p className="text-slate-500">{upcomingInterviews.length} scheduled interviews</p>
          </div>
          <Button onClick={() => setShowInterviewDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> Schedule Interview
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Upcoming Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {upcomingInterviews.map(interview => (
                <div key={interview.id} className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-800">{interview.candidateName}</p>
                      <p className="text-sm text-slate-500">{interview.jobTitle}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">{interview.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {formatDateTime(interview.dateTime)}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {interview.clientName}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Completed Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {pastInterviews.map(interview => (
                <div key={interview.id} className="p-4 rounded-lg bg-slate-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-800">{interview.candidateName}</p>
                      <p className="text-sm text-slate-500">{interview.jobTitle}</p>
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

  // Placements
  const renderPlacements = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Placements</h2>
            <p className="text-slate-500">{filteredPlacements.length} successful placements</p>
          </div>
          <Button onClick={() => setShowPlacementDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Placement
          </Button>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <p className="text-sm opacity-80 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">{formatMMK(metrics.totalRevenue)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <p className="text-sm opacity-80 mb-1">This Month</p>
              <p className="text-3xl font-bold">{filteredPlacements.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <p className="text-sm opacity-80 mb-1">Avg Fee</p>
              <p className="text-3xl font-bold">{formatMMK(metrics.totalRevenue / (filteredPlacements.length || 1))}</p>
            </CardContent>
          </Card>
        </div>

        {/* Placements Table */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Candidate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Salary</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Fee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPlacements.map(placement => (
                  <tr key={placement.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{placement.candidateName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{placement.jobTitle}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{placement.clientName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">{formatMMK(placement.salary)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-green-600">{formatMMK(placement.fee)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={placement.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {placement.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Tasks
  const renderTasks = () => {
    const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      const task = tasks.find(t => t.id === taskId);
      if (task && newStatus === 'completed') {
        addActivity('task', 'Task Completed', task.title, task.relatedTo);
      }
    };

    const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
    const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
    const completedTasks = filteredTasks.filter(t => t.status === 'completed');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Task Manager</h2>
            <p className="text-slate-500">{pendingTasks.length} pending, {inProgressTasks.length} in progress</p>
          </div>
          <Button onClick={() => { setEditingTask(null); setShowTaskDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><AlertCircle className="h-5 w-5" /> Pending</span>
                <Badge className="bg-white/20 text-white">{pendingTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {pendingTasks.map(task => (
                <div key={task.id} className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-slate-800">{task.title}</p>
                    <Badge className={task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Due: {formatDate(task.dueDate)}</span>
                    <Button size="sm" onClick={() => handleTaskStatusChange(task.id, 'in_progress')}>
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Clock className="h-5 w-5" /> In Progress</span>
                <Badge className="bg-white/20 text-white">{inProgressTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {inProgressTasks.map(task => (
                <div key={task.id} className="p-4 rounded-lg bg-blue-50">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-slate-800">{task.title}</p>
                    <Badge className="bg-blue-100 text-blue-700">{task.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Due: {formatDate(task.dueDate)}</span>
                    <Button size="sm" variant="default" onClick={() => handleTaskStatusChange(task.id, 'completed')}>
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Completed</span>
                <Badge className="bg-white/20 text-white">{completedTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {completedTasks.map(task => (
                <div key={task.id} className="p-4 rounded-lg bg-green-50 opacity-75">
                  <p className="font-semibold text-slate-800 line-through">{task.title}</p>
                  <p className="text-sm text-slate-500">{task.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Team Management (for managers)
  const renderTeam = () => {
    if (!isManager) return null;

    const handleSaveUser = (user: Partial<User>) => {
      if (editingUser) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...user } : u));
      } else {
        const newUser: User = {
          id: `u${Date.now()}`,
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'recruiter',
          department: user.department || 'Recruitment',
          phone: user.phone || '',
          joinDate: new Date().toISOString(),
          avatar: user.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'XX',
          status: 'active',
          targets: { monthlyPlacements: 5, quarterlyRevenue: 15000000, clientMeetings: 6 },
          actuals: { placements: 0, revenue: 0, meetings: 0 },
          managerId: currentUser.id
        };
        setUsers(prev => [...prev, newUser]);
        addActivity('note', 'Team Member Added', `New ${user.role}: ${user.name}`, user.name || '');
      }
      setShowUserDialog(false);
      setEditingUser(null);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Team Management</h2>
            <p className="text-slate-500">{teamMembers.length} team members</p>
          </div>
          {canManageUsers && (
            <Button onClick={() => { setEditingUser(null); setShowUserDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Team Member
            </Button>
          )}
        </div>

        {/* Team Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(member => {
            const RoleIcon = getRoleIcon(member.role);
            const completionRate = member.targets.monthlyPlacements > 0 
              ? Math.round((member.actuals.placements / member.targets.monthlyPlacements) * 100) 
              : 0;
            return (
              <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => { setEditingUser(member); setShowUserDialog(true); }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold text-white shadow-lg ${
                        member.role === 'md' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                        member.role === 'manager' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                        member.role === 'senior_recruiter' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                        'bg-gradient-to-br from-orange-400 to-amber-500'
                      }`}>
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <Badge className={getRoleBadgeColor(member.role)}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {getRoleLabel(member.role)}
                        </Badge>
                      </div>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${member.status === 'active' ? 'bg-green-400' : 'bg-slate-300'}`}></div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Placements</span>
                        <span className="font-medium">{member.actuals.placements}/{member.targets.monthlyPlacements}</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Revenue</span>
                      <span className="font-bold text-green-600">{formatMMK(member.actuals.revenue)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
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

  // Reports
  const renderReports = () => {
    if (!isManager) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Reports & Analytics</h2>
            <p className="text-slate-500">Team performance insights</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" /> Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Total Placements</p>
              <p className="text-3xl font-bold text-slate-800">{teamMembers.reduce((sum, m) => sum + m.actuals.placements, 0)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">{formatMMK(teamMembers.reduce((sum, m) => sum + m.actuals.revenue, 0))}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Avg Fill Rate</p>
              <p className="text-3xl font-bold text-blue-600">78%</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Active Clients</p>
              <p className="text-3xl font-bold text-purple-600">{metrics.activeClients}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Placement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={placementChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="placements" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Candidate Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie data={sourceChartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                    {sourceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Team Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Team Member</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Placements</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Revenue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Target %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teamMembers.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={`${
                            member.role === 'md' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                            member.role === 'manager' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                            member.role === 'senior_recruiter' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                            'bg-gradient-to-br from-orange-400 to-amber-500'
                          } text-white`}>
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-800">{member.name}</p>
                          <p className="text-sm text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getRoleBadgeColor(member.role)}>{getRoleLabel(member.role)}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{member.actuals.placements}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-green-600">{formatMMK(member.actuals.revenue)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Progress value={(member.actuals.placements / member.targets.monthlyPlacements) * 100} className="h-2 w-20" />
                        <span className="text-sm font-medium">{Math.round((member.actuals.placements / member.targets.monthlyPlacements) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Admin Panel (MD only)
  const renderAdmin = () => {
    if (!isMD) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Admin Panel</h2>
            <p className="text-slate-500">System administration and settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => { setActiveTab('team'); }}>
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <UserCog className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">User Management</h3>
              <p className="text-sm text-slate-500">Manage team members and roles</p>
              <p className="text-2xl font-bold text-blue-600 mt-3">{users.length} Users</p>
            </CardContent>
          </Card>

          {/* Company Settings */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setShowSettingsDialog(true)}>
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Company Settings</h3>
              <p className="text-sm text-slate-500">Configure company details</p>
              <Button className="mt-3" variant="outline">Configure</Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Data Management</h3>
              <p className="text-sm text-slate-500">Export and manage data</p>
              <Button className="mt-3" variant="outline">
                <Download className="h-4 w-4 mr-2" /> Export All
              </Button>
            </CardContent>
          </Card>

          {/* Pipeline Settings */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Kanban className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Pipeline Settings</h3>
              <p className="text-sm text-slate-500">Configure pipeline stages</p>
              <p className="text-lg font-bold text-orange-600 mt-3">6 Stages Active</p>
            </CardContent>
          </Card>

          {/* Fee Structure */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Fee Structure</h3>
              <p className="text-sm text-slate-500">Default placement fees</p>
              <p className="text-lg font-bold text-cyan-600 mt-3">10% of Salary</p>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Activity Log</h3>
              <p className="text-sm text-slate-500">View all system activities</p>
              <p className="text-lg font-bold text-slate-600 mt-3">{activities.length} Activities</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent System Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-slate-500" />
              System Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    activity.type === 'placement' ? 'bg-green-100 text-green-600' :
                    activity.type === 'call' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'interview' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {activity.type === 'placement' ? <UserCheck className="h-5 w-5" /> :
                     activity.type === 'call' ? <Phone className="h-5 w-5" /> :
                     activity.type === 'interview' ? <Calendar className="h-5 w-5" /> :
                     <ClipboardList className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{activity.title}</p>
                    <p className="text-sm text-slate-500">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-600">{activity.user}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(activity.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // ==================== DIALOGS ====================

  // Settings Dialog
  const renderSettingsDialog = () => (
    <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Settings
          </DialogTitle>
          <DialogDescription>Manage your account and application settings</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="targets">Targets</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input defaultValue={currentUser.name} />
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue={currentUser.email} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input defaultValue={currentUser.phone} />
              </div>
              <div>
                <Label>Department</Label>
                <Input defaultValue={currentUser.department} disabled />
              </div>
            </div>
            <div>
              <Label>Role</Label>
              <Input value={getRoleLabel(currentUser.role)} disabled className="bg-slate-50" />
            </div>
          </TabsContent>
          <TabsContent value="targets" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Monthly Placement Target</Label>
                <Input type="number" defaultValue={currentUser.targets.monthlyPlacements} />
              </div>
              <div>
                <Label>Quarterly Revenue Target (MMK)</Label>
                <Input type="number" defaultValue={currentUser.targets.quarterlyRevenue} />
              </div>
              <div>
                <Label>Client Meetings Target</Label>
                <Input type="number" defaultValue={currentUser.targets.clientMeetings} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-500">Receive email updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Task Reminders</p>
                  <p className="text-sm text-slate-500">Get reminded about pending tasks</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Interview Alerts</p>
                  <p className="text-sm text-slate-500">Notifications for scheduled interviews</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>Cancel</Button>
          <Button onClick={() => { addActivity('note', 'Settings Updated', 'User settings saved', 'System'); setShowSettingsDialog(false); }}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // User Switch Dialog
  const renderUserSwitchDialog = () => (
    <Dialog open={showUserSwitchDialog} onOpenChange={setShowUserSwitchDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch User</DialogTitle>
          <DialogDescription>Select a user to view the platform as their role</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {users.map(user => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <button
                key={user.id}
                onClick={() => { setCurrentUser(user); setShowUserSwitchDialog(false); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  currentUser.id === user.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold text-white ${
                  user.role === 'md' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                  user.role === 'manager' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                  user.role === 'senior_recruiter' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                  'bg-gradient-to-br from-orange-400 to-amber-500'
                }`}>
                  {user.avatar}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <div className="flex items-center gap-2">
                    <RoleIcon className="h-3 w-3 text-slate-400" />
                    <p className="text-sm text-slate-500">{getRoleLabel(user.role)}</p>
                  </div>
                </div>
                {currentUser.id === user.id && <CheckCircle className="h-5 w-5 text-blue-500" />}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );

  // User Dialog
  const renderUserDialog = () => (
    <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingUser ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Full Name</Label>
            <Input placeholder="Enter full name" defaultValue={editingUser?.name} id="userName" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="email@trm.com" defaultValue={editingUser?.email} id="userEmail" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input placeholder="+95 9 XXX XXX XXX" defaultValue={editingUser?.phone} id="userPhone" />
          </div>
          <div>
            <Label>Role</Label>
            <Select defaultValue={editingUser?.role || 'recruiter'}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="senior_recruiter">Senior Recruiter</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                {isMD && <SelectItem value="md">Managing Director</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Department</Label>
            <Input defaultValue={editingUser?.department || 'Recruitment'} id="userDept" />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowUserDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            const name = (document.getElementById('userName') as HTMLInputElement)?.value;
            const email = (document.getElementById('userEmail') as HTMLInputElement)?.value;
            const phone = (document.getElementById('userPhone') as HTMLInputElement)?.value;
            const dept = (document.getElementById('userDept') as HTMLInputElement)?.value;
            const roleSelect = document.querySelector('[role="combobox"]')?.textContent?.toLowerCase().replace(' ', '_') as UserRole;
            handleSaveUser({ name, email, phone, department: dept, role: roleSelect || 'recruiter' });
          }}>
            {editingUser ? 'Update' : 'Add'} Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Client Dialog
  const renderClientDialog = () => (
    <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-2">
            <Label>Company Name</Label>
            <Input placeholder="Company name" defaultValue={editingClient?.companyName} id="clientName" />
          </div>
          <div>
            <Label>Industry</Label>
            <Select defaultValue={editingClient?.industry}>
              <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Hospitality & Tourism">Hospitality & Tourism</SelectItem>
                <SelectItem value="Banking & Finance">Banking & Finance</SelectItem>
                <SelectItem value="IT & Technology">IT & Technology</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select defaultValue={editingClient?.status || 'prospect'}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Contact Person</Label>
            <Input placeholder="Contact name" defaultValue={editingClient?.contactPerson} id="contactPerson" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input placeholder="+95 9 XXX XXX XXX" defaultValue={editingClient?.phone} id="clientPhone" />
          </div>
          <div className="col-span-2">
            <Label>Email</Label>
            <Input type="email" placeholder="email@company.com" defaultValue={editingClient?.email} id="clientEmail" />
          </div>
          <div className="col-span-2">
            <Label>Address</Label>
            <Input placeholder="Full address" defaultValue={editingClient?.address} id="clientAddress" />
          </div>
          <div>
            <Label>City</Label>
            <Select defaultValue={editingClient?.city || 'Yangon'}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yangon">Yangon</SelectItem>
                <SelectItem value="Mandalay">Mandalay</SelectItem>
                <SelectItem value="Naypyidaw">Naypyidaw</SelectItem>
                <SelectItem value="Bago">Bago</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes..." defaultValue={editingClient?.notes} id="clientNotes" />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowClientDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            const companyName = (document.getElementById('clientName') as HTMLInputElement)?.value;
            const contactPerson = (document.getElementById('contactPerson') as HTMLInputElement)?.value;
            const phone = (document.getElementById('clientPhone') as HTMLInputElement)?.value;
            const email = (document.getElementById('clientEmail') as HTMLInputElement)?.value;
            const address = (document.getElementById('clientAddress') as HTMLInputElement)?.value;
            const notes = (document.getElementById('clientNotes') as HTMLTextAreaElement)?.value;
            handleSaveClient({ companyName, contactPerson, phone, email, address, notes, status: 'prospect' });
          }}>
            {editingClient ? 'Update' : 'Add'} Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Job Dialog
  const renderJobDialog = () => (
    <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingJob ? 'Edit Job' : 'Create New Job Order'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-2">
            <Label>Job Title</Label>
            <Input placeholder="Position title" defaultValue={editingJob?.title} id="jobTitle" />
          </div>
          <div>
            <Label>Client</Label>
            <Select defaultValue={editingJob?.clientId}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Category</Label>
            <Select defaultValue={editingJob?.category}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Factory Worker">Factory Worker</SelectItem>
                <SelectItem value="Construction Worker">Construction Worker</SelectItem>
                <SelectItem value="Hospitality">Hospitality</SelectItem>
                <SelectItem value="Banking">Banking</SelectItem>
                <SelectItem value="Engineer">Engineer</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Location</Label>
            <Input placeholder="Job location" defaultValue={editingJob?.location} id="jobLocation" />
          </div>
          <div>
            <Label>Salary Min (MMK)</Label>
            <Input type="number" placeholder="300000" defaultValue={editingJob?.salaryMin} id="salaryMin" />
          </div>
          <div>
            <Label>Salary Max (MMK)</Label>
            <Input type="number" placeholder="500000" defaultValue={editingJob?.salaryMax} id="salaryMax" />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input type="number" placeholder="1" defaultValue={editingJob?.quantity || 1} id="jobQty" />
          </div>
          <div>
            <Label>Priority</Label>
            <Select defaultValue={editingJob?.priority || 'medium'}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Deadline</Label>
            <Input type="date" defaultValue={editingJob?.deadline} id="jobDeadline" />
          </div>
          <div className="col-span-2">
            <Label>Requirements</Label>
            <Textarea placeholder="Job requirements..." defaultValue={editingJob?.requirements} id="jobReqs" />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowJobDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            const title = (document.getElementById('jobTitle') as HTMLInputElement)?.value;
            const location = (document.getElementById('jobLocation') as HTMLInputElement)?.value;
            const salaryMin = parseInt((document.getElementById('salaryMin') as HTMLInputElement)?.value) || 0;
            const salaryMax = parseInt((document.getElementById('salaryMax') as HTMLInputElement)?.value) || 0;
            const quantity = parseInt((document.getElementById('jobQty') as HTMLInputElement)?.value) || 1;
            const deadline = (document.getElementById('jobDeadline') as HTMLInputElement)?.value;
            const requirements = (document.getElementById('jobReqs') as HTMLTextAreaElement)?.value;
            handleSaveJob({ title, location, salaryMin, salaryMax, quantity, deadline, requirements });
          }}>
            {editingJob ? 'Update' : 'Create'} Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Candidate Dialog
  const renderCandidateDialog = () => (
    <Dialog open={showCandidateDialog} onOpenChange={setShowCandidateDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label>Full Name</Label>
            <Input placeholder="Candidate name" defaultValue={editingCandidate?.name} id="candName" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input placeholder="+95 9 XXX XXX XXX" defaultValue={editingCandidate?.phone} id="candPhone" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="email@example.com" defaultValue={editingCandidate?.email} id="candEmail" />
          </div>
          <div>
            <Label>Location</Label>
            <Input placeholder="City, Township" defaultValue={editingCandidate?.location} id="candLocation" />
          </div>
          <div>
            <Label>Experience (Years)</Label>
            <Input type="number" placeholder="5" defaultValue={editingCandidate?.experience} id="candExp" />
          </div>
          <div>
            <Label>Expected Salary (MMK)</Label>
            <Input type="number" placeholder="500000" defaultValue={editingCandidate?.expectedSalary} id="candSalary" />
          </div>
          <div>
            <Label>Education</Label>
            <Input placeholder="Highest education" defaultValue={editingCandidate?.education} id="candEdu" />
          </div>
          <div>
            <Label>Current Company</Label>
            <Input placeholder="Current employer" defaultValue={editingCandidate?.currentCompany} id="candCompany" />
          </div>
          <div>
            <Label>Source</Label>
            <Select defaultValue={editingCandidate?.source || 'Walk-in'}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Walk-in">Walk-in</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Online Portal">Online Portal</SelectItem>
                <SelectItem value="Job Fair">Job Fair</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Skills (comma separated)</Label>
            <Input placeholder="e.g. Customer Service, MS Office, English" defaultValue={editingCandidate?.skills?.join(', ')} id="candSkills" />
          </div>
          <div className="col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes..." defaultValue={editingCandidate?.notes} id="candNotes" />
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
            handleSaveCandidate({ name, phone, email, location, experience, expectedSalary, education, currentCompany, skills, notes });
          }}>
            {editingCandidate ? 'Update' : 'Add'} Candidate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Task Dialog
  const renderTaskDialog = () => (
    <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Title</Label>
            <Input placeholder="Task title" defaultValue={editingTask?.title} id="taskTitle" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea placeholder="Task details..." defaultValue={editingTask?.description} id="taskDesc" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select defaultValue={editingTask?.type || 'call'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select defaultValue={editingTask?.priority || 'medium'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
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
              <Input type="date" defaultValue={editingTask?.dueDate} id="taskDue" />
            </div>
            <div>
              <Label>Due Time</Label>
              <Input type="time" defaultValue={editingTask?.dueTime} id="taskTime" />
            </div>
          </div>
          <div>
            <Label>Related To</Label>
            <Input placeholder="Client, candidate, or job name" defaultValue={editingTask?.relatedTo} id="taskRelated" />
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
            } else {
              const newTask: Task = {
                id: `t${Date.now()}`,
                title: title || '',
                description: description || '',
                type: 'other',
                priority: 'medium',
                status: 'pending',
                dueDate: dueDate || new Date().toISOString().split('T')[0],
                dueTime: dueTime || '09:00',
                relatedTo: relatedTo || '',
                relatedType: 'general',
                assignedTo: currentUser.id,
                createdBy: currentUser.id,
                createdAt: new Date().toISOString()
              };
              setTasks(prev => [...prev, newTask]);
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

  // Deal Dialog
  const renderDealDialog = () => (
    <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Deal Title</Label>
            <Input placeholder="Deal name" defaultValue={editingDeal?.title} id="dealTitle" />
          </div>
          <div>
            <Label>Client</Label>
            <Select defaultValue={editingDeal?.clientId}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Value (MMK)</Label>
              <Input type="number" placeholder="10000000" defaultValue={editingDeal?.value} id="dealValue" />
            </div>
            <div>
              <Label>Probability (%)</Label>
              <Input type="number" placeholder="50" defaultValue={editingDeal?.probability} id="dealProb" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Stage</Label>
              <Select defaultValue={editingDeal?.stage || 'lead'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expected Close Date</Label>
              <Input type="date" defaultValue={editingDeal?.expectedCloseDate} id="dealClose" />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea placeholder="Deal notes..." defaultValue={editingDeal?.notes} id="dealNotes" />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setShowDealDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            const title = (document.getElementById('dealTitle') as HTMLInputElement)?.value;
            const value = parseInt((document.getElementById('dealValue') as HTMLInputElement)?.value) || 0;
            const probability = parseInt((document.getElementById('dealProb') as HTMLInputElement)?.value) || 50;
            const expectedCloseDate = (document.getElementById('dealClose') as HTMLInputElement)?.value;
            const notes = (document.getElementById('dealNotes') as HTMLTextAreaElement)?.value;
            if (editingDeal) {
              setDeals(prev => prev.map(d => d.id === editingDeal.id ? { ...d, title, value, probability, expectedCloseDate, notes } : d));
            } else {
              const newDeal: Deal = {
                id: `d${Date.now()}`,
                title: title || '',
                clientId: '',
                clientName: '',
                value,
                stage: 'lead',
                expectedCloseDate: expectedCloseDate || new Date().toISOString().split('T')[0],
                probability,
                notes: notes || '',
                createdAt: new Date().toISOString(),
                assignedTo: currentUser.id
              };
              setDeals(prev => [...prev, newDeal]);
            }
            setShowDealDialog(false);
            setEditingDeal(null);
          }}>
            {editingDeal ? 'Update' : 'Add'} Deal
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {renderSidebar()}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MoreVertical className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h1>
              <p className="text-xs text-slate-500">{getRoleLabel(currentUser.role)} View</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search..." className="w-64 pl-9 h-9 bg-slate-100 border-0 focus:bg-white" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowUserSwitchDialog(true)}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`${
                  currentUser.role === 'md' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                  currentUser.role === 'manager' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                  currentUser.role === 'senior_recruiter' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                  'bg-gradient-to-br from-orange-400 to-amber-500'
                } text-white text-xs`}>
                  {currentUser.avatar}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Dialogs */}
      {renderSettingsDialog()}
      {renderUserSwitchDialog()}
      {renderUserDialog()}
      {renderClientDialog()}
      {renderJobDialog()}
      {renderCandidateDialog()}
      {renderTaskDialog()}
      {renderDealDialog()}
    </div>
  );
}
