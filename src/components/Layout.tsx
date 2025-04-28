import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "relative flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-950 text-gray-200 overflow-hidden", // Added overflow-hidden
        className
      )}
    >
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
      {children}
    </div>
  );
};