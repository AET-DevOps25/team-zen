import { motion } from 'framer-motion';
import { BarChart3, BookOpen, MessageSquare, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { mockJournals } from '@/mock/data';

const Overview = () => {
  const stats = useMemo(() => {
    const totalJournals = mockJournals.length;
    const totalWords = mockJournals.reduce(
      (sum, journal) => sum + journal.wordCount,
      0,
    );
    const avgMood = (
      mockJournals.reduce((sum, journal) => sum + journal.mood, 0) /
      totalJournals
    ).toFixed(1);
    const avgWordsPerJournal = Math.round(totalWords / totalJournals);

    return { totalJournals, totalWords, avgMood, avgWordsPerJournal };
  }, []);
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
    </div>
  );
};

export default Overview;
