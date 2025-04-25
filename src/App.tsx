// src/App.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { MoodForm } from './components/MoodForm';
import { Playlist } from './components/Playlist';

/**
 * Hlavná App komponenta skladá Layout, Header, MoodForm a Playlist.
 */
const App: React.FC = () => {
  const [mood, setMood] = useState<string>('');
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const generatePlaylist = async () => {
    try {
      setLoading(true);
      setError('');
      const { data: sentimentRes } = await axios.post<{ mood: string }>(
        '/api/sentiment',
        { text: mood }
      );
      const detectedMood = sentimentRes.mood;
      const { data: playlistRes } = await axios.get<string[]>('/api/playlist', {
        params: { mood: detectedMood },
      });
      setPlaylist(playlistRes);
    } catch (e) {
      console.error(e);
      setError('Nepodarilo sa načítať playlist. Skús to znova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header />
      <MoodForm
        mood={mood}
        onMoodChange={setMood}
        onSubmit={generatePlaylist}
        loading={loading}
        error={error}
      />
      {playlist.length > 0 && <Playlist tracks={playlist} />}
    </Layout>
  );
};

export default App;
