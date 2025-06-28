import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Eye,
  Filter,
  Lightbulb,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import type { Mood } from '@/model/snippet';
import type { JournalEntry as Journal } from '@/model/journal';
import { months, moodEmojis } from '@/mock/data';
import { useGetAllJournals } from '@/api/journal.ts';

export interface JournalEntry extends Journal {
  highlightedContent?: string;
  highlightedTitle?: string;
  relevanceScore?: number;
  snippetCount?: number;
}

interface SearchFilters {
  moods: Array<Mood>;
  topics: Array<string>;
  timeRange: string | null;
  keywords: Array<string>;
}

const JournalHistory = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<JournalEntry>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [journals, setJournals] = useState<Array<JournalEntry>>([]);
  const { mutateAsync: getAllJournals } = useGetAllJournals();

  const navigate = useNavigate();

  // NLP-powered search function
  const processNaturalLanguageQuery = (query: string): SearchFilters => {
    const lowerQuery = query.toLowerCase();

    // Extract mood-related keywords
    const moodKeywords = {
      happy: [5, 4],
      sad: [1, 2],
      stressed: [2, 3],
      good: [4, 5],
      bad: [1, 2],
      positive: [4, 5],
      negative: [1, 2],
      excited: [5],
      anxious: [2, 3],
      calm: [4, 5],
      overwhelmed: [2, 3],
      grateful: [4, 5],
      frustrated: [2, 3],
    };

    // Extract topic keywords
    const topicKeywords = {
      work: ['work', 'job', 'project', 'deadline', 'meeting', 'tasks'],
      family: ['family', 'children', 'kids', 'parents', 'spouse'],
      exercise: ['exercise', 'workout', 'fitness', 'walk', 'hiking', 'gym'],
      health: ['health', 'wellness', 'medical', 'doctor'],
      relationships: ['relationship', 'friend', 'love', 'partner'],
      creativity: ['creative', 'art', 'painting', 'writing', 'music'],
      learning: ['learning', 'book', 'reading', 'study', 'education'],
      nature: ['nature', 'outdoors', 'park', 'lake', 'hiking', 'weather'],
    };

    const filters = {
      moods: [] as Array<Mood>,
      topics: [] as Array<string>,
      timeRange: null as string | null,
      keywords: [] as Array<string>,
    };

    // Process mood filters
    Object.entries(moodKeywords).forEach(([keyword, moods]) => {
      if (lowerQuery.includes(keyword)) {
        filters.moods = [...filters.moods, ...moods];
      }
    });

    // Process topic filters
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
        filters.topics.push(topic);
      }
    });

    // Extract general keywords for highlighting
    const words = lowerQuery
      .split(' ')
      .filter(
        (word) =>
          word.length > 2 &&
          ![
            'the',
            'and',
            'or',
            'but',
            'in',
            'on',
            'at',
            'to',
            'for',
            'of',
            'with',
            'by',
            'about',
            'when',
            'where',
            'what',
            'how',
            'show',
            'find',
            'get',
            'me',
            'my',
            'i',
            'was',
            'were',
            'did',
            'entries',
            'journals',
          ].includes(word),
      );
    filters.keywords = words;

    return filters;
  };

  useEffect(() => {
    if (user) {
      const fetchJournals = async () => {
        try {
          const data = await getAllJournals();
          // TODO: Use journals instead of mock journals
          setJournals(data);
        } catch (error) {
          console.error('Failed to fetch journals:', error);
        }
      };

      fetchJournals();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log('search query', searchQuery);
      console.log(`${journals.length} journals`, journals);
    }
  }, [journals, searchQuery]);

  // Highlight matching text
  const highlightText = (text: string, keywords: Array<string>) => {
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

  // Smart search with NLP
  const performSmartSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    setTimeout(() => {
      const filters = processNaturalLanguageQuery(query);
      let results = journals;

      // Apply mood filters
      if (filters.moods.length > 0) {
        results = results.filter((journal) =>
          filters.moods.includes(journal.mood),
        );
      }

      // Apply topic filters
      if (filters.topics.length > 0) {
        results = results.filter(
          (journal) =>
            filters.topics.some((topic) => journal.tags?.includes(topic)) ||
            filters.topics.some((topic) =>
              journal.content.toLowerCase().includes(topic),
            ),
        );
      }

      // Apply keyword search
      if (filters.keywords.length > 0) {
        results = results.filter((journal) =>
          filters.keywords.some(
            (keyword) =>
              journal.content.toLowerCase().includes(keyword) ||
              journal.title.toLowerCase().includes(keyword) ||
              journal.tags?.some((tag) => tag.toLowerCase().includes(keyword)),
          ),
        );
      }

      // Add relevance scoring and highlighting
      results = results.map((journal) => ({
        ...journal,
        highlightedContent: highlightText(journal.content, filters.keywords),
        highlightedTitle: highlightText(journal.title, filters.keywords),
        relevanceScore: calculateRelevanceScore(journal, filters),
      }));

      // Sort by relevance
      results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const calculateRelevanceScore = (
    journal: JournalEntry,
    filters: SearchFilters,
  ): number => {
    let score = 0;

    // Mood match
    if (filters.moods.includes(journal.mood)) score += 3;

    // Topic match
    filters.topics.forEach((topic: string) => {
      if (journal.tags?.includes(topic)) score += 2;
      if (journal.content.toLowerCase().includes(topic)) score += 1;
    });

    // Keyword match
    filters.keywords.forEach((keyword: string) => {
      const content = journal.content.toLowerCase();
      const title = journal.title.toLowerCase();
      if (title.includes(keyword)) score += 3;
      if (content.includes(keyword)) score += 1;
    });

    return score;
  };

  const filteredJournals = useMemo(() => {
    if (journals.length === 0) {
      return [];
    }
    console.log('filtered journals', journals);
    if (searchQuery && searchResults.length > 0) {
      return searchResults;
    }

    let filtered = journals;

    // Apply traditional filters when not using smart search
    if (!searchQuery) {
      if (selectedMood !== 'all') {
        filtered = filtered.filter(
          (journal) => journal.mood === Number.parseInt(selectedMood),
        );
      }

      if (selectedMonth !== 'all') {
        filtered = filtered.filter((journal) =>
          journal.date.startsWith(selectedMonth),
        );
      }

      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case 'oldest':
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case 'mood-high':
            return b.mood - a.mood;
          case 'mood-low':
            return a.mood - b.mood;
          case 'longest':
            return (b.wordCount || 0) - (a.wordCount || 0);
          case 'shortest':
            return (a.wordCount || 0) - (b.wordCount || 0);
          default:
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
    }

    return filtered;
  }, [searchQuery, searchResults, selectedMood, selectedMonth, sortBy]);

  const stats = useMemo(() => {
    const totalJournals = journals.length;
    const totalWords = journals.reduce(
      (sum, journal) => sum + (journal.wordCount || 0),
      0,
    );
    const avgMood = (
      journals.reduce((sum, journal) => sum + journal.mood, 0) / totalJournals
    ).toFixed(1);
    const avgWordsPerJournal = Math.round(totalWords / totalJournals);

    return { totalJournals, totalWords, avgMood, avgWordsPerJournal };
  }, [journals]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRelativeDate = (dateString: string) => {
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

  // Suggested queries for NLP search
  const suggestedQueries = [
    'Show me entries when I felt stressed about work',
    'Find journals where I mentioned exercise',
    'What did I write about family time?',
    'Show me my happiest moments',
    'Find entries about creative projects',
    'When did I feel overwhelmed?',
    'Show me gratitude entries',
  ];

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-teal-600">
                {stats.totalJournals}
              </p>
              <p className="text-sm text-gray-600">Total Journals</p>
            </div>
            <BookOpen className="w-8 h-8 text-teal-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalWords.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Words</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.avgMood}/5
              </p>
              <p className="text-sm text-gray-600">Avg Mood</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {stats.avgWordsPerJournal}
              </p>
              <p className="text-sm text-gray-600">Avg Length</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Smart Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            AI-Powered Search
          </h3>
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim()) {
                performSmartSearch(e.target.value);
              } else {
                setSearchResults([]);
              }
            }}
            placeholder="Ask me anything about your journals... (e.g., 'Show me entries when I felt stressed about work')"
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
            <p className="text-sm text-gray-600 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.slice(0, 4).map((query, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setSearchQuery(query);
                    performSmartSearch(query);
                  }}
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
                Found {filteredJournals.length} journal
                {filteredJournals.length !== 1 ? 's' : ''} matching your query
                {searchResults.length > 0 && ' with AI-powered insights'}
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
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">All Moods</option>
                  {Object.entries(moodEmojis).map(([value, mood]) => (
                    <option key={value} value={value}>
                      {mood.emoji} {mood.label}
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
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
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
                  onChange={(e) => setSortBy(e.target.value)}
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

      {/* Journal Results */}
      <div className="space-y-6">
        {filteredJournals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center"
          >
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchQuery ? 'No matching journals found' : 'No journals found'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try rephrasing your question or using different keywords'
                : 'Try adjusting your search or filter criteria'}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredJournals.map((journal, index) => (
              <motion.div
                key={journal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">
                        {moodEmojis[journal.mood as Mood].emoji}
                      </span>
                      <div>
                        <h3
                          className="text-lg font-semibold text-gray-800"
                          dangerouslySetInnerHTML={{
                            __html: journal.highlightedTitle || journal.title,
                          }}
                        />
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(journal.date)}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>{getRelativeDate(journal.date)}</span>
                          {journal.relevanceScore && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="flex items-center text-purple-600">
                                <Zap className="w-3 h-3 mr-1" />
                                {journal.relevanceScore} relevance
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() =>
                      navigate({
                        to: `/journal/${journal.id}`,
                      })
                    }
                    className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                </div>

                <div
                  className="text-gray-700 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: journal.highlightedContent || journal.content,
                  }}
                />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {journal.wordCount} words
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {journal.snippetCount} snippets
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {journal.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {journal.tags && journal.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{journal.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Strategies */}
                {journal.keyStrategies && journal.keyStrategies.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm text-blue-700 mb-2">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Key Strategies from this entry
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {journal.keyStrategies.map((strategy, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {strategy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {journal.insights && journal.insights.length > 0 && (
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <div className="flex items-center text-sm text-teal-700 mb-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      AI Insights
                    </div>
                    <ul className="text-xs text-teal-600 space-y-1">
                      {journal.insights.slice(0, 2).map((insight, i) => (
                        <li key={i}>• {insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default JournalHistory;
