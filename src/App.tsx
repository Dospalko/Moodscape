import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { ExplanationCard } from './components/ExplanationCard';
import { MoodForm } from './components/MoodForm';
import { Playlist } from './components/Playlist';
import { AnimatePresence, motion } from 'framer-motion';

interface Track {
  name: string;
  artist: string;
  artworkUrl: string;
}

const dummyPlaylist: Track[] = [
    { name: 'Echoes of Tranquility', artist: 'Etherea', artworkUrl: 'https://picsum.photos/seed/echo/150/150' },
    { name: 'Midnight Drive', artist: 'Synthwave Masters', artworkUrl: 'https://picsum.photos/seed/drive/150/150' },
    { name: 'Forest Awakening', artist: 'Nature\'s Resonance', artworkUrl: 'https://picsum.photos/seed/forest/150/150' },
    { name: 'City Lights Lullaby', artist: 'Urban Nocturnes', artworkUrl: 'https://picsum.photos/seed/city/150/150' },
    { name: 'Celestial Voyage', artist: 'Cosmic Drifters', artworkUrl: 'https://picsum.photos/seed/space/150/150' },
    { name: 'Sunrise Groove', artist: 'Solar Beats', artworkUrl: 'https://picsum.photos/seed/sun/150/150' },
    { name: 'Rainy Day Blues', artist: 'Azure Moods', artworkUrl: 'https://picsum.photos/seed/rain/150/150' },
];

async function analyzeMoodFromText({ text }: { text: string }): Promise<{ mood: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const lowerText = text.toLowerCase();
    if (lowerText.includes('happy') || lowerText.includes('joyful') || lowerText.includes('excited')) return { mood: 'Happy / Energetic' };
    if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('gloomy')) return { mood: 'Sad / Reflective' };
    if (lowerText.includes('calm') || lowerText.includes('relaxed') || lowerText.includes('peaceful')) return { mood: 'Calm / Relaxed' };
    if (lowerText.includes('stressed') || lowerText.includes('anxious') || lowerText.includes('worried')) return { mood: 'Stressed / Anxious' };
    if (lowerText.includes('angry') || lowerText.includes('frustrated')) return { mood: 'Angry / Intense' };
    return { mood: text.trim() ? 'Neutral / Focused' : 'Unknown' };
}

export default function App() {
    const [moodText, setMoodText] = useState<string>('');
    const [analyzedMood, setAnalyzedMood] = useState<string>('');
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showResults, setShowResults] = useState<boolean>(false);


    const handleAnalyzeMood = useCallback(async () => {
        setError('');
        setShowResults(true); // Show the result area immediately (for loading state)
        setPlaylist([]); // Clear previous playlist visual immediately
        setAnalyzedMood(''); // Clear previous mood visual immediately
        setLoading(true);

        try {
            const { mood } = await analyzeMoodFromText({ text: moodText });
            setAnalyzedMood(mood);
            // Simulate dynamic playlist based on mood length for variety
            const playlistSize = mood.length % 5 + 3; // 3 to 7 tracks
            setPlaylist(dummyPlaylist.slice(0, playlistSize));
        } catch (err) {
            console.error('Analysis error:', err);
            setError('Could not analyze mood. Please try again.');
            setShowResults(false); // Hide result area on error
        } finally {
            setLoading(false);
        }
    }, [moodText]);

    useEffect(() => {
        // Hide results if input is cleared and not loading
        if (!moodText.trim() && !loading) {
           setShowResults(false);
            // Optionally small delay to allow animations
             setTimeout(() => {
               setAnalyzedMood('');
               setPlaylist([]);
               setError('');
             }, 300);
        }
    }, [moodText, loading]);

    return (
        <Layout>
            <Header />

            {/* Main content takes remaining height and uses flex */}
            <main className="flex-grow flex flex-col lg:flex-row gap-6 sm:gap-8 p-4 sm:p-6 pb-6 sm:pb-10 w-full max-w-[1600px] mx-auto min-h-0 z-10"> {/* Added min-h-0 */}

                 {/* Left Column (Input Area) */}
                <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-2/5 xl:w-1/3 flex-shrink-0">
                     <ExplanationCard />
                     <MoodForm
                        mood={moodText}
                        onMoodChange={setMoodText}
                        onSubmit={handleAnalyzeMood}
                        loading={loading}
                        error={error && !showResults ? error : ''} // Show form error only if results are hidden
                    />
                     {/* Spacer to push footer down if content is short */}
                    <div className="flex-grow lg:hidden"></div>
                </div>

                 {/* Right Column (Output Area) */}
                <div className="flex flex-col flex-grow min-w-0"> {/* Added min-w-0 */}
                    <AnimatePresence>
                         {showResults && (
                             <motion.div
                                className="flex flex-col flex-grow min-h-0" // Container for playlist, needs flex properties
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Playlist
                                    isLoading={loading}
                                    tracks={playlist}
                                    analyzedMood={analyzedMood}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Placeholder if results are not shown */}
                    {!showResults && !error && (
                         <div className="flex-grow flex items-center justify-center text-center bg-black/10 border border-white/10 rounded-xl backdrop-blur-sm">
                             <p className="text-gray-400 px-6">Your personalized playlist will appear here.</p>
                         </div>
                     )}
                     {/* Show general error here if results area hidden due to error */}
                     {error && !showResults && (
                          <div className="flex-grow flex items-center justify-center text-center bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                             <p className="text-red-400 px-6">{error}</p>
                         </div>
                     )}
                </div>
            </main>

            {/* Footer is outside main, Layout handles positioning */}
            {/* <footer className="py-3 text-center text-gray-500 text-xs z-10 flex-shrink-0">
                 MoodTunes © {new Date().getFullYear()}
            </footer> */}
        </Layout>
    );
}