import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Header: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.header
      className={cn("w-full px-6 sm:px-10 py-4 flex-shrink-0 z-10 text-center", className)} // Added padding and flex-shrink-0
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-1 sm:mb-2">
        MoodTunes
      </h1>
      <p className="text-base sm:text-lg text-gray-400">
        Your feelings, your soundtrack.
      </p>
    </motion.header>
  );
};