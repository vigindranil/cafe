'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TopNav } from '@/components/ui/top-nav';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from "lucide-react";
import { ApplicationForm } from '@/components/application-form';

interface UserInfo {
  user_name: string;
  email: string;
  role: string;
  id: string;
}

function BasicInputContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationDetails, setApplicationDetails] = useState(null);

  const appId = searchParams.get('appId');

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

    const fetchApplicationDetails = async () => {
      if (appId) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}applications/${appId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          
          if (data.errorCode === 0) {
            setApplicationDetails(data.data);
          }
        } catch (error) {
          console.error('Error fetching application details:', error);
        }
      }
      setIsLoading(false);
    };

    fetchApplicationDetails();
  }, [appId, router]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary/60" />
      </div>
    );
  }

  return (
    <>
      <TopNav user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/add">
                <ArrowLeft className="h-6 w-6" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Application</h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Fill in the application details below</p>
            </div>
          </div>
        </div>

        <ApplicationForm applicationDetails={applicationDetails} />
      </main>
    </>
  );
}

export default function BasicInput() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary/60" />
      </div>
    }>
      <BasicInputContent />
    </Suspense>
  );
}