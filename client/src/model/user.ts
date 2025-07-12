export interface UserStatistics {
  // Overall statistics
  totalJournals: number;
  totalWords: number;
  avgMood: number;

  // Weekly statistics
  weeklyJournalCount: number;
  weeklyAvgMood: number;
  weeklyTarget: number;

  // Streak statistics
  currentStreak: number;
}
