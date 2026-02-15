import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    prospect: 'bg-blue-100 text-blue-800',
    open: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    filled: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    available: 'bg-green-100 text-green-800',
    placed: 'bg-purple-100 text-purple-800',
    'not-looking': 'bg-gray-100 text-gray-800',
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    lead: 'bg-slate-200 text-slate-800',
    qualified: 'bg-blue-200 text-blue-800',
    proposal: 'bg-purple-200 text-purple-800',
    negotiation: 'bg-orange-200 text-orange-800',
    won: 'bg-green-200 text-green-800',
    lost: 'bg-red-200 text-red-800'
  };
  return colors[stage] || 'bg-gray-200 text-gray-800';
}

export function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    call: '📞',
    email: '📧',
    meeting: '📅',
    note: '📝',
    placement: '✅'
  };
  return icons[type] || '📌';
}
