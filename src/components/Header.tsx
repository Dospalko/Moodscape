// src/components/Header.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Uisti sa, že táto cesta je správna

/**
 * Header komponenta s názvom aplikácie - upravená pre tmavý režim.
 */
export const Header: React.FC<{ className?: string }> = ({ className }) => { // Pridané className prop
  return (
    <motion.header // Použijeme motion priamo na header pre jednoduchosť
      className={cn("w-full max-w-4xl mb-12 text-center z-10", className)}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-3">
        MoodTunes
      </h1>
      <p className="text-lg sm:text-xl text-gray-400">
        Your feelings, your soundtrack. {/* Upravený text */}
      </p>
      {/* Dekoratívna páska odstránená pre čistejší vzhľad v tmavom režime */}
      {/* <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-lg"></div> */}
    </motion.header>
  );
};