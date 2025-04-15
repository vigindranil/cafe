'use client';

import { Sidebar } from "@/components/ui/sidebar";

export default function BasicInputLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-20">
        <div className="relative min-h-screen">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" 
            style={{ backgroundImage: `url('/images/background.png')` }} 
          />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}