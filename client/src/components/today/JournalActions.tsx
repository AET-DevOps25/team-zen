import { BookOpen, Plus } from 'lucide-react';
import type { Snippet } from '@/model/snippet';
import { Button } from '@/components/ui/button';

interface JournalActionsProps {
  snippets: Array<Snippet>;
  journalContent: any;
  isLoading: boolean;
  onCreateSnippet: () => void;
  onViewJournal: () => void;
}

export const JournalActions = ({
  onCreateSnippet,
  onViewJournal,
  journalContent,
  isLoading,
}: JournalActionsProps) => {
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
