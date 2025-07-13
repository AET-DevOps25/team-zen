import { Heart, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { InsightCard } from '../journal/InsightCard';
import type { LucideIcon } from 'lucide-react';
import type { JournalEntry } from '@/model/journal';

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
