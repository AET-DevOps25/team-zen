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

  // Title match gets higher score
  if (journal.title.toLowerCase().includes(lowerQuery)) score += 3;

  // Summary match
  if (journal.summary?.toLowerCase().includes(lowerQuery)) score += 2;

  // Tags match
  if (journal.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)))
    score += 2;

  // Insights match
  if (journal.insights?.analysis?.toLowerCase().includes(lowerQuery))
    score += 1;
  if (journal.insights?.moodPattern?.toLowerCase().includes(lowerQuery))
    score += 1;
  if (journal.insights?.suggestion?.toLowerCase().includes(lowerQuery))
    score += 1;
  if (journal.insights?.achievement?.toLowerCase().includes(lowerQuery))
    score += 1;
  if (journal.insights?.wellnessTip?.toLowerCase().includes(lowerQuery))
    score += 1;

  return score;
};

// Check if journal matches search query
export const journalMatchesQuery = (
  journal: JournalEntry,
  query: string,
): boolean => {
  const lowerQuery = query.toLowerCase();

  return (
    journal.title.toLowerCase().includes(lowerQuery) ||
    (journal.summary?.toLowerCase().includes(lowerQuery) ?? false) ||
    (journal.insights?.analysis?.toLowerCase().includes(lowerQuery) ?? false) ||
    (journal.insights?.moodPattern?.toLowerCase().includes(lowerQuery) ??
      false) ||
    (journal.insights?.suggestion?.toLowerCase().includes(lowerQuery) ??
      false) ||
    (journal.insights?.achievement?.toLowerCase().includes(lowerQuery) ??
      false) ||
    (journal.insights?.wellnessTip?.toLowerCase().includes(lowerQuery) ??
      false) ||
    (journal.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ??
      false)
  );
};

// Date formatting utilities
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

// Sort journals by different criteria
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
