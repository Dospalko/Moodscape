import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        <motion.li key={idx}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
        >
          <Card className="bg-card text-card-foreground shadow-md overflow-hidden rounded-md">
            <CardContent>
              <p className="text-sm font-semibold">{track}</p>
            </CardContent>
          </Card>
        </motion.li>
      ))}
    </motion.ul>
  );
};
