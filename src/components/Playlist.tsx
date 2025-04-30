// src/components/Playlist.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, ListMusic, Music2 } from 'lucide-react'; // Using Music2 for skeleton
import { cn } from '@/lib/utils';

// Interface for Track (remains the same)
interface Track {
  name: string;
  artist: string;
  artworkUrl: string;
}

// --- Updated Props ---
export interface PlaylistProps {
  tracks: Track[];
  analyzedMood?: string;
  className?: string;
  isLoading?: boolean; // Added for skeleton loader
}

// --- Skeleton Loader Component ---
const TrackSkeleton: React.FC = () => (
  <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-white/5 animate-pulse">
    <div className="w-12 h-12 rounded-md bg-white/10 flex-shrink-0 flex items-center justify-center">
      <Music2 className="w-6 h-6 text-gray-600" /> {/* Placeholder icon */}
    </div>
    <div className="flex-grow space-y-2">
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
      <div className="h-3 bg-white/10 rounded w-1/2"></div>
    </div>
    <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0"></div> {/* Button placeholder */}
  </div>
);


// --- Main Playlist Component ---
export const Playlist: React.FC<PlaylistProps> = ({
  tracks,
  analyzedMood,
  className,
  isLoading = false // Default to false
}) => {

  // Animation variants (subtler stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0 }
  };

  const showSkeleton = isLoading && tracks.length === 0;
  const showEmptyMessage = !isLoading && tracks.length === 0;

  return (
    // Main container: Takes available vertical space and handles overflow internally
    // REMOVED max-w-2xl, width is handled by parent in App.tsx
    // ADDED flex flex-col flex-grow min-h-0 for proper flexbox height and overflow control
    <motion.div
       className={cn(
          "flex flex-col flex-grow min-h-0 w-full", // Crucial for layout
          className
       )}
       // Use a key tied to mood/loading state to force remount/animation reset if needed
       key={isLoading ? 'loading' : (analyzedMood || 'stale')}
       initial="hidden"
       animate="visible"
       exit="exit" // Define exit animation if used with AnimatePresence correctly
       variants={containerVariants}
    >
      {/* Card now fills the container and manages internal overflow */}
      <Card className="w-full bg-black/20 border border-white/10 backdrop-blur-xl shadow-2xl rounded-xl flex flex-col flex-grow overflow-hidden">
         {/* Header shrinks, doesn't grow */}
        <CardHeader className="flex-shrink-0 pt-4 pb-3 px-4 sm:px-5 border-b border-white/10">
          <CardTitle className="text-lg sm:text-xl font-medium text-gray-100 flex items-center">
            <ListMusic className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
            Your Playlist
          </CardTitle>
          {/* Show description only when not loading and mood is available */}
          {!isLoading && analyzedMood && (
            <CardDescription className="text-gray-400 text-sm mt-1">
                For your '{analyzedMood}' mood.
            </CardDescription>
          )}
          {/* Loading indicator in header */}
          {isLoading && (
            <CardDescription className="text-gray-400 text-sm mt-1 animate-pulse">
                Generating recommendations...
            </CardDescription>
          )}
        </CardHeader>

        {/* Card Content takes remaining space and scrolls */}
        {/* ADDED flex-grow overflow-y-auto and scrollbar styling */}
        <CardContent className="flex-grow overflow-y-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2 scrollbar-thin scrollbar-thumb-purple-500/40 hover:scrollbar-thumb-purple-500/60 scrollbar-track-transparent">

          {/* Conditional Rendering */}
          {showSkeleton ? (
            // Skeleton Loaders
            <>
              {[...Array(5)].map((_, i) => <TrackSkeleton key={`skel-${i}`} />)}
            </>
          ) : showEmptyMessage ? (
             // Empty State Message (styled better)
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 text-gray-500">
                <Music2 className="w-10 h-10 mb-3 text-gray-600"/>
                 <p className="font-medium">No tracks to display.</p>
                 <p className="text-sm">Try generating a playlist based on your mood.</p>
            </div>
          ) : (
             // Actual Track List (using motion.div for items)
             // Removed the outer <ul> for slightly simpler structure within CardContent
             tracks.map((track, idx) => (
                <motion.div
                  key={track.name + idx} // Use a potentially more unique key
                  className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg transition-colors duration-150 ease-in-out hover:bg-white/10 group cursor-pointer" // Added group for potential hover effects
                  variants={itemVariants}
                  // initial="hidden", animate="visible" are handled by parent's stagger
                >
                  <img
                    src={track.artworkUrl} // Removed '?sig=' suffix, backend ensures variability
                    alt={`${track.name} artwork`}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover shadow-sm flex-shrink-0 border border-white/10" // Added subtle border
                    onError={(e) => { // Fallback if image fails to load
                        e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(track.name)}/150/150`; // Or a static placeholder
                        e.currentTarget.onerror = null; // Prevent infinite loops
                      }}
                  />
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-100 truncate group-hover:text-white" title={track.name}> {/* Added title for full name on hover */}
                      {track.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 truncate group-hover:text-gray-300" title={track.artist}>
                      {track.artist}
                    </p>
                  </div>
                   {/* Play button with slightly adjusted style */}
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/15 rounded-full flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </motion.div>
              ))
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};