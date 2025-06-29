export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  dailyMood: number;
  snippetIds: Array<string>;
  insights?: Insights;
  wordCount?: number;
  tags?: Array<string>;
  keyStrategies?: Array<string>;
  summary?: string;
}

export interface Insights {
  analysis?: string;
  moodPattern?: string;
  suggestion?: string;
  achievement?: string;
  wellnessTip?: string;
}
