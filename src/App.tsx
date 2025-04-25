// src/App.tsx
import { useState } from 'react'
// Framer Motion import
import { motion } from 'framer-motion'

export default function App() {
  // Stav pre náladu z inputu
  const [mood, setMood] = useState('')
  // Stav pre výsledný playlist
  const [playlist, setPlaylist] = useState<string[]>([])

  // Funkcia na načítanie playlistu
  async function generatePlaylist() {
    // TODO: zavolať backend /api/sentiment a potom /api/playlist
    console.log('Generujem pre náladu:', mood)
    // Demo náhodných trackov
    setPlaylist(['Track A', 'Track B', 'Track C'])
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Moodscape</h1>
        <p className="text-gray-600">Vyber si náladu a nechaj hudbu rozprávať za teba</p>
      </header>

      {/* Vstup nálady */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Ako sa dnes cítiš?"
          value={mood}
          onChange={e => setMood(e.target.value)}
          className="w-full border rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Button onClick={generatePlaylist} disabled={!mood}>
          Generuj playlist
        </Button>
      </motion.div>

      {/* Zobrazenie playlistu */}
      {playlist.length > 0 && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-2 w-full max-w-md"
        >
          {playlist.map((track, i) => (
            <li key={i} className="p-4 bg-white rounded shadow">
              {track}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}
