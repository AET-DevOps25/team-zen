import { motion } from 'framer-motion';
import { BlendIcon, Heart, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { InsightCard } from './InsightCard';
import { MoodTimeline } from './MoodTimeline';
import { ThemesAndTags } from './ThemesAndTags';
import type { LucideIcon } from 'lucide-react';
import type { JournalEntry } from '@/model/journal';
import type { Snippet } from '@/model/snippet';

interface InsightsTabProps {
  snippets: Array<Snippet>;
  journal?: JournalEntry;
}

export const InsightsTab = ({ snippets, journal }: InsightsTabProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl border bg-blue-50 text-blue-600`}
        >
          <div className="flex items-start space-x-3">
            <BlendIcon className="size-6 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Overall Analysis</h3>
              <p className="text-sm opacity-80 max-w-4xl">
                {journal?.insights?.analysis || 'No analysis available yet.'}
              </p>
            </div>
          </div>
        </motion.div>
        <AiInsights journal={journal} />
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

interface AiInsightsProps {
  journal?: JournalEntry;
}

export const AiInsights = ({ journal }: AiInsightsProps) => {
  const insights: Array<AiInsight> = [
    {
      type: 'pattern',
      icon: TrendingUp,
      title: 'Mood Pattern',
      content:
        journal?.insights?.moodPattern ||
        'No mood pattern analysis available yet.',
      color: 'text-green-600 bg-green-50',
    },
    {
      type: 'suggestion',
      icon: Lightbulb,
      title: 'Suggestion',
      content: journal?.insights?.suggestion || 'No suggestions available yet.',
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      type: 'achievement',
      icon: Target,
      title: 'Achievement',
      content:
        journal?.insights?.achievement || 'No achievements identified yet.',
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      type: 'wellness',
      icon: Heart,
      title: 'Wellness Tip',
      content:
        journal?.insights?.wellnessTip || 'No wellness tips available yet.',
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {insights.map((insight, index) => (
        <InsightCard
          key={insight.type}
          type={insight.type}
          icon={insight.icon}
          title={insight.title}
          content={insight.content}
          color={insight.color}
          index={index}
        />
      ))}
    </div>
  );
};
