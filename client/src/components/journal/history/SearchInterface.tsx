import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Filter, Search, Sparkles } from 'lucide-react';
import { MOOD_OPTIONS } from '../../../constants/moods';
import { months } from '@/mock/data';

interface SearchInterfaceProps {
  searchQuery: string;
  isSearching: boolean;
  showFilters: boolean;
  selectedMood: string;
  selectedMonth: string;
  sortBy: string;
  filteredJournalsLength: number;
  onSearchChange: (query: string) => void;
  onToggleFilters: () => void;
  onMoodChange: (mood: string) => void;
  onMonthChange: (month: string) => void;
  onSortChange: (sort: string) => void;
}

const suggestedQueries = [
  'work',
  'family',
  'exercise',
  'happy',
  'stressful',
  'achievement',
  'goals',
];

export const SearchInterface = ({
  searchQuery,
  isSearching,
  showFilters,
  selectedMood,
  selectedMonth,
  sortBy,
  filteredJournalsLength,
  onSearchChange,
  onToggleFilters,
  onMoodChange,
  onMonthChange,
  onSortChange,
}: SearchInterfaceProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          Search Journals
        </h3>
        <motion.button
          onClick={onToggleFilters}
          className={`p-2 rounded-lg transition-colors ${
            showFilters
              ? 'bg-teal-100 text-teal-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search your journals by title, content, or tags..."
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 placeholder-gray-400"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          </div>
        )}
      </div>

      {/* Suggested Queries */}
      {!searchQuery && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, index) => (
              <motion.button
                key={index}
                onClick={() => onSearchChange(query)}
                className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {query}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center text-purple-700">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Found {filteredJournalsLength} journal
              {filteredJournalsLength !== 1 ? 's' : ''} matching "{searchQuery}"
            </span>
          </div>
        </div>
      )}

      {/* Traditional Filters */}
      <AnimatePresence>
        {showFilters && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 overflow-hidden"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood
              </label>
              <select
                value={selectedMood}
                onChange={(e) => onMoodChange(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Moods</option>
                {MOOD_OPTIONS.slice()
                  .reverse()
                  .map((mood) => (
                    <option key={mood.value} value={mood.value.toString()}>
                      {mood.emoji} {mood.label} ({mood.value})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Months</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mood-high">Highest Mood</option>
                <option value="mood-low">Lowest Mood</option>
                <option value="longest">Longest First</option>
                <option value="shortest">Shortest First</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
