// src/components/MoodForm.tsx
import React from 'react';
import { Input, Button } from './ui';

export interface MoodFormProps {
  mood: string;
  onMoodChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error?: string;
}

/**
 * MoodForm komponenta spravuje input pre náladu a tlačidlo na odoslanie.
 */
export const MoodForm: React.FC<MoodFormProps> = ({
  mood,
  onMoodChange,
  onSubmit,
  loading,
  error
}) => {
  return (
    <div className="w-full">
      <Input
        placeholder="Ako sa dnes cítiš?"
        value={mood}
        onChange={(e) => onMoodChange(e.target.value)}
        className="mb-4"
      />
      <Button
        onClick={onSubmit}
        disabled={!mood || loading}
        className="w-full"
      >
        {loading ? 'Generujem...' : 'Generuj playlist'}
      </Button>
      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
};
