import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { JournalEntry } from '@/model/journal';
import type { UserStatistics } from '@/model/user';
import type { ApiResponse } from './base';
import { env } from '@/env.ts';

// Get today's journal entry for the user, or a specific journal by ID
export const useGetJournal = (journalId?: string) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchJournal = async (): Promise<
    ApiResponse<JournalEntry | Array<JournalEntry>>
  > => {
    const token = await getToken();

    let url: string;
    if (journalId) {
      url = `${env.VITE_API_URL}/api/journalEntry/${user?.id}?journalId=${journalId}`;
    } else {
      // Fetch today's journal
      const today = new Date().toISOString().split('T')[0];
      url = `${env.VITE_API_URL}/api/journalEntry/${user?.id}?date=${today}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch journal: ${response.status}`);
    }

    const result = await response.json();

    return result;
  };

  const queryKey = journalId
    ? ['journal', user?.id, journalId]
    : ['journal', user?.id, new Date().toISOString().split('T')[0]];

  const { data, ...rest } = useQuery({
    queryKey,
    queryFn: fetchJournal,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: !!user?.id,
  });

  const journal = data
    ? journalId
      ? (data.data as JournalEntry) // When fetching by ID, backend returns single entry
      : Array.isArray(data.data)
        ? data.data[0] // When fetching by date, backend returns array, take first
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

  const fetchAllJournals = async (): Promise<
    ApiResponse<Array<JournalEntry>>
  > => {
    const token = await getToken();

    const response = await fetch(
      `${env.VITE_API_URL}/api/journalEntry/${user?.id}`,
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

    return response.json();
  };

  const { data, ...rest } = useQuery({
    queryKey: ['allJournals', user?.id],
    queryFn: fetchAllJournals,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const journals = data?.data || [];

  return {
    journals,
    ...rest,
  };
};

export const useUpdateJournal = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const updateJournal = async (updatedJournal: JournalEntry) => {
    const token = await getToken();
    const response = await fetch(
      `${env.VITE_API_URL}/api/journalEntry/${updatedJournal.id}`,
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
    onSuccess: (_data, variables) => {
      // Invalidate and refetch journal queries
      queryClient.invalidateQueries({
        queryKey: ['journal', user?.id],
      });

      // Invalidate all journals list
      queryClient.invalidateQueries({
        queryKey: ['allJournals', user?.id],
      });

      // Invalidate user statistics as they might have changed
      queryClient.invalidateQueries({
        queryKey: ['userStatistics', user?.id],
      });

      // Invalidate specific journal entry cache if date is available
      if (variables.date) {
        queryClient.invalidateQueries({
          queryKey: ['journal', user?.id, variables.date],
        });
      }

      // Invalidate any summary data for this journal
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ['summary', variables.id],
        });
      }
    },
  });
};

export const useGetSummary = (journalId: string, enabled: boolean = true) => {
  const { getToken } = useAuth();

  const fetchSummary = async (): Promise<string> => {
    const token = await getToken();
    const response = await fetch(
      `${env.VITE_API_URL}/api/summary/${journalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

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

export const useGenerateSummary = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const generateSummary = async (journalId: string): Promise<string> => {
    const token = await getToken();
    const response = await fetch(
      `${env.VITE_API_URL}/api/summary/${journalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to generate summary: ${response.status}`);
    }

    const data = await response.json();
    return data.summary;
  };

  return useMutation({
    mutationFn: generateSummary,
    onSuccess: (_, journalId) => {
      // Invalidate summary query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['summary', journalId] });
      // Also invalidate journal entries to get updated summary
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      queryClient.invalidateQueries({ queryKey: ['allJournals'] });
    },
  });
};

export const useGenerateInsights = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const generateInsights = async (journalId: string): Promise<void> => {
    const token = await getToken();
    const response = await fetch(
      `${env.VITE_API_URL}/api/insights/${journalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to generate insights: ${response.status}`);
    }
  };

  return useMutation({
    mutationFn: generateInsights,
    onSuccess: (_, journalId) => {
      // Invalidate insights query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['insights', journalId] });
      // Also invalidate journal entries to get updated insights
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      queryClient.invalidateQueries({ queryKey: ['allJournals'] });
    },
  });
};

export const useGetInsights = (journalId: string, enabled: boolean = true) => {
  const { getToken } = useAuth();

  const fetchInsights = async (): Promise<{
    analysis: string;
    insights: {
      moodPattern: string;
      suggestion: string;
      achievement: string;
      wellnessTip: string;
    };
  }> => {
    const token = await getToken();
    const response = await fetch(
      `${env.VITE_API_URL}/api/insights/${journalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch insights: ${response.status}`);
    }

    const data = await response.json();
    return {
      analysis: data.analysis,
      insights: data.insights,
    };
  };

  return useQuery({
    queryKey: ['insights', journalId],
    queryFn: fetchInsights,
    enabled: !!journalId && enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useGetUserStatistics = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchUserStatistics = async (): Promise<UserStatistics> => {
    const token = await getToken();
    const response = await fetch(
      `${env.VITE_API_URL}/api/journalEntry/${user?.id}/statistics`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user statistics: ${response.status}`);
    }

    return response.json();
  };

  return useQuery({
    queryKey: ['userStatistics', user?.id],
    queryFn: fetchUserStatistics,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
