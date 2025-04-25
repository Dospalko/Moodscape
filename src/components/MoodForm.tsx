import React from 'react';
import { Input } from './ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
      <Textarea
        placeholder="Ako sa dnes cítiš?"
        value={mood}
        onChange={(e) => onMoodChange(e.target.value)}
        className="mb-4 rounded-md shadow-sm"
        rows={4}
      />
      <Button
        onClick={onSubmit}
        disabled={!mood || loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/80 rounded-md shadow-sm"
      >
        {loading ? 'Generujem...' : 'Generuj playlist'}
      </Button>
      {error && <p className="mt-2 text-destructive text-sm">{error}</p>}
    </div>
  );
};

