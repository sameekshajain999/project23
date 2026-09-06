import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, Award } from 'lucide-react';

interface StatusBadgeProps {
  type?: 'verified' | 'pending' | 'warning' | 'info' | 'score' | 'neutral';
  label: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type = 'neutral',
  label,
  size = 'md',
  icon = true,
  className,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-bold',
  };

  const typeClasses = {
    verified: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    pending: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    warning: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    score: 'bg-[#1B4D3E]/10 text-[#1B4D3E] border-[#1B4D3E]/20 dark:bg-emerald-900/30 dark:text-emerald-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const renderIcon = () => {
    if (!icon) return null;
    switch (type) {
      case 'verified':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'pending':
        return <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />;
      case 'score':
        return <Award className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-emerald-400 shrink-0" />;
      case 'info':
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <span
      id={`badge-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      className={cn(
        'inline-flex items-center rounded-full border transition-colors shadow-xs',
        sizeClasses[size],
        typeClasses[type],
        className
      )}
    >
      {renderIcon()}
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
};
