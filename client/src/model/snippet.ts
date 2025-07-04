type Snippet = {
  id: number;
  content: string;
  mood: Mood;
  tags: Array<string>;
  timestamp: string;
  insights?: string;
  userId: string;
  journalEntryId?: string;
  updatedAt?: string;
};

enum Mood {
  VeryLow = 1,
  Low = 2,
  Neutral = 3,
  Good = 4,
  Excellent = 5,
}

export { Mood };
export type { Snippet };
export const suggestedTags = [
  'work',
  'personal',
  'health',
  'relationships',
  'goals',
  'gratitude',
  'stress',
  'achievement',
];
