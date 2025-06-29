import { motion } from 'framer-motion';
import { Brain, Clock } from 'lucide-react';
import { MOOD_OPTIONS } from '../../constants/moods';
import type { Snippet } from '@/model/snippet';

interface SnippetCardProps {
  snippet: Snippet;
  index: number;
}

export const SnippetCard = ({ snippet, index }: SnippetCardProps) => {
  return (
    <motion.div
      key={snippet.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-50 rounded-lg p-4 border-l-4 border-teal-400"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {MOOD_OPTIONS.find((m) => m.value === snippet.mood)?.emoji}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(snippet.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
      <p className="text-gray-700 mb-2">{snippet.content}</p>
      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {snippet.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {snippet.insights && (
        <div className="bg-teal-50 rounded-md p-2 flex items-center">
          <Brain className="w-4 h-4 text-teal-600 mr-2" />
          <span className="text-sm text-teal-700">{snippet.insights}</span>
        </div>
      )}
    </motion.div>
  );
};
