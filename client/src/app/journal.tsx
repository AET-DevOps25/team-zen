import { EditTab } from '@/components/journal/EditTab';
import { InsightsTab } from '@/components/journal/InsightsTab';
import { JournalHeader } from '@/components/journal/JournalHeader';
import { useJournalState } from '@/components/journal/useJournalState';

const JournalView = () => {
  const {
    activeTab,
    journalContent,
    journalTitle,
    isEditing,
    isEditingTitle,
    snippets,
    journal,
    setActiveTab,
    setJournalContent,
    setJournalTitle,
    setIsEditingTitle,
    handleToggleEdit,
    handleTitleEditEnd,
    handleBackToDashboard,
    handleSummarise,
  } = useJournalState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <JournalHeader
        journalTitle={journalTitle}
        isEditingTitle={isEditingTitle}
        activeTab={activeTab}
        onBackToDashboard={handleBackToDashboard}
        onTitleChange={setJournalTitle}
        onTitleEditStart={() => setIsEditingTitle(true)}
        onTitleEditEnd={handleTitleEditEnd}
        onTabChange={setActiveTab}
      />

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'edit' ? (
          <EditTab
            journalContent={journalContent}
            isEditing={isEditing}
            snippets={snippets}
            journalId={journal?.id}
            onContentChange={setJournalContent}
            onToggleEdit={handleToggleEdit}
            onSummarise={handleSummarise}
          />
        ) : (
          <InsightsTab snippets={snippets} />
        )}
      </div>
    </div>
  );
};

export default JournalView;
