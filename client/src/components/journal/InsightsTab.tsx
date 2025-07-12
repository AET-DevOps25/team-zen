import { motion } from 'framer-motion';
import { BlendIcon } from 'lucide-react';
import { AiInsights } from '../today/AIInsights';
import { MoodTimeline } from './MoodTimeline';
import { ThemesAndTags } from './ThemesAndTags';
import type { Snippet } from '@/model/snippet';
import type { JournalEntry } from '@/model/journal';

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
