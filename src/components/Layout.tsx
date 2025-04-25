import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
export interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout komponenta obaluje celú aplikáciu.
 * Pridáva background gradient a centrálny container.
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-secondary p-6">
      <div className="max-w-3xl mx-auto bg-card/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  );
};
