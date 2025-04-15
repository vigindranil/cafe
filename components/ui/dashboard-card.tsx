'use client';

import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  percentageChange: number;
  variant: 'blue' | 'yellow' | 'pink' | 'orange' | 'green' | 'purple' | 'cyan';
  isLoading?: boolean;
}

const variants = {
  blue: 'from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 [&_svg]:text-blue-100 border-blue-400',
  yellow: 'from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 [&_svg]:text-amber-100 border-amber-400',
  pink: 'from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 [&_svg]:text-pink-100 border-pink-400',
  orange: 'from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 [&_svg]:text-orange-100 border-orange-400',
  green: 'from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 [&_svg]:text-emerald-100 border-emerald-400',
  purple: 'from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 [&_svg]:text-purple-100 border-purple-400',
  cyan: 'from-cyan-600 to-cyan-800 hover:from-cyan-700 hover:to-cyan-900 [&_svg]:text-cyan-100 border-cyan-400',
};

export function DashboardCard({
  title,
  value,
  icon: Icon,
  percentageChange,
  variant = 'blue',
  isLoading = false,
}: DashboardCardProps) {
  const isPositive = percentageChange > 0;

  if (isLoading) {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-xl p-6",
        "bg-gradient-to-br backdrop-blur-sm",
        "border border-opacity-50 shadow-lg",
        "animate-pulse",
        variants[variant]
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-white/20" />
            <div className="h-4 w-24 bg-white/20 rounded" />
          </div>
          <div className="h-6 w-16 bg-white/20 rounded-full" />
        </div>
        <div className="h-8 w-32 bg-white/20 rounded mt-4" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-6",
        "bg-gradient-to-br backdrop-blur-sm",
        "transition-all duration-200 ease-in-out",
        "hover:shadow-lg hover:scale-[1.02]",
        "border border-opacity-50 shadow-lg",
        variants[variant]
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-medium text-sm text-white/90">{title}</h3>
        </div>
        <div
          className={cn(
            "text-xs font-medium px-2.5 py-0.5 rounded-full",
            isPositive
              ? "bg-emerald-400/20 text-emerald-100"
              : "bg-red-400/20 text-red-100"
          )}
        >
          {isPositive ? "+" : ""}{percentageChange}%
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
      </div>

      <div 
        className="absolute inset-0 z-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(
            circle at 100% 100%,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 100%
          )`
        }}
      />
    </div>
  );
}