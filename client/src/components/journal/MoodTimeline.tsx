import { motion } from 'framer-motion';
import type { Snippet } from '@/model/snippet';

interface MoodTimelineProps {
  snippets: Array<Snippet>;
}

const MOOD_EMOJIS: Record<number, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '😊',
  5: '😄',
};

export const MoodTimeline = ({ snippets }: MoodTimelineProps) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Mood Timeline</h3>
      <div className="space-y-4">
        {snippets.length > 0 ? (
          snippets.map((snippet) => (
            <div key={snippet.id} className="flex items-center space-x-4">
              <div className="text-2xl">{MOOD_EMOJIS[snippet.mood]}</div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {formatTime(snippet.timestamp)}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(snippet.mood / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {snippet.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No mood data available yet.
          </p>
        )}
      </div>
    </motion.div>
  );
};
