'use client';

import { Sidebar } from "@/components/ui/sidebar";

export default function AddLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-20">
        {children}
      </div>
    </div>
  );
}