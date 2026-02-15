'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientForm } from '@/components/clients/ClientForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockClients } from '@/lib/data';
import { Client, INDUSTRIES } from '@/lib/types';
import { Plus, Search, Filter, Building2, Users, TrendingUp } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = 
        client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter;
      
      return matchesSearch && matchesStatus && matchesIndustry;
    });
  }, [clients, searchQuery, statusFilter, industryFilter]);

  const handleAddClient = (clientData: Partial<Client>) => {
    const newClient: Client = {
      id: `c${Date.now()}`,
      companyName: clientData.companyName || '',
      industry: clientData.industry || '',
      contactPerson: clientData.contactPerson || '',
      email: clientData.email || '',
      phone: clientData.phone || '',
      address: clientData.address || '',
      city: clientData.city || 'Yangon',
      status: clientData.status || 'prospect',
      notes: clientData.notes || '',
      createdAt: new Date().toISOString().split('T')[0],
      totalJobs: 0,
      totalPlacements: 0,
    };
    setClients([newClient, ...clients]);
  };

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    prospects: clients.filter(c => c.status === 'prospect').length,
  }), [clients]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Clients" subtitle="Manage your client relationships" />
        
        <main className="flex-1 overflow-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Clients</p>
                    <p className="text-4xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Building2 className="h-7 w-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Clients</p>
                    <p className="text-4xl font-bold mt-1">{stats.active}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Users className="h-7 w-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Prospects</p>
                    <p className="text-4xl font-bold mt-1">{stats.prospects}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search clients by name, contact, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-white border-slate-200 rounded-xl shadow-sm"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-12 bg-white rounded-xl shadow-sm border-slate-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-44 h-12 bg-white rounded-xl shadow-sm border-slate-200">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {INDUSTRIES.slice(0, 10).map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button onClick={() => setShowForm(true)} className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredClients.length}</span> of {clients.length} clients
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>

          {filteredClients.length === 0 && (
            <Card className="mt-8 border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Filter className="h-16 w-16 text-slate-200 mb-4" />
                <p className="text-slate-500 text-lg font-medium">No clients found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <ClientForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleAddClient}
      />
    </div>
  );
}
