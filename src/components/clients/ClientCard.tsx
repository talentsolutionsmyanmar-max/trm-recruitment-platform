'use client';

import Link from 'next/link';
import { Client } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, ArrowRight, Building2 } from 'lucide-react';
import { getStatusColor, getInitials } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-white overflow-hidden">
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className="h-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 relative">
          <div className="absolute -bottom-8 left-5">
            <div className="h-16 w-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              {getInitials(client.companyName)}
            </div>
          </div>
        </div>
        
        <div className="pt-12 pb-5 px-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{client.companyName}</h3>
              <p className="text-sm text-slate-500">{client.industry}</p>
            </div>
            <Badge className={`${getStatusColor(client.status)} rounded-lg font-medium`}>
              {client.status}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-slate-600 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <span className="truncate">{client.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Phone className="h-4 w-4 text-slate-400" />
              </div>
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-slate-400" />
              </div>
              <span>{client.city}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">{client.totalJobs}</p>
                <p className="text-xs text-slate-400">Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">{client.totalPlacements}</p>
                <p className="text-xs text-slate-400">Placements</p>
              </div>
            </div>
            <Link href={`/clients/${client.id}`}>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                View <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
