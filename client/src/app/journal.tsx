import { useParams } from '@tanstack/react-router';
import { EditTab } from '@/components/journal/EditTab';
import { InsightsTab } from '@/components/journal/InsightsTab';
import { JournalHeader } from '@/components/journal/JournalHeader';
import { useJournalState } from '@/hooks';

const JournalView = () => {
  const params = useParams({ strict: false });
  const journalId = (params as { journalId?: string }).journalId;

  const {
    activeTab,
    journalContent,
    journalTitle,
    isEditing,
    isEditingTitle,
    isGeneratingInsights,
    isGeneratingSummary,
    snippets,
    journal,
    setActiveTab,
    setJournalContent,
    setJournalTitle,
    setIsEditingTitle,
    handleToggleEdit,
    handleTitleEditEnd,
    handleBackToDashboard,
    handleGenerateInsights,
    handleGenerateJournalFromSnippets,
  } = useJournalState(journalId);

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

      <div className="container mx-auto py-8">
        {activeTab === 'edit' ? (
          <EditTab
            journalContent={journalContent}
            isEditing={isEditing}
            snippets={snippets}
            onContentChange={setJournalContent}
            onToggleEdit={handleToggleEdit}
            generateJournalFromSnippets={handleGenerateJournalFromSnippets}
            generateAIInsights={handleGenerateInsights}
            isGenerating={isGeneratingSummary}
            isGeneratingInsights={isGeneratingInsights}
          />
        ) : (
          <InsightsTab snippets={snippets} journal={journal} />
        )}
      </div>
    </div>
  );
};

export default JournalView;
