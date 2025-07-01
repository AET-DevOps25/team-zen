import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TodayJournalHeaderProps {
  journalContent: string | null;
  isLoading: boolean;
  onCreateSnippet: () => void;
  onViewJournal: () => void;
}

export const TodayJournalHeader = ({
  journalContent,
  isLoading,
  onCreateSnippet,
  onViewJournal,
}: TodayJournalHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Today's Journal</h1>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      <div className="flex space-x-3">
        <Button onClick={onCreateSnippet} variant="teal-animated">
          <Plus className="w-4 h-4" />
          <span>Add Snippet</span>
        </Button>
        {journalContent && (
          <Button
            onClick={onViewJournal}
            variant="blue-animated"
            disabled={isLoading}
          >
            <BookOpen className="w-4 h-4" />
            <span>View Journal</span>
          </Button>
        )}
      </div>
    </div>
  );
};
