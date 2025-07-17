import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';
import type { Mood } from '@/model/snippet';
import type { JournalEntry } from '@/model/journal';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export interface ExtendedJournalEntry extends JournalEntry {
  highlightedContent?: string;
  highlightedTitle?: string;
  relevanceScore?: number;
  snippetCount?: number;
}

export const getMoodValue = (dailyMood: number | undefined): Mood => {
  if (!dailyMood || dailyMood < 1 || dailyMood > 5) {
    return 3 as Mood; // Default to neutral for out-of-range values
  }
  return Math.floor(dailyMood) as Mood;
};

export const highlightText = (
  text: string,
  keywords: Array<string>,
): string => {
  if (!keywords.length) return text;

  let highlightedText = text;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlightedText = highlightedText.replace(
      regex,
      '<mark class="bg-yellow-200 px-1 rounded">$1</mark>',
    );
  });
  return highlightedText;
};

const safeStringMatch = (
  value: string | null | undefined,
  query: string,
): boolean => {
  return (
    value != null &&
    typeof value === 'string' &&
    value.toLowerCase().includes(query.toLowerCase())
  );
};

export const calculateBasicRelevanceScore = (
  journal: ExtendedJournalEntry,
  query: string,
): number => {
  let score = 0;

  if (safeStringMatch(journal.title, query)) score += 3;

  if (safeStringMatch(journal.summary, query)) score += 2;

  if (journal.tags?.some((tag) => safeStringMatch(tag, query))) score += 2;

  if (safeStringMatch(journal.insights?.analysis, query)) score += 1;
  if (safeStringMatch(journal.insights?.moodPattern, query)) score += 1;
  if (safeStringMatch(journal.insights?.suggestion, query)) score += 1;
  if (safeStringMatch(journal.insights?.achievement, query)) score += 1;
  if (safeStringMatch(journal.insights?.wellnessTip, query)) score += 1;

  return score;
};

export const journalMatchesQuery = (
  journal: JournalEntry,
  query: string,
): boolean => {
  const titleMatch = safeStringMatch(journal.title, query);
  const summaryMatch = safeStringMatch(journal.summary, query);
  const analysisMatch = safeStringMatch(journal.insights?.analysis, query);
  const moodPatternMatch = safeStringMatch(
    journal.insights?.moodPattern,
    query,
  );
  const suggestionMatch = safeStringMatch(journal.insights?.suggestion, query);
  const achievementMatch = safeStringMatch(
    journal.insights?.achievement,
    query,
  );
  const wellnessTipMatch = safeStringMatch(
    journal.insights?.wellnessTip,
    query,
  );
  const tagsMatch =
    journal.tags?.some((tag) => safeStringMatch(tag, query)) ?? false;

  const matches =
    titleMatch ||
    summaryMatch ||
    analysisMatch ||
    moodPatternMatch ||
    suggestionMatch ||
    achievementMatch ||
    wellnessTipMatch ||
    tagsMatch;

  return matches;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export const sortJournals = (
  journals: Array<ExtendedJournalEntry>,
  sortBy: string,
): Array<ExtendedJournalEntry> => {
  return [...journals].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'mood-high':
        return getMoodValue(b.dailyMood) - getMoodValue(a.dailyMood);
      case 'mood-low':
        return getMoodValue(a.dailyMood) - getMoodValue(b.dailyMood);
      case 'longest':
        return (b.summary?.length || 0) - (a.summary?.length || 0);
      case 'shortest':
        return (a.summary?.length || 0) - (b.summary?.length || 0);
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
};
