import { JournalEditor } from './JournalEditor';
import { QuickStats } from './QuickStats';
import { SnippetsOverview } from './SnippetsOverview';
import type { Snippet } from '@/model/snippet';

interface EditTabProps {
  journalContent: string;
  isEditing: boolean;
  snippets: Array<Snippet>;
  journalId?: string;
  onContentChange: (content: string) => void;
  onToggleEdit: () => void;
  onSummarize?: (summary: string) => void;
}

export const EditTab = ({
  journalContent,
  isEditing,
  snippets,
  journalId,
  onContentChange,
  onToggleEdit,
  onSummarize,
}: EditTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <JournalEditor
          content={journalContent}
          isEditing={isEditing}
          journalId={journalId}
          snippetCount={snippets.length}
          onContentChange={onContentChange}
          onToggleEdit={onToggleEdit}
          onSummarize={onSummarize}
        />
      </div>

      <div className="space-y-6">
        <SnippetsOverview snippets={snippets} />
        <QuickStats snippets={snippets} journalContent={journalContent} />
      </div>
    </div>
  );
};
