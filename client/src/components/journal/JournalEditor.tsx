import { motion } from 'framer-motion';

interface JournalEditorProps {
  content: string;
  isEditing: boolean;
  onContentChange: (content: string) => void;
  onToggleEdit: () => void;
}

export const JournalEditor = ({
  content,
  isEditing,
  onContentChange,
  onToggleEdit,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Journal Entry</h2>
          <button
            onClick={onToggleEdit}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEditing
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <textarea
            value={content}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none font-mono text-sm"
            placeholder="Start writing your journal entry..."
            autoFocus
          />
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
