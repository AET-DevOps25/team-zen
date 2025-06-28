import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { Snippet } from '@/model/snippet';

interface SnippetsOverviewProps {
  snippets: Array<Snippet>;
}

const MOOD_EMOJIS: Record<number, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '😊',
  5: '😄',
};

export const SnippetsOverview = ({ snippets }: SnippetsOverviewProps) => {
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
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Today's Snippets</h3>
      <div className="space-y-3">
        {snippets.length > 0 ? (
          snippets.map((snippet) => (
            <div key={snippet.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{MOOD_EMOJIS[snippet.mood]}</span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(snippet.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {snippet.content}
              </p>
              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {snippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No snippets for today yet.
          </p>
        )}
      </div>
    </motion.div>
  );
};
