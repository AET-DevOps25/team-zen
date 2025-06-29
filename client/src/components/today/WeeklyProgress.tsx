import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import type { UserStatistics } from '@/api/journal';

interface WeeklyProgressProps {
  userStats?: UserStatistics;
  statsLoading: boolean;
}

export const WeeklyProgress = ({
  userStats,
  statsLoading,
}: WeeklyProgressProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
        This Week
      </h3>
      {statsLoading ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Loading...</span>
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Loading...</span>
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Loading...</span>
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Entries</span>
            <span className="font-semibold">
              {userStats?.weeklyJournalCount ?? 0}/
              {userStats?.weeklyTarget ?? 7}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Avg Mood</span>
            <span className="font-semibold">
              {userStats?.weeklyAvgMood
                ? userStats.weeklyAvgMood.toFixed(1)
                : '0.0'}
              /5
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Streak</span>
            <span className="font-semibold text-teal-600">
              {userStats?.currentStreak ?? 0} days
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
