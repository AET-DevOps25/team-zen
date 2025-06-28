import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetJournal, useUpdateJournal } from '@/api/journal';
import { useGetSnippets } from '@/api/snippet';

export const useJournalState = () => {
  const [activeTab, setActiveTab] = useState<'edit' | 'insights'>('edit');
  const [journalContent, setJournalContent] = useState<string>('');
  const [journalTitle, setJournalTitle] = useState<string>("Today's Journal");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const navigate = useNavigate();
  const { snippets } = useGetSnippets();
  const { journal, isLoading } = useGetJournal();
  const { mutateAsync: updateJournal } = useUpdateJournal();

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
        content: journal.content || '',
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

  const handleBackToDashboard = useCallback(() => {
    navigate({ to: '/dashboard' });
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
    handleBackToDashboard,
    handleSummarise,
  };
};
