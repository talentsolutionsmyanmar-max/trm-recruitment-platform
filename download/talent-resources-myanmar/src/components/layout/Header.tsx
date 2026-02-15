'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search anything..."
            className="w-80 pl-11 h-11 bg-slate-100 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-xl hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg">
            3
          </span>
        </Button>
      </div>
    </header>
  );
}
