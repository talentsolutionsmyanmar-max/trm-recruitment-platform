'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockCandidates, formatMMK } from '@/lib/data';
import { Candidate, MYANMAR_CITIES } from '@/lib/types';
import { getStatusColor, getInitials } from '@/lib/utils';
import { Plus, Search, UserCircle, Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
    name: '',
    email: '',
    phone: '',
    location: 'Yangon',
    skills: [],
    experience: 0,
    education: '',
    expectedSalary: 0,
    status: 'available',
  });

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchQuery, statusFilter]);

  const handleAddCandidate = () => {
    const candidate: Candidate = {
      id: `can${Date.now()}`,
      name: newCandidate.name || '',
      email: newCandidate.email || '',
      phone: newCandidate.phone || '',
      location: newCandidate.location || 'Yangon',
      skills: newCandidate.skills || [],
      experience: newCandidate.experience || 0,
      education: newCandidate.education || '',
      currentCompany: 'New Applicant',
      expectedSalary: newCandidate.expectedSalary || 0,
      status: newCandidate.status || 'available',
      appliedJobs: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCandidates([candidate, ...candidates]);
    setShowAddForm(false);
    setNewCandidate({
      name: '',
      email: '',
      phone: '',
      location: 'Yangon',
      skills: [],
      experience: 0,
      education: '',
      expectedSalary: 0,
      status: 'available',
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Candidates" subtitle={`${candidates.length} total candidates`} />
        
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search candidates by name, email, or skills..."
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
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="not-looking">Not Looking</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-sm text-slate-500">
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </div>

          {/* Candidates Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-slate-500">Candidate</th>
                      <th className="text-left p-4 font-medium text-slate-500">Contact</th>
                      <th className="text-left p-4 font-medium text-slate-500">Skills</th>
                      <th className="text-left p-4 font-medium text-slate-500">Experience</th>
                      <th className="text-left p-4 font-medium text-slate-500">Expected Salary</th>
                      <th className="text-left p-4 font-medium text-slate-500">Status</th>
                      <th className="text-left p-4 font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCandidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {getInitials(candidate.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{candidate.name}</p>
                              <p className="text-sm text-slate-500">{candidate.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1 text-slate-600">
                              <Mail className="h-3 w-3" />
                              {candidate.email}
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Phone className="h-3 w-3" />
                              {candidate.phone}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 3).map((skill, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {candidate.experience} years
                        </td>
                        <td className="p-4 text-sm font-medium text-green-600">
                          {formatMMK(candidate.expectedSalary)}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(candidate.status)}>
                            {candidate.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedCandidate(candidate)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {filteredCandidates.length === 0 && (
            <Card className="mt-8">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserCircle className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">No candidates found</p>
                <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Candidate Detail Dialog */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {getInitials(selectedCandidate.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedCandidate.name}</h3>
                  <p className="text-slate-500">{selectedCandidate.currentCompany}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{selectedCandidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{selectedCandidate.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{selectedCandidate.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  <span>{selectedCandidate.experience} years exp.</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Education</p>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  <span>{selectedCandidate.education}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {selectedCandidate.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-slate-500">Expected Salary</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatMMK(selectedCandidate.expectedSalary)}
                  </p>
                </div>
                <Badge className={getStatusColor(selectedCandidate.status)}>
                  {selectedCandidate.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Candidate Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={newCandidate.location}
                  onValueChange={(value) => setNewCandidate({ ...newCandidate, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MYANMAR_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience (years)</Label>
                <Input
                  type="number"
                  value={newCandidate.experience}
                  onChange={(e) => setNewCandidate({ ...newCandidate, experience: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Education</Label>
                <Input
                  value={newCandidate.education}
                  onChange={(e) => setNewCandidate({ ...newCandidate, education: e.target.value })}
                  placeholder="e.g., B.E. Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label>Expected Salary (MMK)</Label>
                <Input
                  type="number"
                  value={newCandidate.expectedSalary}
                  onChange={(e) => setNewCandidate({ ...newCandidate, expectedSalary: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Skills (comma separated)</Label>
              <Input
                placeholder="e.g., Construction, Masonry, Concrete Work"
                onChange={(e) => setNewCandidate({ 
                  ...newCandidate, 
                  skills: e.target.value.split(',').map(s => s.trim()) 
                })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCandidate}>Add Candidate</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
