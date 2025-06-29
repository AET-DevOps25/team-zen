import { BookOpen, Flame, MessageSquare, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';
import type { UserStatistics } from '@/api/journal';

interface OverallStatsProps {
  userStatistics: UserStatistics;
}

const OverallStats = ({ userStatistics }: OverallStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <StatCard
      title="Total Journals"
      value={userStatistics.totalJournals || 0}
      icon={BookOpen}
      colorClass="text-teal-600"
      iconColorClass="text-teal-500"
      delay={0}
    />
    <StatCard
      title="Total Words"
      value={userStatistics.totalWords.toLocaleString() || 0}
      icon={MessageSquare}
      colorClass="text-blue-600"
      iconColorClass="text-blue-500"
      delay={0.1}
    />
    <StatCard
      title="Avg Mood"
      value={`${userStatistics.avgMood.toFixed(1) || '0.0'}/5`}
      icon={TrendingUp}
      colorClass="text-green-600"
      iconColorClass="text-green-500"
      delay={0.2}
    />
    <StatCard
      title="Day Streak"
      value={userStatistics.currentStreak || 0}
      icon={Flame}
      colorClass="text-purple-600"
      iconColorClass="text-purple-500"
      delay={0.3}
    />
  </div>
);

export default OverallStats;
