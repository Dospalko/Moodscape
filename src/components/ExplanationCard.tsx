// src/components/ExplanationCard.tsx
import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import { cn } from '@/lib/utils';
import { Music, Sun, Cloud, Heart } from 'lucide-react';

/**
 * Motion variants for staggered list items
 */
const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/**
 * ExplanationCard komponenta:
 * - Vysvetľuje používateľovi, ako MoodTunes funguje
 * - Používa Framer Motion pre plynulé animácie
 * - Ikony ilustrujú jednotlivé kroky
 */
export function ExplanationCard({ className }: { className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={listVariants}
      className={cn('w-full max-w-2xl', className)}
    >
      <Card className="bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-extrabold text-white">
            How MoodTunes Works
          </CardTitle>
          <CardDescription className="text-gray-300">
            We translate your feelings into the perfect playlist in just a few steps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4 text-gray-200">
          <motion.ul variants={listVariants} className="space-y-4">
            {/* Step 1 */}
            <motion.li
              variants={itemVariants}
              className="flex items-start space-x-3"
            >
              <Sun className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-semibold text-white">
                  1. Describe Your Mood
                </h4>
                <p className="text-sm">
                  Type how you’re feeling – happy, calm, excited, or anything in
                  between. Our intuitive input adapts to any emotion.
                </p>
              </div>
            </motion.li>

            {/* Step 2 */}
            <motion.li
              variants={itemVariants}
              className="flex items-start space-x-3"
            >
              <Cloud className="w-6 h-6 text-blue-300 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-semibold text-white">
                  2. AI Mood Analysis
                </h4>
                <p className="text-sm">
                  Under the hood, a powerful AI analyzes the sentiment and nuances
                  of your text to capture the true essence of your mood.
                </p>
              </div>
            </motion.li>

            {/* Step 3 */}
            <motion.li
              variants={itemVariants}
              className="flex items-start space-x-3"
            >
              <Music className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-semibold text-white">
                  3. Curate Your Playlist
                </h4>
                <p className="text-sm">
                  Based on the detected mood, MoodTunes crafts a bespoke playlist
                  to uplift, soothe, or energize you – every track handpicked.
                </p>
              </div>
            </motion.li>

            {/* Step 4 */}
            <motion.li
              variants={itemVariants}
              className="flex items-start space-x-3"
            >
              <Heart className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-semibold text-white">
                  4. Enjoy & Save
                </h4>
                <p className="text-sm">
                  Listen, groove, and save your favorite playlists. Revisit them
                  anytime to match or change your vibe.
                </p>
              </div>
            </motion.li>
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
