import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Edit3, Zap } from 'lucide-react';
import { SnippetCard } from './SnippetCard';
import type { Snippet } from '@/model/snippet';
import { Button } from '@/components/ui/button';

interface SnippetsListProps {
  snippets: Array<Snippet>;
  isLoading: boolean;
  journalContent: any;
  onViewJournal: () => void;
}

export const SnippetsList = ({
  snippets,
  isLoading,
  journalContent,
  onViewJournal,
}: SnippetsListProps) => {
  return (
    <div className="space-y-4 mt-6">
      <h3 className="font-semibold text-gray-800 flex items-center">
        <Edit3 className="w-4 h-4 mr-2" />
        Today's Snippets
      </h3>

      {/* Journal Creation Prompt */}
      {snippets.length > 2 && !journalContent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-800">
                  Ready to journal?
                </h3>
                <p className="text-sm text-gray-600">
                  You have {snippets.length} snippets to aggregate
                </p>
              </div>
            </div>
            <Button onClick={onViewJournal} variant="purple-animated">
              <BookOpen className="w-4 h-4" />
              <span>Create Journal</span>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Snippets */}
      <AnimatePresence>
        {!isLoading &&
          snippets.map((snippet, index) => (
            <SnippetCard key={snippet.id} snippet={snippet} index={index} />
          ))}
      </AnimatePresence>

      {/* Empty State */}
      {!isLoading && snippets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Edit3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No snippets yet today. Start by adding your first thought!</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8 text-gray-500">
          <p>Loading today's snippets...</p>
        </div>
      )}
    </div>
  );
};
