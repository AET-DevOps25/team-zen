import { motion } from 'framer-motion';
import { Heart, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { MoodTimeline } from './MoodTimeline';
import { ThemesAndTags } from './ThemesAndTags';
import type { LucideIcon } from 'lucide-react';
import type { Snippet } from '@/model/snippet';

interface InsightsTabProps {
  snippets: Array<Snippet>;
}

export const InsightsTab = ({ snippets }: InsightsTabProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <AiInsights />
        <MoodTimeline snippets={snippets} />
        <ThemesAndTags snippets={snippets} />
      </motion.div>
    </div>
  );
};

interface AiInsight {
  type: string;
  icon: LucideIcon;
  title: string;
  content: string;
  color: string;
}

const AI_INSIGHTS: Array<AiInsight> = [
  {
    type: 'pattern',
    icon: TrendingUp,
    title: 'Mood Pattern',
    content:
      'Your mood improved throughout the day, with the highest point after your lunch break walk.',
    color: 'text-green-600 bg-green-50',
  },
  {
    type: 'suggestion',
    icon: Lightbulb,
    title: 'Suggestion',
    content:
      'Consider scheduling more outdoor activities during work breaks to maintain positive momentum.',
    color: 'text-yellow-600 bg-yellow-50',
  },
  {
    type: 'achievement',
    icon: Target,
    title: 'Achievement',
    content:
      'You successfully identified and addressed work stress through mindful reflection.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    type: 'wellness',
    icon: Heart,
    title: 'Wellness Tip',
    content:
      'Your entries show strong emotional awareness. This is a key indicator of mental wellness growth.',
    color: 'text-purple-600 bg-purple-50',
  },
];

export const AiInsights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {AI_INSIGHTS.map((insight, index) => (
        <motion.div
          key={insight.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 rounded-2xl border ${insight.color}`}
        >
          <div className="flex items-start space-x-3">
            <insight.icon className="w-6 h-6 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">{insight.title}</h3>
              <p className="text-sm opacity-80">{insight.content}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
