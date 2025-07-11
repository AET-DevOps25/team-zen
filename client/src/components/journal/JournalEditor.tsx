import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { useGetSummary } from '@/api/journal';

interface JournalEditorProps {
  content: string;
  isEditing: boolean;
  journalId?: string;
  snippetCount: number;
  onContentChange: (content: string) => void;
  onToggleEdit: () => void;
  onSummarize?: (summary: string) => void;
}

export const JournalEditor = ({
  content,
  isEditing,
  journalId,
  snippetCount,
  onContentChange,
  onToggleEdit,
  onSummarize,
}: JournalEditorProps) => {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onToggleEdit(); // save and exit edit mode
    }
  };

  const handleContentClick = () => {
    if (!isEditing) {
      onToggleEdit(); // start editing when clicking on the content
    }
  };

  const { isLoading: isSummaryLoading, refetch: fetchSummary } = useGetSummary(
    journalId || '',
    false,
  ); // Disable automatic fetching

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Journal Entry</h2>
          <div className="flex space-x-2">
            {isEditing && (
              <button
                onClick={onToggleEdit}
                disabled={isSummaryLoading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 ${
                  isSummaryLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Cancel
              </button>
            )}
            {journalId && snippetCount > 2 && isEditing && (
              <button
                onClick={handleSummarize}
                disabled={isSummaryLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>{isSummaryLoading ? 'Summarizing...' : 'Summarize'}</span>
              </button>
            )}
            <button
              onClick={onToggleEdit}
              disabled={isSummaryLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEditing
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${isSummaryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="relative">
            {isSummaryLoading && (
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-teal-400 to-blue-400 opacity-30 animate-pulse rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">
                      ZenAI is summarizing...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <textarea
              value={content}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={isSummaryLoading}
              className={`w-full h-96 p-4 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none font-mono text-sm transition-all duration-300 ${
                isSummaryLoading
                  ? 'opacity-70 cursor-not-allowed bg-gradient-to-br from-purple-50 via-teal-50 to-blue-50 border-gradient-to-r border-purple-300'
                  : 'border-gray-200 bg-white'
              }`}
              placeholder="Start writing your journal entry..."
              autoFocus={!isSummaryLoading}
            />
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <div
              className="whitespace-pre-wrap text-gray-700 leading-relaxed cursor-text hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
              style={{ minHeight: '400px' }}
              onClick={handleContentClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleContentClick();
                }
              }}
            >
              {content || 'No content yet. Click here to start writing.'}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
