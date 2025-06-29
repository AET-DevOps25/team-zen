import { motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  Calendar,
  Flame,
  MessageSquare,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useGetUserStatistics } from '@/api/journal';

const Overview = () => {
  const { data: userStatistics, isLoading, error } = useGetUserStatistics();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">
            Failed to load statistics. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-teal-600">
                {userStatistics?.totalJournals || 0}
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
                {userStatistics?.totalWords.toLocaleString() || 0}
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
                {userStatistics?.avgMood.toFixed(1) || '0.0'}/5
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
                {userStatistics?.currentStreak || 0}
              </p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
            <Flame className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Weekly Statistics Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 text-teal-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-800">This Week</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Journal Entries</p>
                <p className="text-2xl font-bold text-teal-600">
                  {userStatistics?.weeklyJournalCount || 0}/
                  {userStatistics?.weeklyTarget || 7}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(((userStatistics?.weeklyJournalCount || 0) / (userStatistics?.weeklyTarget || 7)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <Target className="w-8 h-8 text-teal-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Weekly Avg Mood</p>
                <p className="text-2xl font-bold text-green-600">
                  {userStatistics?.weeklyAvgMood?.toFixed(1) || '0.0'}/5
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${((userStatistics?.weeklyAvgMood || 0) / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-purple-600">
                  {userStatistics?.currentStreak || 0}{' '}
                  {(userStatistics?.currentStreak || 0) === 1 ? 'day' : 'days'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(userStatistics?.currentStreak || 0) > 0
                    ? 'Keep it up! 🔥'
                    : 'Start your streak today!'}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
