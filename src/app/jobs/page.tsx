'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { JobCard } from '@/components/jobs/JobCard';
import { JobForm } from '@/components/jobs/JobForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockJobs, mockClients } from '@/lib/data';
import { JobOrder } from '@/lib/types';
import { Plus, Search, Filter, Briefcase } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOrder[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [jobs, searchQuery, statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    const open = jobs.filter(j => j.status === 'open').length;
    const inProgress = jobs.filter(j => j.status === 'in-progress').length;
    const filled = jobs.filter(j => j.status === 'filled').length;
    const totalPositions = jobs.reduce((sum, j) => sum + j.quantity, 0);
    const totalFilled = jobs.reduce((sum, j) => sum + j.filled, 0);
    return { open, inProgress, filled, totalPositions, totalFilled };
  }, [jobs]);

  const handleAddJob = (jobData: Partial<JobOrder>) => {
    const newJob: JobOrder = {
      id: `j${Date.now()}`,
      title: jobData.title || '',
      clientId: jobData.clientId || '',
      clientName: jobData.clientName || '',
      location: jobData.location || '',
      salaryMin: jobData.salaryMin || 0,
      salaryMax: jobData.salaryMax || 0,
      requirements: jobData.requirements || '',
      quantity: jobData.quantity || 1,
      filled: 0,
      priority: jobData.priority || 'medium',
      status: jobData.status || 'open',
      createdAt: new Date().toISOString().split('T')[0],
      deadline: jobData.deadline || '',
    };
    setJobs([newJob, ...jobs]);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Job Orders" subtitle={`${jobs.length} total job orders`} />
        
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
                <p className="text-sm text-slate-500">Open</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                <p className="text-sm text-slate-500">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.filled}</p>
                <p className="text-sm text-slate-500">Filled</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-slate-700">{stats.totalPositions}</p>
                <p className="text-sm text-slate-500">Total Positions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.totalFilled}</p>
                <p className="text-sm text-slate-500">Total Filled</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search jobs by title, client, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="filled">Filled</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-sm text-slate-500">
            Showing {filteredJobs.length} of {jobs.length} job orders
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <Card className="mt-8">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">No job orders found</p>
                <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <JobForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleAddJob}
      />
    </div>
  );
}
