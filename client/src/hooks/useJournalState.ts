import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetJournal, useUpdateJournal } from '@/api/journal';
import { useGetSnippets } from '@/api/snippet';

export const useJournalState = (journalId?: string) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'insights'>('edit');
  const [journalContent, setJournalContent] = useState<string>('');
  const [journalTitle, setJournalTitle] = useState<string>("Today's Journal");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const navigate = useNavigate();

  const { journal, isLoading } = useGetJournal(journalId);
  const { mutateAsync: updateJournal } = useUpdateJournal();

  // Get snippets for the journal's date, fallback to today if no journal date
  // Ensure date is in YYYY-MM-DD format
  const getDateFromJournal = (dateString?: string): string => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    // Handle both ISO timestamp and simple date formats
    return dateString.includes('T') ? dateString.split('T')[0] : dateString;
  };

  const journalDate = getDateFromJournal(journal?.date);
  const { snippets } = useGetSnippets({ date: journalDate });


  useEffect(() => {
    if (journal && !isLoading) {
      setJournalContent(journal.summary ?? '');
      setJournalTitle(journal.title || "Today's Journal");
    }
  }, [journal, isLoading]);

  const handleUpdate = useCallback(async () => {
    if (
      journal &&
      (journal.summary !== journalContent || journal.title !== journalTitle) &&
      journal.id
    ) {
      await updateJournal({
        ...journal,
        summary: journalContent,
        title: journalTitle,
        id: journal.id,
      });
    }
  }, [journal, journalContent, journalTitle, updateJournal]);

  const handleToggleEdit = useCallback(() => {
    if (isEditing) {
      handleUpdate();
    }
    setIsEditing(!isEditing);
  }, [isEditing, handleUpdate]);

  const handleTitleEditEnd = useCallback(() => {
    setIsEditingTitle(false);
    handleUpdate();
  }, [handleUpdate]);

  const handleGoBack = useCallback(() => {
    // Check if there's a previous page in the browser history
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to dashboard if no history available
      navigate({ to: '/dashboard' });
    }
  }, [navigate]);

  const handleSummarise = useCallback((summary: string) => {
    setJournalContent(summary);
  }, []);

  return {
    // State
    activeTab,
    journalContent,
    journalTitle,
    isEditing,
    isEditingTitle,
    snippets,
    journal,
    // Actions
    setActiveTab,
    setJournalContent,
    setJournalTitle,
    setIsEditingTitle,
    handleToggleEdit,
    handleTitleEditEnd,
    handleBackToDashboard: handleGoBack,
    handleSummarise,
  };
};
