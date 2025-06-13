interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: number;
  snippetIds: Array<string>;
  insights?: Array<string>;
  wordCount?: number;
  tags?: Array<string>;
  keyStrategies?: Array<string>;
}
