import { useMemo, useState } from 'react';
import type { ExtendedJournalEntry } from '@/lib/utils';
import { getMoodValue, sortJournals } from '@/lib/utils';

export const useJournalFilters = (
  journals: Array<ExtendedJournalEntry>,
  searchQuery: string,
  searchResults: Array<ExtendedJournalEntry>,
) => {
  const [selectedMood, setSelectedMood] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filteredJournals = useMemo(() => {
    if (journals.length === 0) {
      return [];
    }

    // If searching and have results, return search results
    if (searchQuery && searchResults.length >= 0) {
      return searchResults;
    }

    let filtered = journals;

    // Apply traditional filters when not searching
    if (!searchQuery) {
      if (selectedMood !== 'all') {
        filtered = filtered.filter(
          (journal) =>
            getMoodValue(journal.dailyMood) === Number.parseInt(selectedMood),
        );
      }

      if (selectedMonth !== 'all') {
        filtered = filtered.filter((journal) =>
          journal.date.startsWith(selectedMonth),
        );
      }

      // Apply sorting
      filtered = sortJournals(filtered, sortBy);
    }

    return filtered;
  }, [
    journals,
    searchQuery,
    searchResults,
    selectedMood,
    selectedMonth,
    sortBy,
  ]);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return {
    selectedMood,
    setSelectedMood,
    selectedMonth,
    setSelectedMonth,
    sortBy,
    setSortBy,
    showFilters,
    toggleFilters,
    filteredJournals,
  };
};
