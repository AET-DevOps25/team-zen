import type { Mood } from '@/model/snippet';

const moodEmojis: Record<
  Mood,
  { emoji: string; label: string; color: string }
> = {
  1: { emoji: '😢', label: 'Very Low', color: 'text-red-500' },
  2: { emoji: '😔', label: 'Low', color: 'text-orange-500' },
  3: { emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
  4: { emoji: '😊', label: 'Good', color: 'text-green-500' },
  5: { emoji: '😄', label: 'Excellent', color: 'text-teal-500' },
};

const months = [
  { value: 'all', label: 'All Months' },
  { value: '2024-01', label: 'January 2024' },
  { value: '2023-12', label: 'December 2023' },
  { value: '2023-11', label: 'November 2023' },
];

export { moodEmojis, months };
