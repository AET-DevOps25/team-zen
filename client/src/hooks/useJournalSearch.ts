import { useCallback, useEffect, useState } from 'react';
import type { ExtendedJournalEntry } from '@/lib/utils';
import {
  calculateBasicRelevanceScore,
  highlightText,
  journalMatchesQuery,
} from '@/lib/utils';

export const useJournalSearch = (journals: Array<ExtendedJournalEntry>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<ExtendedJournalEntry>
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim() || query.trim().length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);

      // Simulate API delay and perform basic text search
      setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        const queryWords = lowerQuery
          .split(' ')
          .filter((word) => word.length > 2);

        let results = journals.filter((journal) =>
          journalMatchesQuery(journal, query),
        );

        // Add basic highlighting and relevance scoring
        results = results.map((journal) => ({
          ...journal,
          highlightedContent: highlightText(journal.summary || '', queryWords),
          highlightedTitle: highlightText(journal.title, queryWords),
          relevanceScore: calculateBasicRelevanceScore(journal, query),
        }));

        // Sort by relevance
        results.sort(
          (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0),
        );

        setSearchResults(results);
        setIsSearching(false);
      }, 300);
    },
    [journals],
  );

  useEffect(() => {
    if (searchQuery.trim() && searchQuery.trim().length >= 3) {
      performSearch(searchQuery);
    }
  }, [journals, searchQuery, performSearch]);

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim() && query.trim().length >= 3) {
        performSearch(query);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    },
    [performSearch],
  );

  return {
    searchQuery,
    searchResults,
    isSearching,
    setSearchQuery: handleSearchChange,
  };
};
