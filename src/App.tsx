// src/App.tsx

import React, { useState } from 'react'
import axios from 'axios'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Input } from './components/ui/input'
import { motion } from 'framer-motion'

/**
 * App komponenta pre Moodscape:
 * • Zadanie nálady
 * • Sentiment analýza cez backend
 * • Zobrazenie generovaného playlistu
 */
const App: React.FC = () => {
  // Stav pre text z inputu (náladu)
  const [mood, setMood] = useState<string>('')
  // Stav pre výsledný playlist (zoznam trackov)
  const [playlist, setPlaylist] = useState<string[]>([])
  // Stav pre loading a prípadnú chybu
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  /**
   * generatePlaylist:
   * 1) POST /api/sentiment { text: mood } → { mood: detectedMood }
   * 2) GET  /api/playlist?mood=detectedMood → [ 'Track A', ... ]
   * 3) Uloženie do stavu alebo zachytenie chyby
   */
  const generatePlaylist = async () => {
    try {
      setLoading(true)
      setError('')

      // 1) Sentiment analýza zadanej nálady
      const { data: sentimentRes } = await axios.post<{ mood: string }>(
        '/api/sentiment',
        { text: mood }
      )
      const detectedMood = sentimentRes.mood

      // 2) Získanie playlistu podľa zistenej nálady
      const { data: playlistRes } = await axios.get<string[]>('/api/playlist', {
        params: { mood: detectedMood },
      })

      setPlaylist(playlistRes)
    } catch (e) {
      console.error('Chyba pri generovaní playlistu:', e)
      setError('Nepodarilo sa načítať playlist. Skús to znova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Header s animáciou */}
      <header className="mb-8 text-center">
        <motion.h1
          className="text-4xl font-bold"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          Moodscape
        </motion.h1>
        <p className="text-gray-600">
          Vyber si náladu a nechaj hudbu rozprávať za teba
        </p>
      </header>

      {/* Sekcia pre zadanie nálady */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Input
          placeholder="Ako sa dnes cítiš?"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="mb-4"
        />

        <Button
          onClick={generatePlaylist}
          disabled={!mood || loading}
          className="w-full"
          variant="default"
        >
          {loading ? 'Generujem...' : 'Generuj playlist'}
        </Button>

        {error && <p className="mt-2 text-red-600">{error}</p>}
      </motion.div>

      {/* Zobrazenie playlistu */}
      {playlist.length > 0 && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-4 w-full max-w-md"
        >
          {playlist.map((track, idx) => (
            <Card key={idx}>{track}</Card>
          ))}
        </motion.ul>
      )}
    </div>
  )
}

export default App
