// src/components/ExplanationCard.tsx
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card'; // Predpokladám, že UI komponenty sú tu
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Uisti sa, že cesta je správna

export function ExplanationCard({ className }: { className?: string }) { // Pridané className
  return (
    <motion.div // Wrapneme do motion.div pre animáciu
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className={cn(
        "w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden",
        className // Umožní predať mb-8 atď. z App.tsx
        )}>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-100">
            How MoodTunes Works
          </CardTitle>
          <CardDescription className="text-gray-400">
            Turning your feelings into the perfect soundtrack.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-300"> {/* Svetlejší text pre čitateľnosť */}
          <p>
            Feeling happy, stressed, or somewhere in between? Simply describe your
            current mood in the input box below.
          </p>
          <p>
            Our (future) intelligent system analyzes the sentiment and nuances of
            your text to understand how you're feeling.
          </p>
          <p>
            Based on the detected mood, MoodTunes curates a personalized playlist
            designed to resonate with, enhance, or soothe your current state of
            mind. Give it a try!
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}