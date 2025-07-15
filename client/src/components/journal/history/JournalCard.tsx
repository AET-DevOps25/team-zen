import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, Lightbulb, Zap } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { MOOD_CONFIG } from '../../../constants/moods';
import { AIInsights } from './AIInsights';
import type { ExtendedJournalEntry } from '@/lib/utils';
import { formatDate, getMoodValue, getRelativeDate } from '@/lib/utils';

interface JournalCardProps {
  journal: ExtendedJournalEntry;
  index: number;
  isInsightsExpanded: boolean;
  onToggleInsights: () => void;
}

export const JournalCard = ({
  journal,
  index,
  isInsightsExpanded,
  onToggleInsights,
}: JournalCardProps) => {
  const navigate = useNavigate();

  const handleViewJournal = () => {
    navigate({
      to: `/journal/${journal.id}`,
    });
  };

  return (
    <motion.div
      key={journal.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleViewJournal}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">
              {MOOD_CONFIG[getMoodValue(journal.dailyMood)].emoji}
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
                {!!journal.relevanceScore && (
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
      </div>

      {/* Content */}
      <div
        className="text-gray-700 mb-4 line-clamp-3"
        dangerouslySetInnerHTML={{
          __html: journal.highlightedContent || journal.summary || '',
        }}
      />

      {/* Stats and Tags */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <BookOpen className="w-3 h-3 mr-1" />
            {journal.summary?.split(' ').length || 0} words
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

      {/* AI Insights */}
      {journal.insights && (
        <AIInsights
          insights={journal.insights}
          isExpanded={isInsightsExpanded}
          onToggle={onToggleInsights}
        />
      )}
    </motion.div>
  );
};
