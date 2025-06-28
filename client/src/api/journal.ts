import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from './base';
import type { ApiResponse } from './base';
import type { JournalEntry } from '@/model/journal';

// Get today's journal entry for the user
export const useGetJournal = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchJournal = async (): Promise<
    ApiResponse<JournalEntry | Array<JournalEntry>>
  > => {
    const token = await getToken();
    const today = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `${API_BASE_URL}/api/journalEntry/${user?.id}?date=${today}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch journal: ${response.status}`);
    }

    return response.json();
  };

  const { data, ...rest } = useQuery({
    queryKey: ['journal', user?.id, new Date().toISOString().split('T')[0]],
    queryFn: fetchJournal,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: !!user?.id,
  });

  const journal = data
    ? Array.isArray(data.data)
      ? data.data[0]
      : data.data
    : undefined;

  return {
    journal,
    ...rest,
  };
};

export const useGetAllJournals = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchAllJournals = async () => {
    const token = await getToken();

    const response = await fetch(
      `${API_BASE_URL}/api/journalEntry/${user?.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<Array<JournalEntry>>;
  };

  return useMutation({
    mutationKey: ['getAllJournals'],
    mutationFn: fetchAllJournals,
    retry: 2,
  });
};

export const useUpdateJournal = () => {
  const { getToken } = useAuth();

  const updateJournal = async (updatedJournal: JournalEntry) => {
    const token = await getToken();
    const response = await fetch(
      `${API_BASE_URL}/api/journalEntry/${updatedJournal.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedJournal),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to update journal. Status: ${response.status}`);
    }

    return response.json();
  };

  return useMutation({
    mutationKey: ['updateJournal'],
    mutationFn: updateJournal,
    retry: 1,
  });
};

export const useGetSummary = (journalId: string, enabled: boolean = true) => {
  const { getToken } = useAuth();

  const fetchSummary = async (): Promise<string> => {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}/api/summary/${journalId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch summary: ${response.status}`);
    }

    const data = await response.json();
    return data.summary;
  };

  return useQuery({
    queryKey: ['summary', journalId],
    queryFn: fetchSummary,
    enabled: !!journalId && enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
