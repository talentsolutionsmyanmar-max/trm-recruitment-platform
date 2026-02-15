'use client';

import { formatDistanceToNow } from 'date-fns';
import { Activity } from '@/lib/types';
import { getActivityIcon } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="h-full border-0 shadow-xl shadow-slate-200/50 overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-transparent">
        <CardTitle className="text-lg font-bold text-slate-800">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[340px] pr-2">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg shadow-sm ${
                  activity.type === 'placement' ? 'bg-green-100' :
                  activity.type === 'call' ? 'bg-blue-100' :
                  activity.type === 'email' ? 'bg-purple-100' :
                  activity.type === 'meeting' ? 'bg-orange-100' : 'bg-slate-100'
                }`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-medium text-slate-500">{activity.relatedTo}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
