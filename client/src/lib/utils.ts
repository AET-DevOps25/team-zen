import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';
import type { Mood } from '@/model/snippet';
import type { JournalEntry } from '@/model/journal';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

// Journal-related interfaces and types
export interface ExtendedJournalEntry extends JournalEntry {
  highlightedContent?: string;
  highlightedTitle?: string;
  relevanceScore?: number;
  snippetCount?: number;
}

// Utility function to convert dailyMood to valid Mood enum value
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

// Calculate relevance score for search results
export const calculateBasicRelevanceScore = (
  journal: ExtendedJournalEntry,
  query: string,
): number => {
  let score = 0;
  const lowerQuery = query.toLowerCase();

  const safeStringMatch = (value: string | null | undefined): boolean => {
    return (
      value != null &&
      typeof value === 'string' &&
      value.toLowerCase().includes(lowerQuery)
    );
  };

  if (safeStringMatch(journal.title)) score += 3;

  if (safeStringMatch(journal.summary)) score += 2;

  if (journal.tags?.some((tag) => safeStringMatch(tag))) score += 2;

  // Insights match
  if (safeStringMatch(journal.insights?.analysis)) score += 1;
  if (safeStringMatch(journal.insights?.moodPattern)) score += 1;
  if (safeStringMatch(journal.insights?.suggestion)) score += 1;
  if (safeStringMatch(journal.insights?.achievement)) score += 1;
  if (safeStringMatch(journal.insights?.wellnessTip)) score += 1;

  return score;
};

export const journalMatchesQuery = (
  journal: JournalEntry,
  query: string,
): boolean => {
  const lowerQuery = query.toLowerCase();

  const safeStringMatch = (value: string | null | undefined): boolean => {
    return (
      value != null &&
      typeof value === 'string' &&
      value.toLowerCase().includes(lowerQuery)
    );
  };

  const titleMatch = safeStringMatch(journal.title);
  const summaryMatch = safeStringMatch(journal.summary);
  const analysisMatch = safeStringMatch(journal.insights?.analysis);
  const moodPatternMatch = safeStringMatch(journal.insights?.moodPattern);
  const suggestionMatch = safeStringMatch(journal.insights?.suggestion);
  const achievementMatch = safeStringMatch(journal.insights?.achievement);
  const wellnessTipMatch = safeStringMatch(journal.insights?.wellnessTip);
  const tagsMatch = journal.tags?.some((tag) => safeStringMatch(tag)) ?? false;

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
