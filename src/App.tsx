// src/App.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout'; // Predpokladám, že existuje a funguje
import { Header } from './components/Header'; // Predpokladám, že existuje a funguje
import { ExplanationCard } from './components/ExplanationCard'; // Predpokladám, že existuje a funguje
import { MoodForm } from './components/MoodForm'; // Tvoja MoodForm komponenta
// !!! DÔLEŽITÉ: Použijeme Playlist komponentu, ktorú si dodal. Možno budeš musieť pridať isLoading prop neskôr. !!!
import { Playlist, PlaylistProps } from './components/Playlist';
import { AnimatePresence, motion } from 'framer-motion';

// Interface pre Track (nezmenený, očakáva backend v tomto formáte)
interface Track {
  name: string;
  artist: string;
  artworkUrl: string; // Backend teraz pridá placeholder URL
}

// Interface pre očakávanú odpoveď z backendu
interface MusicDataResponse {
    mood: string;
    playlist: Track[];
}
// --- ZMENA: Prístup k env premennej cez import.meta.env ---
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
//                               ^^^^^^^^^^^^^^ ZMENENÉ TU
console.log(`Connecting to API at: ${API_BASE_URL}`);

// --- Funkcia na volanie backendu pre získanie nálady a playlistu ---
async function fetchMusicData(text: string): Promise<MusicDataResponse> {
    console.log(`Frontend: Sending text to backend for analysis & playlist: "${text}"`);
    try {
        // Voláme endpoint, ktorý používa len OpenAI
        const response = await fetch(`${API_BASE_URL}/api/generate-playlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });

        if (!response.ok) {
            let errorData = { error: `Request failed with status ${response.status}` };
            try {
                 errorData = await response.json();
            } catch (parseError) {
                 console.error("Frontend: Failed to parse error response from backend.");
                 throw new Error(response.statusText || errorData.error);
            }
            throw new Error(errorData?.error || `Request failed with status ${response.status}`);
        }

        const data: MusicDataResponse = await response.json();
        console.log("Frontend: Received music data from backend:", data);

        if (!data.playlist) {
            console.warn("Backend response is missing playlist data.");
            return { mood: data.mood || 'Neutral', playlist: [] };
        }
        return data; // Vrátime { mood, playlist }

    } catch (error) {
        console.error("Frontend: Error fetching music data from backend:", error);
        throw error;
    }
}

// --- Hlavná App Komponenta ---
export default function App() {
    const [moodText, setMoodText] = useState<string>('');
    const [analyzedMood, setAnalyzedMood] = useState<string>('');
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showResults, setShowResults] = useState<boolean>(false);


    // --- Callback na spracovanie odoslania formulára ---
    const handleAnalyzeMood = useCallback(async () => {
        if (!moodText.trim()) return; // Ignoruj prázdny vstup

        setError('');
        setShowResults(true); // Zobraz sekciu výsledkov hneď (pre loading state)
        setPlaylist([]);      // Vyčisti starý playlist
        setAnalyzedMood('');  // Vyčisti starú náladu
        setLoading(true);     // Aktivuj loading state

        try {
            // Zavolaj funkciu, ktorá komunikuje s backendom
            const { mood, playlist: fetchedPlaylist } = await fetchMusicData(moodText);

            // Aktualizuj stav s dátami z backendu
            setAnalyzedMood(mood);
            setPlaylist(fetchedPlaylist || []); // Použi reálny playlist z backendu

        } catch (err) {
            // Spracovanie chyby
            console.error('Frontend: Error in handleAnalyzeMood callback:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred while generating playlist.');
            setShowResults(false); // Skry výsledky pri chybe
        } finally {
            // Ukonči loading state bez ohľadu na výsledok
            setLoading(false);
        }
    }, [moodText]); // Funkcia závisí od moodText

    // Efekt na skrytie výsledkov pri vymazaní textu
    useEffect(() => {
        if (!moodText.trim() && !loading) {
           setShowResults(false);
             setTimeout(() => { // Malé oneskorenie pre plynulú animáciu
               setAnalyzedMood('');
               setPlaylist([]);
               setError('');
             }, 300);
        }
    }, [moodText, loading]);

    // --- Renderovanie komponenty ---
    return (
        // Používame tvoje existujúce Layout, Header, atď.
        <Layout>
            <Header />

            <main className="flex-grow flex flex-col lg:flex-row gap-6 sm:gap-8 p-4 sm:p-6 pb-6 sm:pb-10 w-full max-w-[1600px] mx-auto min-h-0 z-10">

                 {/* Ľavý Stĺpec */}
                <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-2/5 xl:w-1/3 flex-shrink-0">
                     {/* Vysvetlenie - ak ho máš, zobrazí sa */}
                     { typeof ExplanationCard !== 'undefined' && <ExplanationCard /> }

                     {/* Tvoja MoodForm komponenta */}
                     <MoodForm
                        mood={moodText}
                        onMoodChange={setMoodText}
                        onSubmit={handleAnalyzeMood} // Používa useCallback definovaný vyššie
                        loading={loading}
                        error={error && !showResults ? error : undefined}
                    />
                    {/* Medzera pre lepšie rozloženie na mobile */}
                    <div className="flex-grow lg:hidden"></div>
                </div>

                 {/* Pravý Stĺpec */}
                <div className="flex flex-col flex-grow min-w-0">
                    <AnimatePresence>
                         {/* Zobrazí sa len ak showResults je true */}
                         {showResults && (
                             <motion.div
                                className="flex flex-col flex-grow min-h-0"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                            >
                                {/* Tvoja Playlist komponenta */}
                                {/* Pre správne zobrazenie skeleton loadera by si mal do Playlist pridať `isLoading` prop */}
                                <Playlist
                                     // Príklad pridania isLoading (musíš implementovať v Playlist.tsx)
                                     // isLoading={loading && playlist.length === 0}
                                     tracks={playlist}
                                     analyzedMood={analyzedMood}
                                     // Predanie className pre prípadnú úpravu štýlu z App
                                     // className="nejake-dodatocne-triedy"
                                />
                            </motion.div>
                          )}
                    </AnimatePresence>
                    {/* Placeholder alebo chybová správa, ak výsledky nie sú zobrazené */}
                    {!showResults && !error && (
                         <div className="flex-grow flex items-center justify-center text-center bg-black/10 border border-white/10 rounded-xl backdrop-blur-sm p-6">
                             <p className="text-gray-400">Enter your mood, and your personalized playlist suggestions will appear here.</p>
                         </div>
                     )}
                     {error && !showResults && (
                          <div className="flex-grow flex items-center justify-center text-center bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm p-6">
                             <p className="text-red-400">{error}</p>
                         </div>
                     )}
                </div>
            </main>
             {/* Footer môžeš pridať, ak je definovaný */}
             {/* {typeof Footer !== 'undefined' && <Footer />} */}
        </Layout>
    );
}