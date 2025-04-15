'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Shield, Home, Plus, List, FileText, BarChart2, Database, Info, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface UserInfo {
  user_name: string;
  email: string;
  role: string;
  id: string;
}

function NavItem({ href, icon: Icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} className="block">
            <Button
              variant={isActive ? "default" : "ghost"}
              size="lg"
              className={cn(
                "w-full h-auto py-4 px-2",
                "flex flex-col items-center gap-2",
                "transition-all duration-200",
                isActive && "bg-primary/10 text-primary",
                !isActive && "hover:bg-primary/5"
              )}
            >
              <Icon className={cn("h-5 w-5")} />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="border-primary/10">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function Sidebar() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      const userInfo: UserInfo = {
        user_name: localStorage.getItem('user_name') || '',
        email: localStorage.getItem('email') || '',
        role: localStorage.getItem('role') || '',
        id: localStorage.getItem('id') || '',
      };

      if (Object.values(userInfo).every(value => value)) {
        setIsLoggedIn(true);
        setUser(userInfo);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkUser();
    window.addEventListener('authStateChanged', checkUser);
    return () => window.removeEventListener('authStateChanged', checkUser);
  }, []);

  if (!isLoggedIn) return null;

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-20 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col items-center gap-4 py-6">
        <Link href="/dashboard" className="flex items-center justify-center px-4 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </Link>

        <nav className="flex flex-1 flex-col items-center gap-2 px-2">
          <NavItem href="/dashboard" icon={Home} label="Dashboard" />
          <NavItem href="/applications/new" icon={Plus} label="New RTI" />
          <NavItem href="/applications" icon={List} label="Applications" />
          <NavItem href="/drafts" icon={FileText} label="Drafts" />
          <NavItem href="/reports" icon={BarChart2} label="Reports" />
          <NavItem href="/master-data" icon={Database} label="Master Data" />
          <NavItem href="/help" icon={Info} label="Help" />
        </nav>

        <div className="mt-auto px-2 w-full">
          <NavItem href="/settings" icon={Settings} label="Settings" />
        </div>
      </div>
    </aside>
  );
}