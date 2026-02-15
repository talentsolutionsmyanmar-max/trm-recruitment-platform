'use client';

import { useState } from 'react';
import { JobOrder, MYANMAR_CITIES, JOB_CATEGORIES } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { mockClients } from '@/lib/data';

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (job: Partial<JobOrder>) => void;
  initialData?: JobOrder;
}

export function JobForm({ open, onOpenChange, onSubmit, initialData }: JobFormProps) {
  const [formData, setFormData] = useState<Partial<JobOrder>>(
    initialData || {
      title: '',
      clientId: '',
      location: '',
      salaryMin: 0,
      salaryMax: 0,
      requirements: '',
      quantity: 1,
      priority: 'medium',
      status: 'open',
      deadline: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = mockClients.find(c => c.id === formData.clientId);
    onSubmit({
      ...formData,
      clientName: client?.companyName || '',
      filled: initialData?.filled || 0
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Job Order' : 'Create New Job Order'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title">Job Title *</Label>
              <Select
                value={formData.title}
                onValueChange={(value) => setFormData({ ...formData, title: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job category" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.filter(c => c.status === 'active').map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.location?.split(' - ')[0]}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {MYANMAR_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Minimum Salary (MMK)</Label>
              <Input
                id="salaryMin"
                type="number"
                value={formData.salaryMin || ''}
                onChange={(e) => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
                placeholder="e.g., 300000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Maximum Salary (MMK)</Label>
              <Input
                id="salaryMax"
                type="number"
                value={formData.salaryMax || ''}
                onChange={(e) => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
                placeholder="e.g., 500000"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Needed</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity || ''}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'high' | 'medium' | 'low') => 
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: JobOrder['status']) => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="filled">Filled</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline || ''}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements || ''}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={3}
              placeholder="Describe the job requirements..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Save Changes' : 'Create Job Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
