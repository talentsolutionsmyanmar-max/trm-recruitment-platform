'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockDeals, mockClients, formatMMK } from '@/lib/data';
import { Deal } from '@/lib/types';
import { Plus, TrendingUp, DollarSign, Target, CheckCircle } from 'lucide-react';

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({
    title: '',
    clientId: '',
    value: 0,
    stage: 'lead',
    probability: 10,
    notes: '',
    expectedCloseDate: '',
  });

  const stats = useMemo(() => {
    const activeDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
    const totalValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
    const weightedValue = activeDeals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0);
    const wonDeals = deals.filter(d => d.stage === 'won');
    const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
    
    return {
      activeDeals: activeDeals.length,
      totalValue,
      weightedValue,
      wonDeals: wonDeals.length,
      wonValue
    };
  }, [deals]);

  const handleDealMove = (dealId: string, newStage: Deal['stage']) => {
    setDeals(deals.map(d => {
      if (d.id === dealId) {
        const probabilityMap: Record<Deal['stage'], number> = {
          lead: 10,
          qualified: 25,
          proposal: 50,
          negotiation: 75,
          won: 100,
          lost: 0
        };
        return { ...d, stage: newStage, probability: probabilityMap[newStage] };
      }
      return d;
    }));
  };

  const handleDealEdit = (updatedDeal: Deal) => {
    setDeals(deals.map(d => d.id === updatedDeal.id ? updatedDeal : d));
  };

  const handleAddDeal = () => {
    const client = mockClients.find(c => c.id === newDeal.clientId);
    const deal: Deal = {
      id: `d${Date.now()}`,
      title: newDeal.title || '',
      clientId: newDeal.clientId || '',
      clientName: client?.companyName || '',
      value: newDeal.value || 0,
      stage: newDeal.stage || 'lead',
      probability: newDeal.probability || 10,
      notes: newDeal.notes || '',
      expectedCloseDate: newDeal.expectedCloseDate || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDeals([deal, ...deals]);
    setShowAddDeal(false);
    setNewDeal({
      title: '',
      clientId: '',
      value: 0,
      stage: 'lead',
      probability: 10,
      notes: '',
      expectedCloseDate: '',
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Sales Pipeline" subtitle="Manage deals and opportunities" />
        
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-700">{stats.activeDeals}</p>
                    <p className="text-sm text-slate-500">Active Deals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-700">{formatMMK(stats.totalValue)}</p>
                    <p className="text-sm text-slate-500">Pipeline Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-700">{formatMMK(stats.weightedValue)}</p>
                    <p className="text-sm text-slate-500">Weighted Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-700">{stats.wonDeals}</p>
                    <p className="text-sm text-slate-500">Won Deals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center justify-center">
                <Button onClick={() => setShowAddDeal(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Kanban Board */}
          <KanbanBoard
            deals={deals}
            onDealMove={handleDealMove}
            onDealEdit={handleDealEdit}
          />
        </main>
      </div>

      {/* Add Deal Dialog */}
      <Dialog open={showAddDeal} onOpenChange={setShowAddDeal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Deal Title</Label>
              <Input
                value={newDeal.title}
                onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                placeholder="e.g., Annual Staffing Contract"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Client</Label>
              <Select
                value={newDeal.clientId}
                onValueChange={(value) => setNewDeal({ ...newDeal, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Value (MMK)</Label>
                <Input
                  type="number"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
                  placeholder="e.g., 10000000"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Probability (%)</Label>
                <Input
                  type="number"
                  max="100"
                  value={newDeal.probability}
                  onChange={(e) => setNewDeal({ ...newDeal, probability: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Expected Close Date</Label>
              <Input
                type="date"
                value={newDeal.expectedCloseDate}
                onChange={(e) => setNewDeal({ ...newDeal, expectedCloseDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={newDeal.notes}
                onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddDeal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDeal}>Add Deal</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
