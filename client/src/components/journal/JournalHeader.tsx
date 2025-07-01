import { ArrowLeft, Brain, Calendar, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JournalHeaderProps {
  journalTitle: string;
  isEditingTitle: boolean;
  activeTab: 'edit' | 'insights';
  onBackToDashboard: () => void;
  onTitleChange: (title: string) => void;
  onTitleEditStart: () => void;
  onTitleEditEnd: () => void;
  onTabChange: (tab: 'edit' | 'insights') => void;
}

export const JournalHeader = ({
  journalTitle,
  isEditingTitle,
  activeTab,
  onBackToDashboard,
  onTitleChange,
  onTitleEditStart,
  onTitleEditEnd,
  onTabChange,
}: JournalHeaderProps) => {
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onTitleEditEnd();
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBackToDashboard}
              variant="ghost-animated"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div>
              {isEditingTitle ? (
                <input
                  value={journalTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  onBlur={onTitleEditEnd}
                  onKeyDown={handleTitleKeyDown}
                  className="text-xl font-bold text-gray-800 bg-transparent border-none outline-none focus:ring-2 focus:ring-teal-500 rounded px-1"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-xl font-bold text-gray-800 cursor-pointer hover:text-teal-600 transition-colors"
                  onClick={onTitleEditStart}
                  title="Click to edit title"
                >
                  {journalTitle}
                </h1>
              )}
              <p className="text-sm text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {currentDate}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onTabChange('edit')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'edit'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit3 className="w-4 h-4 inline mr-2" />
              Edit
            </button>
            <button
              onClick={() => onTabChange('insights')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'insights'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              Insights
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
