'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const [captchaText, setCaptchaText] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setUserCaptcha('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userCaptcha.toUpperCase() !== captchaText) {
      setError('Invalid captcha! Please try again.');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_nameORemail: userId, 
          password 
        }),
      });

      const data = await response.json();

      if (data.errorCode === 0) {
        localStorage.setItem('token', data.result.token);
        localStorage.setItem('refreshToken', data.result.refresh_token);
        localStorage.setItem('user_name', data.result.user_name);
        localStorage.setItem('email', data.result.email);
        localStorage.setItem('role', data.result.role);
        localStorage.setItem('id', data.result.id);
        window.dispatchEvent(new Event('authStateChanged'));
        router.push("/dashboard");
      } else {
        setError('Invalid credentials. Please try again.');
        refreshCaptcha();
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred. Please try again later.');
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Doodle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-rule='evenodd'%3E%3Cpath d='M50 25c-13.807 0-25 11.193-25 25s11.193 25 25 25 25-11.193 25-25-11.193-25-25-25zm0 5c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20z'/%3E%3Cpath d='M20 10h5v80h-5zM75 10h5v80h-5z'/%3E%3Cpath d='M10 75v5h80v-5zM10 20v5h80v-5z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/20 via-white/50 to-[#138808]/20" />
      
      <Card className="w-full max-w-md p-8 shadow-xl relative bg-background/95 backdrop-blur-sm">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-[#FF9933]" />
            <span className="text-2xl font-bold">RTI भारत</span>
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">
          Sign in to your account
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Access the Right to Information Portal
        </p>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID or Email</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID or email"
              className="bg-background/50 backdrop-blur-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-background/50 backdrop-blur-sm pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Security Verification (Captcha)</Label>
            <div className="flex gap-2 items-center p-3 bg-muted/50 backdrop-blur-sm rounded-md">
              <div className="font-mono text-lg tracking-wider bg-primary/10 px-4 py-2 rounded">
                {captchaText}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={refreshCaptcha}
                className="hover:bg-background/50"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              placeholder="Enter captcha"
              className="mt-2 bg-background/50 backdrop-blur-sm"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#FF9933] hover:bg-[#FF8833] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="#" className="text-[#138808] hover:text-[#0F6606]">
            Forgot password?
          </Link>
          <span className="mx-2 text-muted-foreground">•</span>
          <Link href="#" className="text-[#138808] hover:text-[#0F6606]">
            Need help?
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>Government of India</p>
          <p>भारत सरकार</p>
        </div>
      </Card>
    </div>
  );
}