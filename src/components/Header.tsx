import React from 'react';
import { motion } from 'framer-motion';

/**
 * Header komponenta s názvom aplikácie a dekoratívnym SVG.
 */
export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 relative">
      <motion.h1
        className="text-5xl font-extrabold"
        style={{ color: 'hsl(var(--primary))' }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        MoodTunes
      </motion.h1>
      <p className="text-muted-foreground mt-2">
        Vyber náladu a nech hudba rozpráva za teba
      </p>
      {/* Dekoratívna páska */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-accent rounded-t-lg"></div>
    </header>
  );
};
