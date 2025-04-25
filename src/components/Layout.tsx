// src/components/Layout.tsx
import React, { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout komponenta obaluje celú aplikáciu.
 * Pridáva background gradient a centrálny container.
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 p-6">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  );
};
