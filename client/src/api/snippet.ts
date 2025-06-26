import { useAuth, useUser } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { API_BASE_URL } from './base';

type SnippetData = {
  title?: string;
  content?: string;
};

export const useCreateSnippet = () => {
  const { getToken } = useAuth();

  const createSnippet = async (snippetData: SnippetData) => {
    const token = await getToken();

    const response = await fetch(`${API_BASE_URL}/api/snippets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(snippetData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  return useMutation({
    mutationKey: ['createSnippet'],
    mutationFn: createSnippet,
    retry: 2,
  });
};

export const useGetSnippets = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchSnippets = async () => {
    const token = await getToken();
    const today = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `${API_BASE_URL}/api/snippets/${user?.id}?date=${today}`,
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
    mutationKey: ['getSnippets'],
    mutationFn: fetchSnippets,
    retry: 2,
  });
};
