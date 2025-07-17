import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Zap } from 'lucide-react';
import { JournalEditor } from './JournalEditor';
import { QuickStats } from './QuickStats';
import { SnippetsOverview } from './SnippetsOverview';
import type { Snippet } from '@/model/snippet';
import { useGetSummary } from '@/api/journal';

interface EditTabProps {
  journalContent: string;
  isEditing: boolean;
  snippets: Array<Snippet>;
  journalId?: string;
  onContentChange: (content: string) => void;
  onToggleEdit: () => void;
  onSummarize?: (summary: string) => void;
  generateJournalFromSnippets?: () => void;
  generateAIInsights?: (content: string, snippets: Array<Snippet>) => void;
  isGenerating?: boolean;
  isGeneratingInsights?: boolean;
}

export const EditTab = ({
  journalContent,
  isEditing,
  snippets,
  journalId,
  onContentChange,
  onToggleEdit,
  onSummarize,
  generateJournalFromSnippets,
  generateAIInsights,
  isGenerating = false,
  isGeneratingInsights = false,
}: EditTabProps) => {
  const { isLoading: isSummaryLoading, refetch: fetchSummary } = useGetSummary(
    journalId || '',
    false,
  );

  const handleSummarize = async () => {
    if (journalId && onSummarize) {
      try {
        const result = await fetchSummary();
        if (result.data) {
          onSummarize(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <JournalEditor
          content={journalContent}
          isEditing={isEditing}
          isLoading={isGenerating || isGeneratingInsights || isSummaryLoading}
          loadingMessage={
            isGenerating
              ? 'ZenAI is generating your journal...'
              : isGeneratingInsights
                ? 'ZenAI is analyzing your insights...'
                : isSummaryLoading
                  ? 'ZenAI is summarizing your content...'
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
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:shadow-none font-medium"
                whileHover={{
                  scale: isGenerating || snippets.length === 0 ? 1 : 1.02,
                }}
                whileTap={{
                  scale: isGenerating || snippets.length === 0 ? 1 : 0.98,
                }}
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
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
                onClick={() => generateAIInsights(journalContent, snippets)}
                disabled={isGeneratingInsights || !journalContent.trim()}
                className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:shadow-none font-medium"
                whileHover={{
                  scale:
                    isGeneratingInsights || !journalContent.trim() ? 1 : 1.02,
                }}
                whileTap={{
                  scale:
                    isGeneratingInsights || !journalContent.trim() ? 1 : 0.98,
                }}
              >
                {isGeneratingInsights ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>
                  {isGeneratingInsights ? 'Analyzing...' : 'Generate Insights'}
                </span>
              </motion.button>
            )}

            {journalId && snippets.length > 2 && (
              <motion.button
                onClick={handleSummarize}
                disabled={isSummaryLoading || !journalContent.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:shadow-none font-medium"
                whileHover={{
                  scale: isSummaryLoading || !journalContent.trim() ? 1 : 1.02,
                }}
                whileTap={{
                  scale: isSummaryLoading || !journalContent.trim() ? 1 : 0.98,
                }}
              >
                {isSummaryLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>
                  {isSummaryLoading ? 'Summarizing...' : 'Summarize Journal'}
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
