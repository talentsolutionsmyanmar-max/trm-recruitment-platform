'use client';

import { useState } from 'react';
import { Deal } from '@/lib/types';
import { DealCard } from './DealCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMMK } from '@/lib/data';
import { Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  deals: Deal[];
  onDealMove: (dealId: string, newStage: Deal['stage']) => void;
  onDealEdit: (deal: Deal) => void;
}

const stages: { id: Deal['stage']; label: string; color: string }[] = [
  { id: 'lead', label: 'Lead', color: 'bg-slate-100 border-slate-300' },
  { id: 'qualified', label: 'Qualified', color: 'bg-blue-50 border-blue-300' },
  { id: 'proposal', label: 'Proposal', color: 'bg-purple-50 border-purple-300' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-50 border-orange-300' },
  { id: 'won', label: 'Won', color: 'bg-green-50 border-green-300' },
  { id: 'lost', label: 'Lost', color: 'bg-red-50 border-red-300' },
];

export function KanbanBoard({ deals, onDealMove, onDealEdit }: KanbanBoardProps) {
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [draggingDeal, setDraggingDeal] = useState<string | null>(null);

  const handleDragStart = (dealId: string) => {
    setDraggingDeal(dealId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: Deal['stage']) => {
    e.preventDefault();
    if (draggingDeal) {
      onDealMove(draggingDeal, stageId);
    }
    setDraggingDeal(null);
    setDragOverStage(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage.id);
        const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

        return (
          <div
            key={stage.id}
            className={cn(
              'flex-shrink-0 w-72 rounded-lg border-2 transition-colors',
              stage.color,
              dragOverStage === stage.id && 'ring-2 ring-blue-400'
            )}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="p-3 border-b border-inherit">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-700">{stage.label}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-medium text-slate-600">
                  {stageDeals.length}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <DollarSign className="h-3 w-3" />
                <span>{formatMMK(totalValue)}</span>
              </div>
            </div>
            
            <div className="p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
              {stageDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onDragStart={handleDragStart}
                  onEdit={onDealEdit}
                />
              ))}
              
              {stageDeals.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-400">
                  No deals in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
