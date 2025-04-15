'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopNav } from '@/components/ui/top-nav';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { DashboardCharts } from '@/components/ui/dashboard-charts';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import { FileText, RefreshCw, XCircle, Clock, CheckCircle, AlertCircle, ArrowUpCircle } from 'lucide-react';

interface UserInfo {
  user_name: string;
  email: string;
  role: string;
  id: string;
}

interface DashboardData {
  applicationCount: number;
  returnApplicationCount: number;
  refuseApplicationCount: number;
  pendingApplicationCount: number;
  disposeApplicationCount: number;
  firstAppealCount: number;
  secondAppealCount: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
    } else {
      console.error('User information is incomplete');
      router.push('/login');
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}dashboard/dashboardCount`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.errorCode === 0) {
          setDashboardData(data.data);
        } else {
          console.error('Error fetching dashboard data');
          if (data.errorCode === 401) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    fetchDashboardData();
  }, [router]);

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

  if (isLoading || !user || !dashboardData) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: `url('/images/background.png')` }} />
        <div className="relative z-10">
          <TopNav user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="p-8">
            <DashboardSkeleton />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: `url('/images/background.png')` }} />
      <div className="relative z-10">
        <TopNav user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Dashboard Overview</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user.user_name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Applications"
              value={dashboardData.applicationCount}
              icon={FileText}
              percentageChange={12}
              variant="blue"
              isLoading={isLoading}
            />
            <DashboardCard
              title="Returned Applications"
              value={dashboardData.returnApplicationCount}
              icon={RefreshCw}
              percentageChange={-5}
              variant="yellow"
              isLoading={isLoading}
            />
            <DashboardCard
              title="Refused Applications"
              value={dashboardData.refuseApplicationCount}
              icon={XCircle}
              percentageChange={2}
              variant="pink"
              isLoading={isLoading}
            />
            <DashboardCard
              title="Pending Applications"
              value={dashboardData.pendingApplicationCount}
              icon={Clock}
              percentageChange={8}
              variant="orange"
              isLoading={isLoading}
            />
            <DashboardCard
              title="Disposed Applications"
              value={dashboardData.disposeApplicationCount}
              icon={CheckCircle}
              percentageChange={15}
              variant="green"
              isLoading={isLoading}
            />
            <DashboardCard
              title="First Appeals"
              value={dashboardData.firstAppealCount}
              icon={AlertCircle}
              percentageChange={-3}
              variant="purple"
              isLoading={isLoading}
            />
            <DashboardCard
              title="Second Appeals"
              value={dashboardData.secondAppealCount}
              icon={ArrowUpCircle}
              percentageChange={7}
              variant="cyan"
              isLoading={isLoading}
            />
          </div>

          <DashboardCharts data={dashboardData} isLoading={isLoading} className="bg-background/50" />
        </main>
      </div>
    </div>
  );
}