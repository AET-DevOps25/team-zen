import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Zap } from 'lucide-react';
import { JournalEditor } from './JournalEditor';
import { QuickStats } from './QuickStats';
import { SnippetsOverview } from './SnippetsOverview';
import type { Snippet } from '@/model/snippet';

interface EditTabProps {
  journalContent: string;
  isEditing: boolean;
  snippets: Array<Snippet>;
  onContentChange: (content: string) => void;
  onToggleEdit: () => void;
  generateJournalFromSnippets?: () => void;
  generateAIInsights?: () => void;
  isGenerating?: boolean;
  isGeneratingInsights?: boolean;
}

export const EditTab = ({
  journalContent,
  isEditing,
  snippets,
  onContentChange,
  onToggleEdit,
  generateJournalFromSnippets,
  generateAIInsights,
  isGenerating = false,
  isGeneratingInsights = false,
}: EditTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
      <div className="lg:col-span-3">
        <JournalEditor
          content={journalContent}
          isEditing={isEditing}
          isLoading={isGenerating || isGeneratingInsights}
          loadingMessage={
            isGenerating
              ? 'ZenAI is generating your journal...'
              : isGeneratingInsights
                ? 'ZenAI is analyzing your insights...'
                : 'ZenAI is thinking...'
          }
          onContentChange={onContentChange}
          onToggleEdit={onToggleEdit}
        />
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="space-y-3">
            {generateJournalFromSnippets && (
              <motion.button
                onClick={generateJournalFromSnippets}
                disabled={isGenerating || snippets.length === 0}
                className={`w-full px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:shadow-none font-medium ${
                  isGenerating
                    ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-white animate-pulse'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white'
                }`}
                whileHover={{
                  scale: isGenerating || snippets.length === 0 ? 1 : 1.02,
                }}
                whileTap={{
                  scale: isGenerating || snippets.length === 0 ? 1 : 0.98,
                }}
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>
                  {isGenerating ? 'Generating...' : 'Regenerate Journal'}
                </span>
              </motion.button>
            )}

            {generateAIInsights && (
              <motion.button
                onClick={() => generateAIInsights()}
                disabled={isGeneratingInsights || snippets.length === 0}
                className={`w-full px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:shadow-none font-medium ${
                  isGeneratingInsights
                    ? 'bg-gradient-to-r from-teal-400 to-green-400 text-white animate-pulse'
                    : 'bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white'
                }`}
                whileHover={{
                  scale:
                    isGeneratingInsights || snippets.length === 0 ? 1 : 1.02,
                }}
                whileTap={{
                  scale:
                    isGeneratingInsights || snippets.length === 0 ? 1 : 0.98,
                }}
              >
                {isGeneratingInsights ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>
                  {isGeneratingInsights ? 'Analyzing...' : 'Generate Insights'}
                </span>
              </motion.button>
            )}
          </div>
        </motion.div>

        <SnippetsOverview snippets={snippets} />
        <QuickStats snippets={snippets} journalContent={journalContent} />
      </div>
    </div>
  );
};
