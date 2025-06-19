
import React from 'react';
import { ProjectHeader } from './ProjectHeader';

interface EnhancedLayoutProps {
  children: React.ReactNode;
}

export const EnhancedLayout = ({ children }: EnhancedLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <ProjectHeader />
      <main className="flex-1 overflow-hidden p-2 lg:p-0">
        {children}
      </main>
    </div>
  );
};
