'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Kanban,
  UserCircle,
  Mail,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Job Orders', href: '/jobs', icon: Briefcase },
  { name: 'Pipeline', href: '/pipeline', icon: Kanban },
  { name: 'Candidates', href: '/candidates', icon: UserCircle },
  { name: 'Outreach', href: '/outreach', icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-72 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white shadow-2xl">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 px-6 border-b border-slate-700/50">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Talent Resources
          </h1>
          <p className="text-xs text-blue-300 font-medium">Myanmar</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-700/50 p-4 space-y-2">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors">
          <Settings className="h-5 w-5" />
          Settings
        </button>
      </div>

      {/* User info */}
      <div className="border-t border-slate-700/50 p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-semibold text-white shadow-lg">
            DM
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Daw Mya</p>
            <p className="text-xs text-slate-400">Senior Recruiter</p>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
