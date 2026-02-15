'use client';

import Link from 'next/link';
import { JobOrder } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Briefcase, MapPin, Calendar, ArrowRight, Users } from 'lucide-react';
import { getStatusColor, getStageColor } from '@/lib/utils';
import { formatMMK, formatDate } from '@/lib/data';

interface JobCardProps {
  job: JobOrder;
}

export function JobCard({ job }: JobCardProps) {
  const fillPercentage = Math.round((job.filled / job.quantity) * 100);
  
  return (
    <Card className="hover:shadow-md transition-all hover:border-blue-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStageColor(job.priority)}>
              {job.priority}
            </Badge>
            <Badge className={getStatusColor(job.status)}>
              {job.status}
            </Badge>
          </div>
        </div>

        <h3 className="font-semibold text-slate-900 mb-1">{job.title}</h3>
        <Link href={`/clients/${job.clientId}`} className="text-sm text-blue-600 hover:underline">
          {job.clientName}
        </Link>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-slate-400" />
            <span>{formatMMK(job.salaryMin)} - {formatMMK(job.salaryMax)}/month</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Deadline: {formatDate(job.deadline)}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">
                {job.filled} / {job.quantity} filled
              </span>
            </div>
            <span className="font-medium text-slate-700">{fillPercentage}%</span>
          </div>
          <Progress value={fillPercentage} className="h-2" />
        </div>

        <div className="mt-4 flex justify-end pt-4 border-t border-slate-100">
          <Link href={`/jobs/${job.id}`}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View Details <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
