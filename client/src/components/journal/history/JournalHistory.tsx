import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { EmptyState } from './EmptyState';
import { JournalCard } from './JournalCard';
import { SearchInterface } from './SearchInterface';
import type { ExtendedJournalEntry } from '@/lib/utils';
import { useGetAllJournals } from '@/api/journal';
import { useJournalFilters, useJournalSearch } from '@/hooks';

const JournalHistory = () => {
  const [expandedInsights, setExpandedInsights] = useState<
    Record<string, boolean>
  >({});

  const { journals: journalsData, isLoading } = useGetAllJournals();

  const journals = useMemo((): Array<ExtendedJournalEntry> => {
    if (isLoading || journalsData.length === 0) return [];

    const transformedJournals = journalsData.map((journal) => ({
      ...journal,
      snippetCount: journal.snippetIds.length || 0,
      relevanceScore: 0,
    }));

    return transformedJournals;
  }, [journalsData, isLoading]);

  const { searchQuery, searchResults, isSearching, setSearchQuery } =
    useJournalSearch(journals);

  const {
    selectedMood,
    setSelectedMood,
    selectedMonth,
    setSelectedMonth,
    sortBy,
    setSortBy,
    showFilters,
    toggleFilters,
    filteredJournals,
  } = useJournalFilters(journals, searchQuery, searchResults);

  // Toggle insights expansion for a specific journal
  const toggleInsights = (journalId: string) => {
    setExpandedInsights((prev) => ({
      ...prev,
      [journalId]: !prev[journalId],
    }));
  };

  return (
    <div className="space-y-8">
      <SearchInterface
        searchQuery={searchQuery}
        isSearching={isSearching}
        showFilters={showFilters}
        selectedMood={selectedMood}
        selectedMonth={selectedMonth}
        sortBy={sortBy}
        filteredJournalsLength={filteredJournals.length}
        journals={journals}
        onSearchChange={setSearchQuery}
        onToggleFilters={toggleFilters}
        onMoodChange={setSelectedMood}
        onMonthChange={setSelectedMonth}
        onSortChange={setSortBy}
      />

      <div className="space-y-6">
        {filteredJournals.length === 0 ? (
          <EmptyState hasSearchQuery={!!searchQuery} />
        ) : (
          <AnimatePresence>
            {filteredJournals.map((journal, index) => (
              <JournalCard
                key={journal.id}
                journal={journal}
                index={index}
                isInsightsExpanded={expandedInsights[journal.id] || false}
                onToggleInsights={() => toggleInsights(journal.id)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default JournalHistory;
