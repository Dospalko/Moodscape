// src/components/ExplanationCard.tsx
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card'; // Assuming your ui components are here

export function ExplanationCard() {
  return (
    <Card className="w-full max-w-lg mb-8 bg-white/80 backdrop-blur-sm shadow-md border border-gray-200/50">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">
          How MoodTunes Works
        </CardTitle>
        <CardDescription className="text-gray-600">
          Turning your feelings into the perfect soundtrack.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-gray-700">
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
  );
}