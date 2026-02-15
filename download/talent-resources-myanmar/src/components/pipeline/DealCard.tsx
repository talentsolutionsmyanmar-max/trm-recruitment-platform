'use client';

import { useState } from 'react';
import { Deal } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
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
import { getStageColor, getInitials } from '@/lib/utils';
import { formatMMK, formatDate } from '@/lib/data';
import { Calendar, DollarSign, User, GripVertical } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  onDragStart: (dealId: string) => void;
  onEdit?: (deal: Deal) => void;
}

const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as const;

export function DealCard({ deal, onDragStart, onEdit }: DealCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(deal);

  const handleSave = () => {
    if (onEdit) {
      onEdit(editData);
    }
    setShowEdit(false);
  };

  return (
    <>
      <Card 
        className="cursor-grab hover:shadow-md transition-all active:cursor-grabbing"
        draggable
        onDragStart={() => onDragStart(deal.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-slate-300" />
              <h4 className="font-medium text-sm text-slate-900 line-clamp-2">
                {deal.title}
              </h4>
            </div>
          </div>
          
          <div className="flex items-center gap-1 mb-2">
            <User className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-500 truncate">
              {deal.clientName}
            </span>
          </div>
          
          <div className="flex items-center gap-1 mb-3">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="text-sm font-semibold text-green-600">
              {formatMMK(deal.value)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(deal.expectedCloseDate)}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {deal.probability}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Value (MMK)</Label>
                <Input
                  type="number"
                  value={editData.value}
                  onChange={(e) => setEditData({ ...editData, value: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Probability (%)</Label>
                <Input
                  type="number"
                  max="100"
                  value={editData.probability}
                  onChange={(e) => setEditData({ ...editData, probability: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Stage</Label>
              <Select
                value={editData.stage}
                onValueChange={(value: Deal['stage']) => setEditData({ ...editData, stage: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Expected Close Date</Label>
              <Input
                type="date"
                value={editData.expectedCloseDate}
                onChange={(e) => setEditData({ ...editData, expectedCloseDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={editData.notes}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
