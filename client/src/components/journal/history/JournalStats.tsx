import { motion } from 'framer-motion';
import { BarChart3, BookOpen, MessageSquare, TrendingUp } from 'lucide-react';

interface JournalStatsProps {
  totalJournals: number;
  totalWords: number;
  avgMood: string;
  avgWordsPerJournal: number;
}

export const JournalStats = ({
  totalJournals,
  totalWords,
  avgMood,
  avgWordsPerJournal,
}: JournalStatsProps) => {
  const stats = [
    {
      value: totalJournals,
      label: 'Total Journals',
      icon: BookOpen,
      color: 'text-teal-600',
      iconColor: 'text-teal-500',
    },
    {
      value: totalWords.toLocaleString(),
      label: 'Total Words',
      icon: MessageSquare,
      color: 'text-blue-600',
      iconColor: 'text-blue-500',
    },
    {
      value: `${avgMood}/5`,
      label: 'Avg Mood',
      icon: TrendingUp,
      color: 'text-green-600',
      iconColor: 'text-green-500',
    },
    {
      value: avgWordsPerJournal,
      label: 'Avg Length',
      icon: BarChart3,
      color: 'text-purple-600',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
