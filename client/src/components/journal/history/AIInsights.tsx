import { AnimatePresence, motion } from 'framer-motion';
import {
  BlendIcon,
  ChevronDown,
  ChevronUp,
  Heart,
  Lightbulb,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { Insights } from '@/model/journal';
import { Button } from '@/components/ui/button';

interface AIInsightsProps {
  insights: Insights;
  isExpanded: boolean;
  onToggle: () => void;
}

export const AIInsights = ({
  insights,
  isExpanded,
  onToggle,
}: AIInsightsProps) => {
  const insightItems = [
    {
      key: 'analysis',
      label: 'Analysis',
      value: insights.analysis,
      icon: BlendIcon,
      color: 'text-blue-600',
    },
    {
      key: 'moodPattern',
      label: 'Mood Pattern',
      value: insights.moodPattern,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      key: 'suggestion',
      label: 'Suggestion',
      value: insights.suggestion,
      icon: Lightbulb,
      color: 'text-yellow-600',
    },
    {
      key: 'achievement',
      label: 'Achievement',
      value: insights.achievement,
      icon: Target,
      color: 'text-cyan-600',
    },
    {
      key: 'wellnessTip',
      label: 'Wellness Tip',
      value: insights.wellnessTip,
      icon: Heart,
      color: 'text-purple-600',
    },
  ].filter((item) => item.value);

  return (
    <div className="bg-teal-50 rounded-lg">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between text-sm text-teal-700 hover:bg-teal-100 rounded-lg"
      >
        <div className="flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          AI Insights
        </div>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
              opacity: { duration: 0.2 },
            }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">
              <div className="text-xs text-teal-600 space-y-3">
                {insightItems.map((item) => (
                  <div key={item.key} className="flex items-start space-x-2">
                    <item.icon
                      className={`w-3 h-3 mt-0.5 flex-shrink-0 ${item.color}`}
                    />
                    <div>
                      <strong className="text-teal-700">{item.label}:</strong>{' '}
                      <span className="text-teal-600">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
