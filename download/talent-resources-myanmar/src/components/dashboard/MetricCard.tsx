'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconBg?: string;
  trend: 'up' | 'down';
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel = 'vs last month',
  icon: Icon,
  iconBg = 'from-blue-500 to-indigo-600',
  trend
}: MetricCardProps) {
  const isPositive = trend === 'up';

  return (
    <Card className="group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-0 bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
            <div className="flex items-center gap-2">
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-slate-400">{changeLabel}</span>
            </div>
          </div>
          <div className={cn(
            'p-4 rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-110',
            iconBg
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
