import { motion } from 'framer-motion';
import type { Snippet } from '@/model/snippet';

interface QuickStatsProps {
  snippets: Array<Snippet>;
  journalContent: string;
  isLoading?: boolean;
  averageMood?: string;
  currentStreak?: number;
  statsLoading?: boolean;
}

export const QuickStats = ({ snippets, journalContent }: QuickStatsProps) => {
  const calculateAverageMood = () => {
    if (snippets.length === 0) return 'N/A';
    const average =
      snippets.reduce((sum, snippet) => sum + snippet.mood, 0) /
      snippets.length;
    return average.toFixed(1);
  };

  const getWordCount = () => {
    return journalContent.trim() ? journalContent.split(/\s+/).length : 0;
  };

  const statsData = [
    { label: 'Snippets', value: snippets.length },
    { label: 'Avg Mood', value: calculateAverageMood() },
    { label: 'Word Count', value: getWordCount() },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
      <div className="space-y-3">
        {statsData.map((stat) => (
          <div key={stat.label} className="flex justify-between">
            <span className="text-gray-600">{stat.label}</span>
            <span className="font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
