'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopNav } from '@/components/ui/top-nav';
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  MessageCircle, 
  CheckSquare, 
  Bell, 
  Flag, 
  AlertTriangle, 
  HelpCircle,
  Loader2
} from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";

interface UserInfo {
  user_name: string;
  email: string;
  role: string;
  id: string;
}

const features = [
  {
    title: "Basic Input",
    description: "Create and manage basic RTI applications and requests",
    icon: FileText,
    href: "/add/basic-input",
    gradient: "from-blue-600/90 to-blue-800/90"
  },
  {
    title: "Meeting Input",
    description: "Schedule and document RTI-related meetings",
    icon: Users,
    href: "/add/meeting-input",
    gradient: "from-purple-600/90 to-purple-800/90"
  },
  {
    title: "Meeting Discussion",
    description: "Record and track meeting outcomes and decisions",
    icon: MessageCircle,
    href: "/add/meeting-discussion",
    gradient: "from-pink-600/90 to-pink-800/90"
  },
  {
    title: "Final Ans. Input",
    description: "Submit and manage final responses to RTI requests",
    icon: CheckSquare,
    href: "/add/final-answer",
    gradient: "from-emerald-600/90 to-emerald-800/90"
  },
  {
    title: "Reminder Input",
    description: "Set up and manage RTI request reminders",
    icon: Bell,
    href: "/add/reminder",
    gradient: "from-amber-600/90 to-amber-800/90"
  },
  {
    title: "1st Appeal Input",
    description: "Handle and process first appeals",
    icon: Flag,
    href: "/add/first-appeal",
    gradient: "from-red-600/90 to-red-800/90"
  },
  {
    title: "2nd Appeal Input",
    description: "Manage and track second appeals",
    icon: AlertTriangle,
    href: "/add/second-appeal",
    gradient: "from-orange-600/90 to-orange-800/90"
  },
  {
    title: "Disagreement Input",
    description: "Record and handle disagreements and disputes",
    icon: HelpCircle,
    href: "/add/disagreement",
    gradient: "from-cyan-600/90 to-cyan-800/90"
  }
];

export default function AddPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userInfo: UserInfo = {
      user_name: localStorage.getItem('user_name') || '',
      email: localStorage.getItem('email') || '',
      role: localStorage.getItem('role') || '',
      id: localStorage.getItem('id') || '',
    };

    if (Object.values(userInfo).every(value => value)) {
      setUser(userInfo);
      setTimeout(() => setIsLoading(false), 500);
    } else {
      console.error('User information is incomplete');
      router.push('/login');
    }
  }, [router]);

  if (isLoading || !user) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: `url('/images/background.png')` }} />
        <div className="relative z-10">
          <TopNav user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary/60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: `url('/images/background.png')` }} />
      <div className="relative z-10">
        <TopNav user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="hover:bg-background/80">
                <Link href="/dashboard">
                  <ArrowLeft className="h-6 w-6" />
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold">New RTI Entry</h1>
                <p className="mt-1 text-muted-foreground">
                  Select the type of RTI entry you want to create
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="shadow-sm">
              <Link href="/dashboard">
                Return to Dashboard
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                href={feature.href}
                gradient={feature.gradient}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}