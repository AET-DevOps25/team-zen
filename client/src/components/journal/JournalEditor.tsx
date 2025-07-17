import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface JournalEditorProps {
  content: string;
  isEditing: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
  onContentChange: (content: string) => void;
  onToggleEdit: () => void;
}

export const JournalEditor = ({
  content,
  isEditing,
  isLoading = false,
  loadingMessage = 'ZenAI is thinking...',
  onContentChange,
  onToggleEdit,
}: JournalEditorProps) => {
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  const handleContentClick = () => {
    if (!isLoading) {
      onToggleEdit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onToggleEdit(); // save and exit edit mode
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
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLoading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
            )}
            <button
              onClick={onToggleEdit}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isEditing
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="relative">
            <textarea
              value={content}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              className="w-full h-96 p-4 border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none font-mono text-sm transition-all duration-300 border-gray-200 bg-white"
              placeholder="Start writing your journal entry..."
              autoFocus
              disabled={isLoading}
            />

            {/* Loading Overlay */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-10"
              >
                {/* Gradient Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-teal-400 to-blue-400 opacity-30 animate-pulse rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-lg"></div>

                {/* Central Loading Content */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center space-y-3 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-white/20"
                  >
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {loadingMessage}
                    </p>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full"
                          animate={{
                            y: [0, -8, 0],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="prose prose-lg max-w-none relative">
            <div
              className={`whitespace-pre-wrap text-gray-700 leading-relaxed transition-colors rounded-lg p-2 -m-2 ${
                isLoading
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-text hover:bg-gray-50'
              }`}
              style={{ minHeight: '400px' }}
              onClick={handleContentClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                  handleContentClick();
                }
              }}
            >
              {content || 'No content yet. Click here to start writing.'}
            </div>

            {/* Loading Overlay for read-only view */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-10"
              >
                {/* Gradient Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-teal-400 to-blue-400 opacity-30 animate-pulse rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-lg"></div>

                {/* Central Loading Content */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center space-y-3 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-white/20"
                  >
                    <div className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {loadingMessage}
                    </p>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full"
                          animate={{
                            y: [0, -8, 0],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
