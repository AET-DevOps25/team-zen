import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { MOOD_OPTIONS } from '../../constants/moods';
import type { Snippet } from '@/model/snippet';

interface MoodTrackerProps {
  snippets: Array<Snippet>;
  todaysMood: number;
}

export const MoodTracker = ({ snippets, todaysMood }: MoodTrackerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <Heart className="w-5 h-5 mr-2 text-red-500" />
        Mood Tracker
      </h3>
      <div className="space-y-3">
        {MOOD_OPTIONS.map((mood) => (
          <div key={mood.value} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{mood.emoji}</span>
              <span className="text-sm text-gray-600">{mood.label}</span>
            </div>
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${mood.value <= todaysMood ? 'bg-teal-500' : 'bg-gray-200'}`}
                style={{
                  width: `${(snippets.filter((s) => s.mood === mood.value).length / Math.max(snippets.length, 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
