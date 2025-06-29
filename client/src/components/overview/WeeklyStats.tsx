import { BarChart3, Calendar, Target, TrendingUp } from 'lucide-react';
import WeeklyMoodChart from './WeeklyMoodChart';
import WeeklyStatCard from './WeeklyStatCard';
import type { UserStatistics } from '@/api/journal';

interface WeeklyStatsProps {
  userStatistics: UserStatistics;
  weeklyMoodData: Array<{ day: string; mood: number; hasEntry: boolean }>;
}

const WeeklyStats = ({ userStatistics, weeklyMoodData }: WeeklyStatsProps) => {
  const journalProgress =
    ((userStatistics.weeklyJournalCount || 0) /
      (userStatistics.weeklyTarget || 7)) *
    100;
  const moodProgress = ((userStatistics.weeklyAvgMood || 0) / 5) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center mb-6">
        <Calendar className="w-6 h-6 text-teal-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-800">This Week</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column with stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeeklyStatCard
            title="Journal Entries"
            value={`${userStatistics.weeklyJournalCount || 0}/${userStatistics.weeklyTarget || 7}`}
            progress={journalProgress}
            icon={Target}
            gradientClass="bg-gradient-to-br from-teal-50 to-blue-50"
            iconColorClass="text-teal-500"
            progressColorClass="bg-teal-500"
          />

          <WeeklyStatCard
            title="Weekly Avg Mood"
            value={`${userStatistics.weeklyAvgMood.toFixed(1) || '0.0'}/5`}
            progress={moodProgress}
            icon={TrendingUp}
            gradientClass="bg-gradient-to-br from-green-50 to-emerald-50"
            iconColorClass="text-green-500"
            progressColorClass="bg-green-500"
          />

          <WeeklyStatCard
            title="Current Streak"
            value={`${userStatistics.currentStreak || 0} ${(userStatistics.currentStreak || 0) === 1 ? 'day' : 'days'}`}
            subtitle={
              (userStatistics.currentStreak || 0) > 0
                ? 'Keep it up! 🔥'
                : 'Start your streak today!'
            }
            icon={BarChart3}
            gradientClass="bg-gradient-to-br from-purple-50 to-pink-50"
            iconColorClass="text-purple-500"
            colSpan="md:col-span-2"
          />
        </div>

        {/* Right column with mood chart */}
        <WeeklyMoodChart weeklyMoodData={weeklyMoodData} />
      </div>
    </div>
  );
};

export default WeeklyStats;
