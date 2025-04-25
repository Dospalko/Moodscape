// src/components/Playlist.tsx
import React from 'react';
import { Card } from './ui/card';
import { motion } from 'framer-motion';

export interface PlaylistProps {
  tracks: string[];
}

/**
 * Playlist komponenta zobrazí zoznam trackov ako karty s animáciou.
 */
export const Playlist: React.FC<PlaylistProps> = ({ tracks }) => {
  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {tracks.map((track, idx) => (
        <Card key={idx}>{track}</Card>
      ))}
    </motion.ul>
  );
};
