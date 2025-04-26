// src/App.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout'; // Upravený Layout
import { Header } from './components/Header'; // Upravený Header
import { ExplanationCard } from './components/ExplanationCard'; // Upravená ExplanationCard
import { MoodForm } from './components/MoodForm'; // Upravený MoodForm
import { Playlist } from './components/Playlist'; // Upravený Playlist
import { AnimatePresence, motion } from 'framer-motion'; // Pre animácie pri miznutí

// Definujeme Track interface (môže byť aj v zdieľanom súbore types.ts)
interface Track {
  name: string;
  artist: string;
  artworkUrl: string;
}

// Dummy playlist - viac variácií
const dummyPlaylist: Track[] = [
    { name: 'Echoes of Tranquility', artist: 'Etherea', artworkUrl: 'https://picsum.photos/seed/echo/150/150' },
    { name: 'Midnight Drive', artist: 'Synthwave Masters', artworkUrl: 'https://picsum.photos/seed/drive/150/150' },
    { name: 'Forest Awakening', artist: 'Nature\'s Resonance', artworkUrl: 'https://picsum.photos/seed/forest/150/150' },
    { name: 'City Lights Lullaby', artist: 'Urban Nocturnes', artworkUrl: 'https://picsum.photos/seed/city/150/150' },
    { name: 'Celestial Voyage', artist: 'Cosmic Drifters', artworkUrl: 'https://picsum.photos/seed/space/150/150' },
];

// --- Stub Mood Analysis Function ---
async function analyzeMoodFromText({ text }: { text: string }): Promise<{ mood: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulácia
    const lowerText = text.toLowerCase();
    if (lowerText.includes('happy') || lowerText.includes('joyful') || lowerText.includes('excited')) return { mood: 'Happy / Energetic' };
    if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('gloomy')) return { mood: 'Sad / Reflective' };
    if (lowerText.includes('calm') || lowerText.includes('relaxed') || lowerText.includes('peaceful')) return { mood: 'Calm / Relaxed' };
    if (lowerText.includes('stressed') || lowerText.includes('anxious') || lowerText.includes('worried')) return { mood: 'Stressed / Anxious' };
    if (lowerText.includes('angry') || lowerText.includes('frustrated')) return { mood: 'Angry / Intense' };
    return { mood: text.trim() ? 'Neutral / Focused' : 'Unknown' };
}

// --- Main App Component ---
export default function App() {
    const [moodText, setMoodText] = useState<string>('');
    const [analyzedMood, setAnalyzedMood] = useState<string>('');
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleAnalyzeMood = useCallback(async () => {
        setError('');
        setPlaylist([]); // Vymažeme starý playlist hneď
        setAnalyzedMood('');
        setLoading(true);

        try {
            const { mood } = await analyzeMoodFromText({ text: moodText });
            setAnalyzedMood(mood);
            setPlaylist(dummyPlaylist); // V reálnej appke fetch podľa mood
        } catch (err) {
            console.error('Chyba pri analyzovaní nálady:', err);
            setError('Nepodarilo sa analyzovať náladu. Skúste to prosím znova.');
        } finally {
            setLoading(false);
        }
    }, [moodText]);

    // Efekt na vyčistenie výsledkov, ak sa vymaže text
    useEffect(() => {
        if (!moodText.trim() && !loading) { // Pridaná podmienka !loading
            setAnalyzedMood('');
            setPlaylist([]);
            setError('');
        }
    }, [moodText, loading]);

    return (
        <Layout> {/* Použije upravený Layout pre pozadie a padding */}
            <Header className="mb-10 sm:mb-16" /> {/* Pridaný väčší margin */}

             {/* Hlavný obsah s kontrolovanou šírkou */}
            <main className="w-full flex flex-col items-center space-y-8 z-10">

                {/* Karta s vysvetlením - vždy viditeľná */}
                <ExplanationCard className="mb-6" />

                {/* Formulár pre náladu */}
                <MoodForm
                    mood={moodText}
                    onMoodChange={setMoodText}
                    onSubmit={handleAnalyzeMood}
                    loading={loading}
                    error={error}
                    className="w-full" // MoodForm si sám nastaví max-w-2xl
                />

                 {/* Sekcia výsledkov - Analyzovaná nálada (ak existuje) */}
                <AnimatePresence>
                    {analyzedMood && !loading && (
                        <motion.div
                            key="analyzedMood" // Kľúč pre AnimatePresence
                            className="w-full max-w-2xl text-center px-4 py-5 bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg rounded-xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                        >
                            <p className="text-sm uppercase text-gray-400 tracking-wider mb-1">Detected Vibe</p>
                            <p className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
                                {analyzedMood}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                 {/* Playlist (ak existuje) */}
                 <AnimatePresence>
                    {playlist.length > 0 && !loading && (
                        <Playlist
                            key="playlist" // Kľúč pre AnimatePresence
                            tracks={playlist}
                            analyzedMood={analyzedMood}
                            className="w-full" // Playlist si sám nastaví max-w-2xl
                        />
                    )}
                </AnimatePresence>
            </main>

            {/* Pätička */}
            <footer className="mt-auto pt-10 text-center text-gray-500 text-sm z-10">
                MoodTunes © {new Date().getFullYear()} - Concept Demo
            </footer>
        </Layout>
    );
}