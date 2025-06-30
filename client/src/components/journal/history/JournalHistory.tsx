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

  // Fetch all journals using the query hook
  const { journals: journalsData, isLoading } = useGetAllJournals();

  // Transform journals data to include extended properties
  const journals = useMemo((): Array<ExtendedJournalEntry> => {
    if (isLoading || journalsData.length === 0) return [];

    return journalsData.map((journal) => ({
      ...journal,
      snippetCount: journal.snippetIds.length || 0,
      relevanceScore: 0,
    }));
  }, [journalsData, isLoading]);

  // Search functionality
  const { searchQuery, searchResults, isSearching, setSearchQuery } =
    useJournalSearch(journals);


  // Filter functionality
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
      {/* Search Interface */}
      <SearchInterface
        searchQuery={searchQuery}
        isSearching={isSearching}
        showFilters={showFilters}
        selectedMood={selectedMood}
        selectedMonth={selectedMonth}
        sortBy={sortBy}
        filteredJournalsLength={filteredJournals.length}
        onSearchChange={setSearchQuery}
        onToggleFilters={toggleFilters}
        onMoodChange={setSelectedMood}
        onMonthChange={setSelectedMonth}
        onSortChange={setSortBy}
      />

      {/* Journal Results */}
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
