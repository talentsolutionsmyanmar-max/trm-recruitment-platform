// Mock Data for Myanmar Agency Recruitment App

import { Client, JobOrder, Candidate, Deal, Activity, EmailTemplate } from './types';

export const mockClients: Client[] = [
  {
    id: 'c1',
    companyName: 'Myanmar Golden Star Beverage Co., Ltd.',
    industry: 'Food & Beverage',
    contactPerson: 'U Thant Zin',
    email: 'thantzin@mgsbeverage.mm',
    phone: '+95 9 123 456 789',
    address: 'No. 123, Industrial Zone 1, Hlaing Tharyar',
    city: 'Yangon',
    status: 'active',
    notes: 'Major beverage company. Requires regular factory workers and sales staff.',
    createdAt: '2024-01-15',
    totalJobs: 12,
    totalPlacements: 45
  },
  {
    id: 'c2',
    companyName: 'Shwe Taung Development Group',
    industry: 'Construction',
    contactPerson: 'Daw Mya Mya',
    email: 'myamya@shwetaunggroup.mm',
    phone: '+95 9 234 567 890',
    address: 'No. 456, Kabar Aye Pagoda Road, Bahan',
    city: 'Yangon',
    status: 'active',
    notes: 'Large construction company with multiple ongoing projects.',
    createdAt: '2024-02-20',
    totalJobs: 8,
    totalPlacements: 32
  },
  {
    id: 'c3',
    companyName: 'Parami Energy Services',
    industry: 'Energy & Mining',
    contactPerson: 'U Kyaw Soe',
    email: 'kyawsoe@paramienergy.mm',
    phone: '+95 9 345 678 901',
    address: 'No. 789, Pyay Road, Kamayut',
    city: 'Yangon',
    status: 'active',
    notes: 'Energy sector company. Requires engineers and technical staff.',
    createdAt: '2024-03-10',
    totalJobs: 5,
    totalPlacements: 18
  },
  {
    id: 'c4',
    companyName: 'Mandalay Garment Factory',
    industry: 'Textile & Garment',
    contactPerson: 'Daw Khin Khin',
    email: 'khinkhin@mandalaygarment.mm',
    phone: '+95 9 456 789 012',
    address: 'Industrial Zone, Chan Mya Thar Zi',
    city: 'Mandalay',
    status: 'active',
    notes: 'Large garment factory. High volume worker requirements.',
    createdAt: '2024-01-25',
    totalJobs: 15,
    totalPlacements: 120
  },
  {
    id: 'c5',
    companyName: 'Grand Myanmar Hotel Group',
    industry: 'Hospitality & Tourism',
    contactPerson: 'U Myo Aung',
    email: 'myoaung@grandmyanmarhotel.mm',
    phone: '+95 9 567 890 123',
    address: 'No. 321, Strand Road, Kyauktada',
    city: 'Yangon',
    status: 'active',
    notes: 'Hotel chain with properties in Yangon, Bagan, and Inle.',
    createdAt: '2024-02-05',
    totalJobs: 10,
    totalPlacements: 28
  },
  {
    id: 'c6',
    companyName: 'Myanmar Mart Retail Chain',
    industry: 'Retail',
    contactPerson: 'Daw Su Su',
    email: 'susu@myanmarmart.mm',
    phone: '+95 9 678 901 234',
    address: 'No. 555, Sanchaung Road, Sanchaung',
    city: 'Yangon',
    status: 'prospect',
    notes: 'Expanding retail chain. Potential for large staffing needs.',
    createdAt: '2024-04-01',
    totalJobs: 3,
    totalPlacements: 0
  },
  {
    id: 'c7',
    companyName: 'KBZ Bank Limited',
    industry: 'Banking & Finance',
    contactPerson: 'U Aung Ko',
    email: 'aungko@kbzbank.mm',
    phone: '+95 9 789 012 345',
    address: 'No. 888, Merchant Street, Kyauktada',
    city: 'Yangon',
    status: 'active',
    notes: 'Major bank. Requires tellers, customer service, and IT staff.',
    createdAt: '2023-12-01',
    totalJobs: 20,
    totalPlacements: 65
  },
  {
    id: 'c8',
    companyName: 'Naypyidaw Hospital Group',
    industry: 'Healthcare',
    contactPerson: 'Dr. Aye Aye',
    email: 'ayeaye@naypyidawhospital.mm',
    phone: '+95 9 890 123 456',
    address: 'Hospital Road, Zabuthiri',
    city: 'Naypyidaw',
    status: 'inactive',
    notes: 'Hospital group. Currently not actively hiring.',
    createdAt: '2023-11-15',
    totalJobs: 4,
    totalPlacements: 12
  }
];

export const mockJobs: JobOrder[] = [
  {
    id: 'j1',
    title: 'Production Line Worker',
    clientId: 'c1',
    clientName: 'Myanmar Golden Star Beverage Co., Ltd.',
    location: 'Yangon - Hlaing Tharyar',
    salaryMin: 250000,
    salaryMax: 350000,
    requirements: 'No experience required. Physical fitness needed. 12-hour shift rotation.',
    quantity: 20,
    filled: 15,
    priority: 'high',
    status: 'in-progress',
    createdAt: '2024-12-01',
    deadline: '2025-01-15'
  },
  {
    id: 'j2',
    title: 'Construction Worker',
    clientId: 'c2',
    clientName: 'Shwe Taung Development Group',
    location: 'Yangon - Thanlyin',
    salaryMin: 300000,
    salaryMax: 400000,
    requirements: 'Experience in construction preferred. Must have safety awareness.',
    quantity: 50,
    filled: 32,
    priority: 'high',
    status: 'in-progress',
    createdAt: '2024-12-05',
    deadline: '2025-02-01'
  },
  {
    id: 'j3',
    title: 'Hotel Receptionist',
    clientId: 'c5',
    clientName: 'Grand Myanmar Hotel Group',
    location: 'Yangon',
    salaryMin: 350000,
    salaryMax: 450000,
    requirements: 'English proficiency required. Customer service experience preferred.',
    quantity: 5,
    filled: 5,
    priority: 'medium',
    status: 'filled',
    createdAt: '2024-11-15',
    deadline: '2024-12-20'
  },
  {
    id: 'j4',
    title: 'Garment Factory Worker',
    clientId: 'c4',
    clientName: 'Mandalay Garment Factory',
    location: 'Mandalay',
    salaryMin: 200000,
    salaryMax: 280000,
    requirements: 'No experience required. Training provided. Female preferred for this line.',
    quantity: 100,
    filled: 75,
    priority: 'high',
    status: 'in-progress',
    createdAt: '2024-12-10',
    deadline: '2025-01-30'
  },
  {
    id: 'j5',
    title: 'Electrical Engineer',
    clientId: 'c3',
    clientName: 'Parami Energy Services',
    location: 'Yangon',
    salaryMin: 800000,
    salaryMax: 1200000,
    requirements: 'B.E. in Electrical Engineering. 3+ years experience. Field work required.',
    quantity: 3,
    filled: 1,
    priority: 'medium',
    status: 'in-progress',
    createdAt: '2024-12-08',
    deadline: '2025-02-15'
  },
  {
    id: 'j6',
    title: 'Bank Teller',
    clientId: 'c7',
    clientName: 'KBZ Bank Limited',
    location: 'Yangon - Multiple Branches',
    salaryMin: 400000,
    salaryMax: 550000,
    requirements: 'University graduate. Basic English. Cash handling experience preferred.',
    quantity: 10,
    filled: 6,
    priority: 'medium',
    status: 'in-progress',
    createdAt: '2024-12-12',
    deadline: '2025-01-30'
  },
  {
    id: 'j7',
    title: 'Sales Executive',
    clientId: 'c1',
    clientName: 'Myanmar Golden Star Beverage Co., Ltd.',
    location: 'Yangon',
    salaryMin: 400000,
    salaryMax: 600000,
    requirements: 'Sales experience in FMCG. Own motorcycle. Good communication skills.',
    quantity: 8,
    filled: 0,
    priority: 'high',
    status: 'open',
    createdAt: '2024-12-15',
    deadline: '2025-01-20'
  },
  {
    id: 'j8',
    title: 'Security Guard',
    clientId: 'c5',
    clientName: 'Grand Myanmar Hotel Group',
    location: 'Bagan',
    salaryMin: 280000,
    salaryMax: 350000,
    requirements: 'Physical fitness. No criminal record. Shift work required.',
    quantity: 10,
    filled: 10,
    priority: 'low',
    status: 'filled',
    createdAt: '2024-11-01',
    deadline: '2024-12-01'
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: 'can1',
    name: 'Mg Aung',
    email: 'mgaung@gmail.com',
    phone: '+95 9 111 222 333',
    location: 'Yangon - Hlaing Tharyar',
    skills: ['Factory Work', 'Machine Operation', 'Quality Control'],
    experience: 5,
    education: 'High School Graduate',
    currentCompany: 'Unemployed',
    expectedSalary: 300000,
    status: 'available',
    appliedJobs: ['j1'],
    createdAt: '2024-12-01'
  },
  {
    id: 'can2',
    name: 'Ma Hla Hla',
    email: 'hlahla@gmail.com',
    phone: '+95 9 222 333 444',
    location: 'Mandalay',
    skills: ['Sewing', 'Garment Production', 'Quality Inspection'],
    experience: 3,
    education: 'Middle School',
    currentCompany: 'ABC Garment',
    expectedSalary: 250000,
    status: 'available',
    appliedJobs: ['j4'],
    createdAt: '2024-12-05'
  },
  {
    id: 'can3',
    name: 'U Thein Tun',
    email: 'theintun@gmail.com',
    phone: '+95 9 333 444 555',
    location: 'Yangon - South Dagon',
    skills: ['Construction', 'Masonry', 'Concrete Work'],
    experience: 10,
    education: 'Primary School',
    currentCompany: 'Freelance',
    expectedSalary: 400000,
    status: 'available',
    appliedJobs: ['j2'],
    createdAt: '2024-12-08'
  },
  {
    id: 'can4',
    name: 'Daw Mya Mya',
    email: 'myamya2@gmail.com',
    phone: '+95 9 444 555 666',
    location: 'Yangon - Kamayut',
    skills: ['Customer Service', 'English Communication', 'MS Office'],
    experience: 4,
    education: 'University Graduate - BA English',
    currentCompany: 'XYZ Trading',
    expectedSalary: 500000,
    status: 'available',
    appliedJobs: ['j3', 'j6'],
    createdAt: '2024-12-10'
  },
  {
    id: 'can5',
    name: 'Mg Zaw Zaw',
    email: 'zawzaw@gmail.com',
    phone: '+95 9 555 666 777',
    location: 'Yangon - Insein',
    skills: ['Electrical Installation', 'Troubleshooting', 'AutoCAD'],
    experience: 7,
    education: 'B.E. Electrical Engineering',
    currentCompany: 'Power Solutions Co.',
    expectedSalary: 1000000,
    status: 'available',
    appliedJobs: ['j5'],
    createdAt: '2024-12-12'
  },
  {
    id: 'can6',
    name: 'Ma Su Su',
    email: 'susu2@gmail.com',
    phone: '+95 9 666 777 888',
    location: 'Yangon - Tamwe',
    skills: ['Banking Operations', 'Customer Service', 'Cash Handling'],
    experience: 2,
    education: 'University Graduate - B.Com',
    currentCompany: 'CB Bank',
    expectedSalary: 450000,
    status: 'available',
    appliedJobs: ['j6'],
    createdAt: '2024-12-14'
  },
  {
    id: 'can7',
    name: 'U Soe Win',
    email: 'soewin@gmail.com',
    phone: '+95 9 777 888 999',
    location: 'Yangon - Mingalar Taung Nyunt',
    skills: ['Sales', 'FMCG Sales', 'Route Management'],
    experience: 6,
    education: 'High School Graduate',
    currentCompany: 'Unilever Myanmar',
    expectedSalary: 500000,
    status: 'available',
    appliedJobs: ['j7'],
    createdAt: '2024-12-15'
  },
  {
    id: 'can8',
    name: 'Ma Khin Khin',
    email: 'khinkhin2@gmail.com',
    phone: '+95 9 888 999 000',
    location: 'Mandalay - Chan Mya Thar Zi',
    skills: ['Garment Production', 'Supervision', 'Quality Control'],
    experience: 8,
    education: 'High School Graduate',
    currentCompany: 'Great Wall Garment',
    expectedSalary: 350000,
    status: 'placed',
    appliedJobs: [],
    createdAt: '2024-11-20'
  }
];

export const mockDeals: Deal[] = [
  {
    id: 'd1',
    title: 'MGS Beverage Annual Staffing Contract',
    clientId: 'c1',
    clientName: 'Myanmar Golden Star Beverage Co., Ltd.',
    value: 15000000,
    stage: 'negotiation',
    expectedCloseDate: '2025-01-30',
    probability: 75,
    notes: 'Annual contract for factory workers and sales staff placement.',
    createdAt: '2024-11-15'
  },
  {
    id: 'd2',
    title: 'Shwe Taung Construction Project Staffing',
    clientId: 'c2',
    clientName: 'Shwe Taung Development Group',
    value: 25000000,
    stage: 'proposal',
    expectedCloseDate: '2025-02-15',
    probability: 50,
    notes: 'Large construction project requiring 200+ workers.',
    createdAt: '2024-12-01'
  },
  {
    id: 'd3',
    title: 'Mandalay Garment Factory Expansion',
    clientId: 'c4',
    clientName: 'Mandalay Garment Factory',
    value: 8000000,
    stage: 'won',
    expectedCloseDate: '2024-12-15',
    probability: 100,
    notes: 'Won - 100 garment workers placement.',
    createdAt: '2024-11-01'
  },
  {
    id: 'd4',
    title: 'Grand Myanmar Hotel Staffing',
    clientId: 'c5',
    clientName: 'Grand Myanmar Hotel Group',
    value: 5000000,
    stage: 'won',
    expectedCloseDate: '2024-12-20',
    probability: 100,
    notes: 'Won - Hotel staff for new Bagan property.',
    createdAt: '2024-11-10'
  },
  {
    id: 'd5',
    title: 'KBZ Bank Teller Recruitment',
    clientId: 'c7',
    clientName: 'KBZ Bank Limited',
    value: 12000000,
    stage: 'qualified',
    expectedCloseDate: '2025-02-28',
    probability: 40,
    notes: 'Ongoing requirement for tellers and customer service.',
    createdAt: '2024-12-05'
  },
  {
    id: 'd6',
    title: 'Myanmar Mart Retail Staff',
    clientId: 'c6',
    clientName: 'Myanmar Mart Retail Chain',
    value: 30000000,
    stage: 'lead',
    expectedCloseDate: '2025-03-31',
    probability: 20,
    notes: 'Potential large contract for retail chain expansion.',
    createdAt: '2024-12-10'
  },
  {
    id: 'd7',
    title: 'Parami Energy Technical Staffing',
    clientId: 'c3',
    clientName: 'Parami Energy Services',
    value: 18000000,
    stage: 'proposal',
    expectedCloseDate: '2025-02-28',
    probability: 60,
    notes: 'Technical and engineering positions for energy projects.',
    createdAt: '2024-11-25'
  },
  {
    id: 'd8',
    title: 'Hospital Healthcare Staff',
    clientId: 'c8',
    clientName: 'Naypyidaw Hospital Group',
    value: 6000000,
    stage: 'lost',
    expectedCloseDate: '2024-12-01',
    probability: 0,
    notes: 'Lost - Client decided to handle recruitment internally.',
    createdAt: '2024-10-15'
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    type: 'placement',
    title: 'Placement Completed',
    description: 'Mg Aung placed at MGS Beverage as Production Line Worker',
    relatedTo: 'MGS Beverage',
    createdAt: '2024-12-15T10:30:00',
    user: 'Daw Mya'
  },
  {
    id: 'a2',
    type: 'call',
    title: 'Client Call',
    description: 'Discussed staffing requirements for Q1 2025',
    relatedTo: 'Shwe Taung Development',
    createdAt: '2024-12-15T09:00:00',
    user: 'U Thant'
  },
  {
    id: 'a3',
    type: 'email',
    title: 'Proposal Sent',
    description: 'Sent annual staffing contract proposal',
    relatedTo: 'Parami Energy Services',
    createdAt: '2024-12-14T16:45:00',
    user: 'Daw Mya'
  },
  {
    id: 'a4',
    type: 'meeting',
    title: 'Client Meeting',
    description: 'Met with HR Director to discuss teller recruitment',
    relatedTo: 'KBZ Bank Limited',
    createdAt: '2024-12-14T14:00:00',
    user: 'U Thant'
  },
  {
    id: 'a5',
    type: 'placement',
    title: 'Placement Completed',
    description: 'Ma Hla Hla placed at Mandalay Garment Factory',
    relatedTo: 'Mandalay Garment Factory',
    createdAt: '2024-12-14T11:00:00',
    user: 'Daw Mya'
  },
  {
    id: 'a6',
    type: 'note',
    title: 'Candidate Note',
    description: 'Updated candidate profile with new skills certification',
    relatedTo: 'Mg Zaw Zaw',
    createdAt: '2024-12-13T15:30:00',
    user: 'Daw Mya'
  },
  {
    id: 'a7',
    type: 'call',
    title: 'Follow-up Call',
    description: 'Followed up on proposal for retail staffing contract',
    relatedTo: 'Myanmar Mart Retail',
    createdAt: '2024-12-13T10:00:00',
    user: 'U Thant'
  },
  {
    id: 'a8',
    type: 'email',
    title: 'Interview Confirmation',
    description: 'Confirmed interview schedule for Electrical Engineer position',
    relatedTo: 'Parami Energy Services',
    createdAt: '2024-12-12T17:00:00',
    user: 'Daw Mya'
  }
];

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 't1',
    name: 'Initial Outreach',
    subject: 'Staffing Solutions for {{company_name}}',
    body: 'Dear {{contact_name}},\n\nI hope this email finds you well. I am reaching out from [Agency Name] to discuss how we can support your staffing needs.\n\nWe specialize in providing quality candidates for {{industry}} sector and have successfully placed over 500 candidates this year.\n\nWould you be available for a brief call this week to discuss your requirements?\n\nBest regards,\n{{sender_name}}',
    category: 'outreach'
  },
  {
    id: 't2',
    name: 'Interview Confirmation',
    subject: 'Interview Confirmation - {{position}}',
    body: 'Dear {{candidate_name}},\n\nThis is to confirm your interview scheduled for:\n\nDate: {{interview_date}}\nTime: {{interview_time}}\nLocation: {{interview_location}}\n\nPlease bring the following documents:\n- Updated CV\n- NRC Card\n- Education Certificates\n\nPlease confirm your attendance.\n\nBest regards,\n{{sender_name}}',
    category: 'confirmation'
  },
  {
    id: 't3',
    name: 'Follow-up After Interview',
    subject: 'Thank you for interviewing with {{company_name}}',
    body: 'Dear {{candidate_name}},\n\nThank you for taking the time to interview for the {{position}} position with {{company_name}}.\n\nWe will be in touch within 3-5 business days with an update on your application status.\n\nIf you have any questions in the meantime, please do not hesitate to contact us.\n\nBest regards,\n{{sender_name}}',
    category: 'follow-up'
  },
  {
    id: 't4',
    name: 'Proposal Submission',
    subject: 'Staffing Proposal - {{company_name}}',
    body: 'Dear {{contact_name}},\n\nPlease find attached our staffing proposal for {{company_name}}.\n\nOur proposed terms include:\n- Placement Fee: {{fee_percentage}}% of annual salary\n- Replacement Guarantee: {{guarantee_period}} days\n- Payment Terms: {{payment_terms}}\n\nWe are confident in our ability to provide excellent candidates for your organization.\n\nPlease let us know if you have any questions.\n\nBest regards,\n{{sender_name}}',
    category: 'proposal'
  }
];

// Format currency to Myanmar Kyat
export function formatMMK(amount: number): string {
  return new Intl.NumberFormat('en-MM', {
    style: 'currency',
    currency: 'MMK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('MMK', 'K');
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Dashboard metrics
export function getDashboardMetrics() {
  const activeJobs = mockJobs.filter(j => j.status === 'open' || j.status === 'in-progress').length;
  const pipelineValue = mockDeals
    .filter(d => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, d) => sum + d.value, 0);
  const placementsThisMonth = mockJobs.reduce((sum, j) => sum + j.filled, 0);
  
  return {
    totalClients: mockClients.filter(c => c.status === 'active').length,
    activeJobs,
    pipelineValue,
    placementsThisMonth,
    clientsChange: 12,
    jobsChange: 8,
    pipelineChange: 15,
    placementsChange: 25
  };
}
