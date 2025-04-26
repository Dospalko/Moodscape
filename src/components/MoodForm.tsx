// src/components/MoodForm.tsx
import React from 'react';
import { Input } from './ui/input'; // Ak by si chcel input
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Music } from 'lucide-react'; // Pridané ikony
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Uisti sa, že cesta je správna

export interface MoodFormProps {
  mood: string;
  onMoodChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string;
  className?: string; // Pridané pre flexibilitu
}

/**
 * MoodForm komponenta - upravená pre tmavý režim a glassmorphism.
 */
export const MoodForm: React.FC<MoodFormProps> = ({
  mood,
  onMoodChange,
  onSubmit,
  loading,
  error,
  className
}) => {
  return (
    <motion.div // Wrapnuté pre animáciu
      className={cn("w-full max-w-2xl", className)} // Ovládanie šírky tu alebo v App.tsx
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
       {/* Pridaný wrapper s glassmorphism štýlom */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl rounded-xl p-6 space-y-5">
         <Textarea
          placeholder="e.g., energetic and ready to go, winding down after work..."
          value={mood}
          onChange={(e) => onMoodChange(e.target.value)}
          className="w-full text-base bg-white/10 border-white/20 placeholder-gray-500 text-gray-100 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-transparent px-4 py-3 min-h-[100px]" // Zvýšená min výška
          rows={4}
          disabled={loading}
        />
        <Button
          onClick={onSubmit}
          disabled={!mood.trim() || loading} // Použijeme trim() pre validáciu
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 text-lg rounded-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing Mood...</span>
            </>
          ) : (
            <>
              <Music className="h-5 w-5" />
              <span>Generate Playlist</span>
            </>
          )}
        </Button>
        {error && <p className="mt-2 text-red-400 text-sm text-center">{error}</p>} {/* Zmenená farba chyby */}
      </div>
    </motion.div>
  );
};