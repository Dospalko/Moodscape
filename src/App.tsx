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

interface Track {
  name: string;
  artist: string;
  artworkUrl: string;
}

// Dummy playlist na zobrazenie
const dummyPlaylist: Track[] = [
  { name: 'Song 1', artist: 'Artist A', artworkUrl: 'https://picsum.photos/100/100' },
  { name: 'Song 2', artist: 'Artist B', artworkUrl: 'https://picsum.photos/100/100' },
  { name: 'Song 3', artist: 'Artist C', artworkUrl: 'https://picsum.photos/100/100' },
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
    setLoading(true);
    try {
      const { mood } = await analyzeMoodFromText({ text: moodText });
      setAnalyzedMood(mood);
      // pre demo: použijeme dummyPlaylist
      setPlaylist(dummyPlaylist);
    } catch (err) {
      console.error('Chyba pri analyzovaní nálady:', err);
      setError('Nepodarilo sa analyzovať náladu.');
    } finally {
      setLoading(false);
    }
  }, [moodText]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-24 px-4 bg-secondary">
      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
        MoodTunes – Music for Your Soul
      </h1>

      {/* Vstupná karta pre náladu */}
      <Card className="w-full max-w-md mb-6">
        <CardHeader>
          <CardTitle>Enter Your Mood</CardTitle>
          <CardDescription>Describe how you're feeling.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="I'm feeling..."
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
          />
          <Button
            onClick={handleAnalyzeMood}
            disabled={!moodText || loading}
            className="w-full"
          >
            {loading ? 'Analyzing...' : 'Analyze Mood'}
          </Button>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {/* Zobrazenie analyzovanej nálady */}
      {analyzedMood && (
        <Card className="w-full max-w-md mb-6">
          <CardHeader>
            <CardTitle>Analyzed Mood</CardTitle>
            <CardDescription>Based on your input.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-teal-500">{analyzedMood}</p>
          </CardContent>
        </Card>
      )}

      {/* Zobrazenie playlistu */}
      {playlist.length > 0 && (
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Personalized Playlist</CardTitle>
            <CardDescription>Curated for your current mood.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {playlist.map((track, idx) => (
                <li key={idx} className="flex items-center space-x-4">
                  <img
                    src={track.artworkUrl}
                    alt={track.name}
                    className="w-16 h-16 rounded-md shadow"
                  />
                  <div>
                    <p className="font-semibold text-lg">{track.name}</p>
                    <p className="text-muted-foreground">{track.artist}</p>
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
