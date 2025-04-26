// src/App.tsx
import React, { useState, useCallback } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/ui/card';
import { ExplanationCard } from './components/ExplanationCard'; // Import the new component
import { Loader2 } from 'lucide-react'; // Optional: for a nicer loading spinner

interface Track {
  name: string;
  artist: string;
  artworkUrl: string;
}

// Dummy playlist na zobrazenie
const dummyPlaylist: Track[] = [
  { name: 'Serenity Now', artist: 'Calm Collective', artworkUrl: 'https://picsum.photos/seed/calm/100/100' },
  { name: 'Quietude', artist: 'Ambient Sphere', artworkUrl: 'https://picsum.photos/seed/peace/100/100' },
  { name: 'Mindful Moment', artist: 'Zenith Beats', artworkUrl: 'https://picsum.photos/seed/zen/100/100' },
];

/**
 * Jednoduchá stub funkcia na analýzu nálady z textu.
 * Nahradíš ju neskôr volaním na AI flow alebo backend.
 */
async function analyzeMoodFromText({
  text,
}: {
  text: string;
}): Promise<{ mood: string }> {
  // Simulácia API volania
  await new Promise(resolve => setTimeout(resolve, 1000));
  // zatiaľ len echo vstupu
  return { mood: text.trim() || 'neutral' };
}

export default function App() {
  const [moodText, setMoodText] = useState<string>('');
  const [analyzedMood, setAnalyzedMood] = useState<string>('');
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyzeMood = useCallback(async () => {
    setError('');
    setPlaylist([]); // Clear previous playlist
    setAnalyzedMood(''); // Clear previous mood
    setLoading(true);
    try {
      const { mood } = await analyzeMoodFromText({ text: moodText });
      setAnalyzedMood(mood);
      // pre demo: použijeme dummyPlaylist - maybe vary based on mood later?
      setPlaylist(dummyPlaylist);
    } catch (err) {
      console.error('Chyba pri analyzovaní nálady:', err);
      setError('Nepodarilo sa analyzovať náladu. Skúste to prosím znova.');
    } finally {
      setLoading(false);
    }
  }, [moodText]);

  return (
    // Applied gradient background and improved padding/layout
    <div className="flex flex-col items-center justify-start min-h-screen py-16 px-4 bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 text-gray-800">
      {/* Updated title styling */}
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-10 text-center">
        MoodTunes – Music for Your Soul
      </h1>

      {/* Explanation Card Added */}
      <ExplanationCard />

      {/* Mood Input Card - Adjusted styling */}
      <Card className="w-full max-w-md mb-8 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Enter Your Mood</CardTitle>
          <CardDescription>Describe how you're feeling right now.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="e.g., feeling relaxed after a long day..."
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
            className="text-base" // Ensure readable text size
            disabled={loading}
          />
          <Button
            onClick={handleAnalyzeMood}
            disabled={!moodText.trim() || loading}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-3 transition-all duration-300 ease-in-out disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Generate Playlist' // Changed button text
            )}
          </Button>
          {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}
        </CardContent>
      </Card>

      {/* Analyzed Mood Display - Enhanced styling */}
      {analyzedMood && !loading && (
        <Card className="w-full max-w-md mb-8 shadow-md bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Detected Mood</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Use a more prominent style for the mood */}
            <p className="text-2xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 py-2">
              {analyzedMood}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Playlist Display - Improved list item styling */}
      {playlist.length > 0 && !loading && (
        <Card className="w-full max-w-lg shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Your Mood Playlist</CardTitle>
            <CardDescription>Curated tracks based on your feeling.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-5">
              {playlist.map((track, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100/50"
                >
                  <img
                    src={`${track.artworkUrl}?${idx}`} // Add index to URL query to ensure different images from picsum seed
                    alt={`${track.name} artwork`}
                    className="w-16 h-16 rounded-md shadow-sm object-cover flex-shrink-0" // Added object-cover
                  />
                  <div className="flex-grow min-w-0"> {/* Added min-w-0 for text truncation if needed */}
                    <p className="font-semibold text-lg truncate text-gray-800">{track.name}</p>
                    <p className="text-sm text-gray-500 truncate">{track.artist}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}