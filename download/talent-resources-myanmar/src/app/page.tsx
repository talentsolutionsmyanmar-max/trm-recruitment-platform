'use client';

import { useMemo } from 'react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockJobs, mockDeals, mockActivities, getDashboardMetrics, formatMMK } from '@/lib/data';
import { Users, Briefcase, TrendingUp, UserCheck, Plus, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const metrics = useMemo(() => getDashboardMetrics(), []);
  const activeJobs = mockJobs.filter(j => j.status === 'open' || j.status === 'in-progress').slice(0, 5);
  const activeDeals = mockDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost').slice(0, 5);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" subtitle="Welcome back, Daw Mya! 👋" />
        
        <main className="flex-1 overflow-auto p-8">
          {/* Welcome Banner */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Good Morning, Daw Mya!</h2>
                <p className="text-blue-100">You have 3 interviews scheduled today. Let's make great placements!</p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <Link href="/clients">
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Active Clients"
              value={metrics.totalClients}
              change={metrics.clientsChange}
              icon={Users}
              iconBg="from-blue-500 to-cyan-500"
              trend="up"
            />
            <MetricCard
              title="Active Jobs"
              value={metrics.activeJobs}
              change={metrics.jobsChange}
              icon={Briefcase}
              iconBg="from-purple-500 to-pink-500"
              trend="up"
            />
            <MetricCard
              title="Pipeline Value"
              value={formatMMK(metrics.pipelineValue)}
              change={metrics.pipelineChange}
              icon={TrendingUp}
              iconBg="from-green-500 to-emerald-500"
              trend="up"
            />
            <MetricCard
              title="Placements"
              value={metrics.placementsThisMonth}
              change={metrics.placementsChange}
              icon={UserCheck}
              iconBg="from-orange-500 to-amber-500"
              trend="up"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Jobs */}
            <Card className="lg:col-span-2 border-0 shadow-xl shadow-slate-200/50 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gradient-to-r from-slate-50 to-transparent">
                <CardTitle className="text-lg font-bold text-slate-800">Active Job Orders</CardTitle>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeJobs.map((job, index) => (
                    <div key={job.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-transparent hover:from-blue-50 hover:to-transparent transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{job.title}</p>
                          <p className="text-sm text-slate-500">{job.clientName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-700">
                          {job.filled}/{job.quantity} <span className="font-normal text-slate-400">filled</span>
                        </p>
                        <p className="text-xs text-slate-400">{job.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <ActivityFeed activities={mockActivities.slice(0, 6)} />
          </div>

          {/* Pipeline Summary */}
          <div className="mt-8">
            <Card className="border-0 shadow-xl shadow-slate-200/50 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gradient-to-r from-slate-50 to-transparent">
                <CardTitle className="text-lg font-bold text-slate-800">Pipeline Overview</CardTitle>
                <Link href="/pipeline">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    Open Pipeline <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { stage: 'lead', deals: 1, value: 30000000, color: 'from-slate-500 to-slate-600' },
                    { stage: 'qualified', deals: 1, value: 12000000, color: 'from-blue-500 to-blue-600' },
                    { stage: 'proposal', deals: 2, value: 43000000, color: 'from-purple-500 to-purple-600' },
                    { stage: 'negotiation', deals: 1, value: 15000000, color: 'from-orange-500 to-orange-600' },
                    { stage: 'won', deals: 2, value: 13000000, color: 'from-green-500 to-green-600' },
                  ].map((item) => (
                    <div key={item.stage} className="group text-center p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:from-blue-50 hover:to-indigo-50 transition-all border border-slate-100 hover:border-blue-200 hover:shadow-lg">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold shadow-lg mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                        {item.deals}
                      </div>
                      <p className="text-sm font-semibold text-slate-700 capitalize">{item.stage}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatMMK(item.value)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
