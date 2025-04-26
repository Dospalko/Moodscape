// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Uisti sa, že táto cesta je správna

export interface LayoutProps {
  children: ReactNode;
  className?: string; // Pridané pre flexibilitu
}

/**
 * Layout komponenta - Teraz poskytuje full-screen wrapper s pozadím a paddingom.
 */
export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    // Aplikuje tmavé gradient pozadie, padding a základné flex nastavenia
    <div
      className={cn(
        "relative flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-950 text-gray-200 p-6 sm:p-10 overflow-x-hidden",
        className // Umožňuje pridať ďalšie triedy z App.tsx
      )}
    >
      {/* Voliteľný vzor na pozadí pre textúru */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
      {/* Obsah bude vložený sem */}
      {children}
    </div>
  );
};