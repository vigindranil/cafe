'use client';

import Link from "next/link";
import { DivideIcon as LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  gradient,
}: FeatureCardProps) {
  return (
    <Link href={href} className="block h-full">
      <div
        className={cn(
          "group relative h-[200px] overflow-hidden rounded-xl p-6",
          "bg-gradient-to-br backdrop-blur-sm",
          "transition-all duration-200 ease-in-out",
          "hover:shadow-lg hover:scale-[1.02]",
          "border border-white/10",
          gradient
        )}
      >
        <div className="relative z-10 h-full flex flex-col">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-white">{title}</h3>
          </div>
          <p className="text-sm text-white/80 flex-grow">{description}</p>
        </div>

        {/* Decorative Elements */}
        <div 
          className="absolute inset-0 z-0 opacity-30 mix-blend-overlay transition-opacity group-hover:opacity-40"
          style={{
            backgroundImage: `radial-gradient(
              circle at 100% 100%,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 100%
            )`
          }}
        />
        
        <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-all duration-300 group-hover:scale-150" />
      </div>
    </Link>
  );
}