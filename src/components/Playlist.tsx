// src/components/Playlist.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// Button is not directly used for the link anymore, but might be needed elsewhere
// import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, ListMusic, Music2 } from 'lucide-react';
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
  isLoading?: boolean;
}

// --- Skeleton Loader Component (remains the same) ---
const TrackSkeleton: React.FC = () => (
    // ... skeleton JSX ...
    <div className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-white/5 animate-pulse">
        <div className="w-12 h-12 rounded-md bg-white/10 flex-shrink-0 flex items-center justify-center">
            <Music2 className="w-6 h-6 text-gray-600" />
        </div>
        <div className="flex-grow space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-3 bg-white/10 rounded w-1/2"></div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0"></div>
    </div>
);


// --- Main Playlist Component ---
export const Playlist: React.FC<PlaylistProps> = ({
  tracks,
  analyzedMood,
  className,
  isLoading = false
}) => {

  // Animation variants (remains the same)
  const containerVariants = { /* ... */ };
  const itemVariants = { /* ... */ };

  const showSkeleton = isLoading && tracks.length === 0;
  const showEmptyMessage = !isLoading && tracks.length === 0;

  return (
    <motion.div
       className={cn("flex flex-col flex-grow min-h-0 w-full", className)}
       key={isLoading ? 'loading' : (analyzedMood || 'stale')}
       initial="hidden"
       animate="visible"
       exit="exit"
       variants={containerVariants}
    >
      <Card className="w-full bg-black/20 border border-white/10 backdrop-blur-xl shadow-2xl rounded-xl flex flex-col flex-grow overflow-hidden">
        <CardHeader className="flex-shrink-0 pt-4 pb-3 px-4 sm:px-5 border-b border-white/10">
            {/* ... CardHeader content ... */}
            <CardTitle className="text-lg sm:text-xl font-medium text-gray-100 flex items-center">
                <ListMusic className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                Your Playlist
            </CardTitle>
            {!isLoading && analyzedMood && ( <CardDescription className="text-gray-400 text-sm mt-1">For your '{analyzedMood}' mood.</CardDescription> )}
            {isLoading && ( <CardDescription className="text-gray-400 text-sm mt-1 animate-pulse">Generating recommendations...</CardDescription> )}
        </CardHeader>

        <CardContent className="flex-grow overflow-y-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2 scrollbar-thin scrollbar-thumb-purple-500/40 hover:scrollbar-thumb-purple-500/60 scrollbar-track-transparent">
            {showSkeleton ? ( <> {[...Array(5)].map((_, i) => <TrackSkeleton key={`skel-${i}`} />)} </> )
             : showEmptyMessage ? ( <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 text-gray-500"><Music2 className="w-10 h-10 mb-3 text-gray-600"/><p className="font-medium">No tracks to display.</p><p className="text-sm">Try generating a playlist based on your mood.</p></div> )
             : (
                 tracks.map((track, idx) => {
                     // --- Create Search URL ---
                     // Combine name and artist for a better search query
                     const searchQuery = encodeURIComponent(`${track.name} ${track.artist}`);

                     // Option 1: YouTube Search URL
                     const searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

                     // Option 2: Spotify Search URL (Uncomment to use)
                     // const searchUrl = `https://open.spotify.com/search/${searchQuery}`;
                     // --------------------------

                     return (
                         <motion.div
                            key={track.name + idx}
                            className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg transition-colors duration-150 ease-in-out hover:bg-white/10 group" // Removed cursor-pointer here, handled by link
                            variants={itemVariants}
                         >
                             <img
                                src={track.artworkUrl}
                                alt={`${track.name} artwork`}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover shadow-sm flex-shrink-0 border border-white/10"
                                onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(track.name)}/150/150`; e.currentTarget.onerror = null; }}
                             />
                             <div className="flex-grow min-w-0">
                                <p className="font-semibold text-sm sm:text-base text-gray-100 truncate group-hover:text-white" title={track.name}>{track.name}</p>
                                <p className="text-xs sm:text-sm text-gray-400 truncate group-hover:text-gray-300" title={track.artist}>{track.artist}</p>
                             </div>

                             {/* --- Link styled as Button --- */}
                             <a
                                href={searchUrl}
                                target="_blank" // Open in new tab
                                rel="noopener noreferrer" // Security best practice
                                // Apply button-like styling and hover effects matching the previous button
                                className={cn(
                                    "inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", // Base button styles (from shadcn/ui defaults)
                                    "text-gray-400 hover:text-white hover:bg-white/15", // Ghost variant styles
                                    "h-9 w-9 sm:h-10 sm:w-10 p-0", // Icon size styles
                                    "flex-shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150" // Positioning and hover visibility
                                )}
                                aria-label={`Search for ${track.name} by ${track.artist}`} // Accessibility
                                onClick={(e) => e.stopPropagation()} // Prevent event bubbling if parent is clickable
                             >
                                 <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                                 <span className="sr-only">Play or search</span> {/* Screen reader text */}
                             </a>
                             {/* --- End of Link --- */}

                         </motion.div>
                     );
                 })
             )
           }
        </CardContent>
      </Card>
    </motion.div>
  );
};