import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-react';
import { API_BASE_URL } from './base';

export const testQuery = () => {
  const { getToken } = useAuth();

  const testFetch = async () => {
    const token = await getToken();
    console.log('Token:', token);
    const response = await fetch(`${API_BASE_URL}/api/journalEntry`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: testFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return { data, error, isLoading };
};
export const useGetJournal = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchJournal = async () => {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  return useMutation({
    mutationKey: ['getJournal'],
    mutationFn: fetchJournal,
    retry: 2,
  });
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

    return response.json();
  };

  return useMutation({
    mutationKey: ['getAllJournals'],
    mutationFn: fetchAllJournals,
    retry: 2,
  });
};

export const useUpdateJournal = () => {
  const { getToken } = useAuth();

  const updateJournal = async (updatedJournal) => {
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
