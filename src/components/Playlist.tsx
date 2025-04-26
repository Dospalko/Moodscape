// src/components/Playlist.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Pridané CardHeader atď.
import { Button } from '@/components/ui/button'; // Pridané Button
import { motion } from 'framer-motion';
import { Play, ListMusic } from 'lucide-react'; // Pridané ikony
import { cn } from '@/lib/utils'; // Uisti sa, že cesta je správna

// Definujeme Track interface (môže byť aj v zdieľanom súbore)
interface Track {
  name: string;
  artist: string;
  artworkUrl: string;
}

export interface PlaylistProps {
  tracks: Track[];       // Zmenené na Track[]
  analyzedMood?: string; // Voliteľný mood pre popis
  className?: string;    // Pridané className
}

/**
 * Playlist komponenta - Zobrazí zoznam trackov s artworkom a detailmi.
 * Upravená pre tmavý režim a glassmorphism.
 */
export const Playlist: React.FC<PlaylistProps> = ({ tracks, analyzedMood, className }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Oneskorenie medzi animáciami položiek
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div // Wrapnuté pre animáciu containeru
       className={cn("w-full max-w-2xl", className)} // Šírka ovládaná tu alebo v App.tsx
       initial="hidden"
       animate="visible"
       variants={containerVariants}
    >
      <Card className="w-full bg-black/20 border border-white/10 backdrop-blur-xl shadow-2xl rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-100 flex items-center">
            <ListMusic className="mr-3 h-6 w-6 text-purple-400" /> Your Personalized Playlist
          </CardTitle>
          {analyzedMood && (
            <CardDescription className="text-gray-400">
                Tracks selected for your '{analyzedMood}' mood.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {tracks.length > 0 ? (
            <ul className="space-y-3">
              {tracks.map((track, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 hover:bg-white/10 cursor-pointer"
                  variants={itemVariants} // Použijeme varianty pre animáciu položiek
                  // initial="hidden" - handled by container stagger
                  // animate="visible" - handled by container stagger
                >
                  <img
                    src={`${track.artworkUrl}?sig=${idx}`} // Pridáme sig pre rôzne obrázky
                    alt={`${track.name} artwork`}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-md object-cover shadow-md flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-md text-gray-100 truncate">{track.name}</p>
                    <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full ml-auto">
                    <Play className="h-5 w-5" />
                  </Button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">No tracks generated yet.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};